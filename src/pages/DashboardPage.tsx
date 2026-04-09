import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, TrendingUp, MessageSquare, Settings, LogOut, Zap, Bell, ChevronDown, Check, Star, Send } from 'lucide-react';
import { getUser, clearUser } from '../utils/auth';

/* ── MINI CHART ── */
function Sparkline({ data, color = '#18C98A' }: { data: number[]; color?: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const W = 80, H = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (W - 4) + 2;
    const y = H - 4 - ((v - min) / (max - min || 1)) * (H - 8);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity=".8" />
    </svg>
  );
}

/* ── BAR CHART ── */
function BarChart({ data }: { data: { label: string; value: number; target: number; current?: boolean }[] }) {
  const max = 50;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160, padding: '0 4px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%' }}>
          <div style={{ flex: 1, width: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            {/* target */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${(d.target / max) * 100}%`, background: 'rgba(24,201,138,.12)', borderRadius: '3px 3px 0 0' }} />
            {/* actual */}
            <motion.div initial={{ height: 0 }} animate={{ height: `${(d.value / max) * 100}%` }} transition={{ delay: i * .06, duration: .6, ease: [.4, 0, .2, 1] }} style={{ width: '100%', background: d.current ? 'linear-gradient(180deg, #39FFB2, #18C98A)' : 'rgba(24,201,138,.45)', borderRadius: '3px 3px 0 0', position: 'relative', zIndex: 1, boxShadow: d.current ? '0 0 12px rgba(24,201,138,.4)' : 'none' }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: d.current ? 700 : 400, color: d.current ? 'var(--apex-bright)' : 'rgba(255,255,255,.3)' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── LINE SVG ── */
function LineChart({ data, color = '#18C98A', height = 140 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data) * 1.1, min = Math.min(...data) * 0.9;
  const W = 500, H = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (W - 20) + 10;
    const y = H - 10 - ((v - min) / (max - min || 1)) * (H - 20);
    return [x, y] as [number, number];
  });
  const linePath  = `M ${pts.map(p => p.join(',')).join(' L ')}`;
  const areaPath  = `M ${pts[0][0]},${H} L ${pts.map(p => p.join(',')).join(' L ')} L ${pts[pts.length-1][0]},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height }} overflow="visible">
      <defs>
        <linearGradient id={`area-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity=".25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#area-${color.replace('#','')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={i === data.length - 1 ? color : 'var(--ink-80)'} stroke={color} strokeWidth="2" />
      ))}
    </svg>
  );
}

/* ── WEEK PROGRESS ── */
function WeekStrip({ current = 4, total = 10 }: { current?: number; total?: number }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: total }, (_, i) => (
        <motion.div key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * .04 }} style={{ flex: 1, height: 5, borderRadius: 3, background: i < current - 1 ? 'var(--apex-bright)' : i === current - 1 ? 'rgba(24,201,138,.5)' : 'rgba(255,255,255,.1)', boxShadow: i === current - 1 ? '0 0 8px rgba(24,201,138,.4)' : 'none' }} />
      ))}
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function DashboardPage() {
  const [activePage, setActivePage] = useState<'dashboard'|'program'|'progress'|'messages'|'settings'>('dashboard');
  const [expandedWeek, setExpandedWeek]    = useState<number | null>(3);
  const [msgInput, setMsgInput]            = useState('');
  const [messages, setMessages]            = useState([
    { from: 'coach', text: "Hey Alex! Great effort on Sunday's run. Keep it conversational next time. How did your legs feel?", ts: '10:14 AM' },
    { from: 'me',    text: 'Felt strong! A little tight in the calf but nothing serious. Stretched properly after.', ts: '10:31 AM' },
    { from: 'coach', text: "Good. Keep an eye on that calf. Wednesday's tempo — aim for 4:55–5:00/km on the 3×2km blocks.", ts: '10:35 AM' },
    { from: 'coach', text: "Great tempo session 💪 Today's long run — 5:10/km first 12km, then push to 5:00 for the last stretch. You're on track for sub-1:50!", ts: '8:02 AM', day: 'Today' },
    { from: 'me',    text: "Thanks Sara! Feeling really good. I'll stick to the plan 🏃", ts: '8:45 AM' },
  ]);
  const [settingsTab, setSettingsTab] = useState<'profile'|'goals'|'notifications'|'privacy'|'account'>('profile');
  const [goals, setGoals] = useState(['Complete first half-marathon', 'Improve 5K time', 'Build endurance base']);
  const [toggles, setToggles] = useState({ sessions: true, coach: true, weekly: true, pbs: true, updates: false, marketing: false });

  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, []);

  function signOut() { clearUser(); navigate('/'); }

  function sendMsg() {
    if (!msgInput.trim()) return;
    const now = new Date();
    setMessages(m => [...m, { from: 'me', text: msgInput, ts: `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}` }]);
    setMsgInput('');
  }

  if (!user) return null;
  const initials = `${user.fname[0]}${(user.lname || '')[0] || ''}`.toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'program',   icon: Calendar,        label: 'My Program' },
    { id: 'progress',  icon: TrendingUp,      label: 'Progress'   },
    { id: 'messages',  icon: MessageSquare,   label: 'Messages', badge: 2 },
    { id: 'settings',  icon: Settings,        label: 'Settings'  },
  ] as const;

  const weekData = [
    { label:'W1', value:22, target:28 }, { label:'W2', value:26, target:30 },
    { label:'W3', value:31, target:32 }, { label:'W4', value:29, target:32 },
    { label:'W5', value:34, target:35 }, { label:'W6', value:33, target:36 },
    { label:'W7', value:36, target:38 }, { label:'W8', value:38, target:40, current: true },
  ];

  const programWeeks = [
    { n: 1, title: 'Foundation week',      sub: 'Easy mileage build',             done: true,    sessions: [{ name:'Easy run 6km', detail:'Zone 2 · 35min', done:true, icon:'🏃' }, { name:'Rest & stretch', detail:'Recovery · 20min', done:true, icon:'💤' }, { name:'Tempo run 4km', detail:'5:10/km · 25min', done:true, icon:'🏃' }, { name:'Long run 10km', detail:'Easy pace · 60min', done:true, icon:'🏃' }] },
    { n: 2, title: 'Base building',         sub: '+10% volume',                    done: true,    sessions: [{ name:'Easy run 7km', detail:'Conversational · 40min', done:true, icon:'🏃' }, { name:'Strength & core', detail:'Gym · 45min', done:true, icon:'💪' }, { name:'Intervals 5×800m', detail:'4:45/km · 50min', done:true, icon:'🏃' }, { name:'Long run 12km', detail:'Easy · 70min', done:true, icon:'🏃' }] },
    { n: 3, title: 'Aerobic development',   sub: 'Quality sessions introduced',    done: true,    sessions: [{ name:'Easy run 7km', detail:'HR zone 2 · 40min', done:true, icon:'🏃' }, { name:'Rest day', detail:'Full recovery', done:true, icon:'💤' }, { name:'Tempo 2×3km', detail:'5:00/km · 45min', done:true, icon:'🏃' }, { name:'Long run 14km', detail:'Negative split · 85min', done:true, icon:'🏃' }] },
    { n: 4, title: 'Threshold week',        sub: 'Current — key tempo session',    current: true, sessions: [{ name:'Easy run 8km', detail:'Zone 2 · 45min', done:true, icon:'🏃' }, { name:'Rest & mobility', detail:'20min', done:true, icon:'💤' }, { name:'Tempo 3×2km', detail:'4:55/km · 50min', done:true, icon:'🏃' }, { name:'Long run 18km', detail:'5:10 → 5:00/km · 95min', done:false, icon:'🏃' }, { name:'Recovery jog 5km', detail:'Easy · 30min', done:false, icon:'🏃' }] },
    { n: 5, title: 'Volume peak',           sub: 'Highest mileage week',           future: true,  sessions: [{ name:'Easy run 8km', detail:'Zone 2', done:false, icon:'🏃' }, { name:'Strength', detail:'Gym · 45min', done:false, icon:'💪' }, { name:'Intervals 6×1km', detail:'4:50/km', done:false, icon:'🏃' }, { name:'Long run 20km', detail:'Goal pace last 5km', done:false, icon:'🏃' }] },
    { n: 6, title: 'Recovery week',         sub: 'Back off 20%',                   future: true,  sessions: [{ name:'Easy run 6km', detail:'Very easy', done:false, icon:'🏃' }, { name:'Rest', detail:'Full rest day', done:false, icon:'💤' }, { name:'Tempo 2×2km', detail:'Relaxed effort', done:false, icon:'🏃' }, { name:'Long run 14km', detail:'Easy pace', done:false, icon:'🏃' }] },
    { n: 7, title: 'Race simulation',       sub: 'Practice race conditions',       future: true,  sessions: [{ name:'Easy run 8km', detail:'Zone 2', done:false, icon:'🏃' }, { name:'Strength', detail:'45min gym', done:false, icon:'💪' }, { name:'Race sim 10km', detail:'Target race pace', done:false, icon:'🏃' }, { name:'Long run 18km', detail:'Last 4km at race pace', done:false, icon:'🏃' }] },
    { n: 8, title: 'Peak week',             sub: 'Maximum fitness',                future: true,  sessions: [{ name:'Easy run 8km', detail:'Zone 2', done:false, icon:'🏃' }, { name:'Rest & mobility', detail:'Foam rolling', done:false, icon:'💤' }, { name:'Threshold 3×3km', detail:'4:58/km', done:false, icon:'🏃' }, { name:'Long run 22km', detail:'Last 6km at race pace', done:false, icon:'🏃' }] },
    { n: 9, title: 'Taper week 1',          sub: 'Reduce volume, keep intensity',  future: true,  sessions: [{ name:'Easy run 6km', detail:'Very relaxed', done:false, icon:'🏃' }, { name:'Strides 4×100m', detail:'After easy run', done:false, icon:'🏃' }, { name:'Tempo 1×4km', detail:'Race pace', done:false, icon:'🏃' }, { name:'Long run 14km', detail:'Easy pace', done:false, icon:'🏃' }] },
    { n: 10, title: 'Race week',            sub: 'Light, sharp, confident',        future: true,  sessions: [{ name:'Easy run 4km', detail:'Very easy', done:false, icon:'🏃' }, { name:'Rest', detail:'Full rest', done:false, icon:'💤' }, { name:'Shakeout 3km', detail:'Easy + 2 strides', done:false, icon:'🏃' }, { name:'🏁 SF Half Marathon', detail:'Goal: sub 1:50!', done:false, icon:'🏁' }] },
  ];

  const card = { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '1.5rem' };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#080E0C' }}>

      {/* ── SIDEBAR ── */}
      <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} transition={{ duration: .5, ease: [.4,0,.2,1] }}
        style={{ width: 220, background: 'rgba(3,33,26,.95)', borderRight: '1px solid rgba(255,255,255,.07)', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2.5rem', paddingLeft: 4 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #0D6B52, #18C98A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(24,201,138,.3)' }}>
            <Zap size={15} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'white', fontWeight: 600 }}>Apex<span style={{ color: 'var(--apex-bright)', fontStyle: 'italic' }}>Sport</span></span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <motion.button
              key={item.id}
              onClick={() => setActivePage(item.id as typeof activePage)}
              whileHover={{ x: 3 }}
              whileTap={{ scale: .97 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', border: 'none', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, transition: 'all .15s', background: activePage === item.id ? 'rgba(24,201,138,.15)' : 'transparent', color: activePage === item.id ? 'var(--apex-bright)' : 'rgba(255,255,255,.5)', position: 'relative' }}
            >
              <item.icon size={16} />
              {item.label}
              {'badge' in item && item.badge && (
                <span style={{ marginLeft: 'auto', background: 'var(--apex-bright)', color: 'var(--ink)', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 100 }}>{item.badge}</span>
              )}
              {activePage === item.id && (
                <motion.div layoutId="sidebar-active" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--apex-bright)', borderRadius: '0 3px 3px 0' }} />
              )}
            </motion.button>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'rgba(255,255,255,.05)', marginBottom: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--apex-mid), var(--apex-bright))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.fname} {user.lname}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.program}</div>
            </div>
          </div>
          <button onClick={signOut} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,.35)', fontFamily: 'var(--font-body)', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,.1)'; e.currentTarget.style.color = '#FCA5A5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,.35)'; }}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </motion.aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{ height: 58, background: 'rgba(8,14,12,.95)', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', flexShrink: 0, backdropFilter: 'blur(10px)' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{greeting}, {user.fname} 👋</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 1 }}>Saturday, April 4 · Week 4 of 10</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={15} color="rgba(255,255,255,.55)" />
              <div style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, background: 'var(--apex-bright)', borderRadius: '50%', border: '1.5px solid #080E0C' }} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activePage} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .3 }}>

              {/* ════ DASHBOARD ════ */}
              {activePage === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Stat cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                    {[
                      { label: 'Distance', value: '38.4', unit: 'km', delta: '+12%', up: true, color: 'var(--apex-bright)', icon: '🏃', spark: [22,28,31,26,34,33,36,38] },
                      { label: 'Avg Pace',  value: '4:58', unit: '/km', delta: '+8%',  up: true, color: '#60A5FA',            icon: '⏱', spark: [5.4,5.3,5.2,5.3,5.1,5.1,5.0,4.9] },
                      { label: 'Heart Rate',value: '142',  unit: 'bpm', delta: '−3',   up: false,color: '#F87171',            icon: '❤', spark: [148,145,146,143,144,142,143,142] },
                      { label: 'Calories',  value: '2,140',unit: 'kcal',delta: '+5%',  up: true, color: '#F59E0B',            icon: '🔥', spark: [1800,1900,2000,1950,2050,2100,2120,2140] },
                    ].map((s, i) => (
                      <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*.07 }} style={{ ...card, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${s.color}15 0%, transparent 70%)`, pointerEvents: 'none' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                          <span style={{ fontSize: 20 }}>{s.icon}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: s.up ? 'rgba(24,201,138,.12)' : 'rgba(239,68,68,.12)', color: s.up ? 'var(--apex-bright)' : '#FCA5A5' }}>{s.delta}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'white', lineHeight: 1 }}>{s.value}<span style={{ fontSize: 14, color: 'rgba(255,255,255,.35)', fontFamily: 'var(--font-body)', fontWeight: 400 }}> {s.unit}</span></div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 4, marginBottom: 10 }}>{s.label} this week</div>
                        <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ delay: .4 + i*.07, duration: .6 }} style={{ height: '100%', background: s.color, borderRadius: 2 }} />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
                    <div style={card}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>Weekly distance</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>km per week · last 8 weeks</div>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {['8W','3M','All'].map(t => <button key={t} style={{ padding: '5px 12px', borderRadius: 100, border: t === '8W' ? '1px solid rgba(24,201,138,.4)' : '1px solid rgba(255,255,255,.1)', background: t === '8W' ? 'rgba(24,201,138,.12)' : 'transparent', color: t === '8W' ? 'var(--apex-bright)' : 'rgba(255,255,255,.4)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{t}</button>)}
                        </div>
                      </div>
                      <BarChart data={weekData} />
                      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                        {[{ c: 'rgba(24,201,138,.4)', l: 'Past' }, { c: '#39FFB2', l: 'Current' }, { c: 'rgba(24,201,138,.12)', l: 'Target' }].map(l => (
                          <div key={l.l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,.35)' }}>
                            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.c }} />{l.l}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 100, background: 'rgba(24,201,138,.12)', border: '1px solid rgba(24,201,138,.25)', color: 'var(--apex-bright)' }}>Running</span>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 100, background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.25)', color: '#60A5FA' }}>Amateur</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 2 }}>{user.program}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Coach Sara Chen</div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>
                          <span>Week 4 of 10</span><span style={{ color: 'var(--apex-bright)', fontWeight: 600 }}>40%</span>
                        </div>
                        <WeekStrip current={4} total={10} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.4)', marginBottom: 2 }}>This week</div>
                      {[{ n:'Easy run',      d:'Mon', done:true }, { n:'Tempo intervals',d:'Wed', done:true }, { n:'Long run',       d:'Sat', done:false, today:true }, { n:'Recovery jog',  d:'Sun', done:false }].map(s => (
                        <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.done ? 'var(--apex-bright)' : s.today ? 'rgba(24,201,138,.4)' : 'rgba(255,255,255,.15)', border: s.today ? '1.5px solid var(--apex-bright)' : 'none', flexShrink: 0 }} />
                          <span style={{ flex: 1, fontSize: 13, color: s.done ? 'rgba(255,255,255,.5)' : 'white' }}>{s.n}</span>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.25)' }}>{s.d}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: s.done ? 'rgba(24,201,138,.1)' : s.today ? 'rgba(59,130,246,.12)' : 'rgba(255,255,255,.05)', color: s.done ? 'var(--apex-bright)' : s.today ? '#60A5FA' : 'rgba(255,255,255,.3)' }}>{s.done ? 'Done' : s.today ? 'Today' : 'Soon'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    {/* Upcoming */}
                    <div style={card}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Upcoming sessions</div>
                      {[{ day:'4', dow:'SAT', name:'Long run — 18 km', meta:'7:00 AM · ~1h 35m', type:'Run', today:true }, { day:'5', dow:'SUN', name:'Recovery jog — 5 km', meta:'Easy · ~30m', type:'Rest' }, { day:'7', dow:'TUE', name:'Strength & core', meta:'45 min · Gym', type:'Strength' }, { day:'9', dow:'THU', name:'Tempo run — 10 km', meta:'Threshold · ~52m', type:'Run' }].map(s => (
                        <div key={s.day} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                          <div style={{ width: 38, height: 42, borderRadius: 8, background: s.today ? 'rgba(24,201,138,.15)' : 'rgba(255,255,255,.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: s.today ? '1px solid rgba(24,201,138,.3)' : 'none' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: s.today ? 'var(--apex-bright)' : 'white', lineHeight: 1 }}>{s.day}</span>
                            <span style={{ fontSize: 9, color: s.today ? 'rgba(24,201,138,.7)' : 'rgba(255,255,255,.3)' }}>{s.dow}</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'white', marginBottom: 2 }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>{s.meta}</div>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, alignSelf: 'flex-start', background: s.type === 'Run' ? 'rgba(24,201,138,.1)' : s.type === 'Strength' ? 'rgba(245,158,11,.1)' : 'rgba(255,255,255,.06)', color: s.type === 'Run' ? 'var(--apex-bright)' : s.type === 'Strength' ? '#F59E0B' : 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.type}</span>
                        </div>
                      ))}
                    </div>
                    {/* Metrics */}
                    <div style={card}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Performance metrics</div>
                      {[
                        { label:'Total sessions', value:'3 of 4', icon:'🏃', spark:[3,4,3,4,4,3,4,3],   color:'var(--apex-bright)' },
                        { label:'Training load',  value:'342 TSS',icon:'⏱', spark:[280,310,295,320,330,315,340,342], color:'#60A5FA' },
                        { label:'Avg sleep',      value:'7.4 hrs', icon:'💤', spark:[6.8,7.2,6.9,7.5,7.1,7.3,7.6,7.4], color:'#A78BFA' },
                        { label:'Readiness',      value:'84/100',  icon:'⚡', spark:[72,78,75,80,79,82,83,84],  color:'#F59E0B' },
                      ].map(m => (
                        <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{m.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 1 }}>{m.label}</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{m.value}</div>
                          </div>
                          <Sparkline data={m.spark} color={m.color} />
                        </div>
                      ))}
                    </div>
                    {/* Coach card */}
                    <div style={{ ...card, background: 'linear-gradient(160deg, rgba(13,107,82,.6) 0%, rgba(3,33,26,.8) 100%)', border: '1px solid rgba(24,201,138,.2)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #E1F5EE88, #08504144)', border: '2px solid rgba(24,201,138,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--apex-bright)' }}>SC</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Sara Chen</div>
                          <div style={{ fontSize: 11, color: 'rgba(24,201,138,.6)' }}>● Online · Your coach</div>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: '12px' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--apex-bright)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>Latest note</div>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.55 }}>Great tempo Wednesday, Alex 💪 Today — 5:10/km first 12km, push to 5:00 on the last stretch. You're on track for sub-1:50!</p>
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)' }}>2 hours ago</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                        <button onClick={() => setActivePage('messages')} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Reply</button>
                        <button onClick={() => setActivePage('program')} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>View plan</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ════ MY PROGRAM ════ */}
              {activePage === 'program' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ ...card, background: 'linear-gradient(135deg, rgba(13,107,82,.7) 0%, rgba(3,33,26,.9) 100%)', border: '1px solid rgba(24,201,138,.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                    <div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                        <span className="badge badge-green">Running</span>
                        <span className="badge badge-blue">Amateur</span>
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'white', marginBottom: 4 }}>{user.program}</h2>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginBottom: 16 }}>Coach Sara Chen · Started March 4, 2026</p>
                      <div style={{ display: 'flex', gap: 24 }}>
                        {[['10', 'Weeks'], ['4', 'Days/week'], ['38', 'Sessions'], ['480', 'Target km']].map(([v, l]) => (
                          <div key={l}><div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'white', lineHeight: 1 }}>{v}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{l}</div></div>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 600, color: 'var(--apex-bright)', lineHeight: 1 }}>40%</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 8 }}>complete</div>
                      <div style={{ width: 140, height: 4, background: 'rgba(255,255,255,.15)', borderRadius: 2, marginLeft: 'auto', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ duration: .8, delay: .2 }} style={{ height: '100%', background: 'linear-gradient(90deg, var(--apex-mid), var(--apex-bright))', borderRadius: 2 }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {programWeeks.map((week, wi) => (
                      <motion.div key={week.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: wi * .04 }} style={{ ...card, overflow: 'hidden' }}>
                        <button onClick={() => setExpandedWeek(expandedWeek === wi ? null : wi)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: week.current ? 'var(--apex-bright)' : week.done ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.25)', minWidth: 28 }}>W{week.n}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: week.done ? 'rgba(255,255,255,.6)' : week.current ? 'white' : 'rgba(255,255,255,.4)' }}>{week.title}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 1 }}>{week.sub}</div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: week.done ? 'rgba(24,201,138,.1)' : week.current ? 'rgba(59,130,246,.12)' : 'rgba(255,255,255,.05)', color: week.done ? 'var(--apex-bright)' : week.current ? '#60A5FA' : 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{week.done ? 'Done' : week.current ? 'Current' : 'Upcoming'}</span>
                          <motion.div animate={{ rotate: expandedWeek === wi ? 180 : 0 }} style={{ color: 'rgba(255,255,255,.35)' }}>
                            <ChevronDown size={16} />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedWeek === wi && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }} style={{ overflow: 'hidden' }}>
                              <div style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {week.sessions.map((s, si) => (
                                  <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,.03)' }}>
                                    <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{s.icon}</div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 13, fontWeight: 500, color: s.done ? 'rgba(255,255,255,.45)' : 'white' }}>{s.name}</div>
                                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginTop: 1 }}>{s.detail}</div>
                                    </div>
                                    <div style={{ width: 22, height: 22, borderRadius: '50%', border: s.done ? 'none' : '1px solid rgba(255,255,255,.2)', background: s.done ? 'var(--apex-bright)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                      {s.done && <Check size={13} color="white" strokeWidth={3} />}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ════ PROGRESS ════ */}
              {activePage === 'progress' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                    {[
                      { icon:'🏃', label:'Total distance', value:'312 km', sub:'All time', trend:'↑ 18% vs last month', trendUp:true },
                      { icon:'⏱', label:'Best avg pace',   value:'4:52/km', sub:'This month', trend:'↑ 6 sec faster than March', trendUp:true },
                      { icon:'🏆', label:'Personal bests',  value:'3 PBs',   sub:'This season', trend:'↑ 2 new this program', trendUp:true },
                    ].map(s => (
                      <motion.div key={s.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <span style={{ fontSize: 22 }}>{s.icon}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 100, background: 'rgba(24,201,138,.1)', color: 'var(--apex-bright)' }}>{s.sub}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'white', lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 12, color: s.trendUp ? 'var(--apex-bright)' : '#FCA5A5', marginTop: 8 }}>{s.trend}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={card}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 4 }}>Distance over time</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginBottom: '1.25rem' }}>Weekly km · last 12 weeks</div>
                      <LineChart data={[19,24,28,26,31,30,33,29,34,36,38,38]} color="#18C98A" height={150} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,.25)' }}>
                        {['W1','','W3','','W5','','W7','','W9','','W11','W12'].map((l,i) => <span key={i}>{l}</span>)}
                      </div>
                    </div>
                    <div style={card}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 4 }}>Pace progression</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginBottom: '1.25rem' }}>Avg min/km · improving weekly</div>
                      <LineChart data={[5.42,5.35,5.28,5.32,5.22,5.18,5.12,5.15,5.08,5.02,4.98,4.92]} color="#60A5FA" height={150} />
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 10 }}>Trend: <span style={{ color: 'var(--apex-bright)', fontWeight: 600 }}>improving ~4 sec/km per week</span></div>
                    </div>
                  </div>

                  <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>Personal bests</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>Your fastest recorded times</div>
                      </div>
                      <button className="btn btn-ghost btn-sm">+ Log result</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                      {[
                        { event:'5 km',         time:'24:18',   date:'March 22, 2026',     prev:'Previous: 25:44 · −1:26 faster' },
                        { event:'10 km',        time:'51:02',   date:'February 14, 2026',  prev:'Previous: 53:30 · −2:28 faster' },
                        { event:'Half marathon',time:'1:54:44', date:'October 8, 2025',    prev:'First attempt · Goal: sub 1:50' },
                        { event:'1 km',         time:'4:31',    date:'April 2, 2026',      prev:'Previous: 4:48 · −17 sec faster' },
                      ].map(pb => (
                        <div key={pb.event} style={{ padding: '1rem', borderRadius: 12, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.6)', marginBottom: 4 }}>{pb.event}</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--apex-bright)', lineHeight: 1 }}>{pb.time}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 4, marginBottom: 8 }}>{pb.date}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,.07)' }}>{pb.prev}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity heatmap */}
                  <div style={card}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 4 }}>Training activity</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginBottom: '1.25rem' }}>Sessions completed · last 6 months</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(26, 1fr)', gap: 3 }}>
                      {Array.from({ length: 182 }, (_, i) => {
                        const levels = [0,0,1,0,2,1,3,2,1,0,2,3,4,2,1,3,2,4,3,2];
                        const intensity = levels[i % levels.length];
                        const colors = ['rgba(255,255,255,.05)','rgba(24,201,138,.2)','rgba(24,201,138,.4)','rgba(24,201,138,.65)','rgba(24,201,138,.9)'];
                        return <div key={i} style={{ aspectRatio: '1', borderRadius: 2, background: colors[intensity] }} />;
                      })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,.25)' }}>
                      Less {['rgba(255,255,255,.05)','rgba(24,201,138,.2)','rgba(24,201,138,.4)','rgba(24,201,138,.65)','rgba(24,201,138,.9)'].map((c,i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />)} More
                    </div>
                  </div>
                </div>
              )}

              {/* ════ MESSAGES ════ */}
              {activePage === 'messages' && (
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 0, ...card, padding: 0, overflow: 'hidden', minHeight: 560 }}>
                  {/* Conversation list */}
                  <div style={{ borderRight: '1px solid rgba(255,255,255,.07)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 10 }}>Messages</div>
                      <input placeholder="Search…" className="input-field" style={{ fontSize: 13, padding: '8px 12px' }} />
                    </div>
                    {[
                      { init:'SC', name:'Sara Chen',       preview:"You're on track…",         time:'2h', bg:'#E1F5EE88', col:'#085041', unread:2, active:true },
                      { init:'AS', name:'ApexSport Team',  preview:"Welcome to ApexSport!",    time:'1d', bg:'#EEEDFE88', col:'#3C3489', unread:1 },
                      { init:'NB', name:'Nutrition Bot',   preview:"Pre-run meal reminder…",   time:'3d', bg:'#FAEEDA88', col:'#633806' },
                    ].map(c => (
                      <div key={c.name} style={{ display: 'flex', gap: 10, padding: '12px 1.25rem', background: c.active ? 'rgba(24,201,138,.08)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,.05)', cursor: 'pointer', borderLeft: c.active ? '2px solid var(--apex-bright)' : '2px solid transparent', transition: 'all .15s' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: c.col, flexShrink: 0 }}>{c.init}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{c.preview}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{c.time}</span>
                          {c.unread && <span style={{ background: 'var(--apex-bright)', color: 'var(--ink)', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.unread}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat area */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#E1F5EE88', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: '#085041' }}>SC</div>
                      <div><div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Sara Chen</div><div style={{ fontSize: 12, color: 'var(--apex-bright)' }}>● Online · Running coach</div></div>
                      <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                        <div style={{ display: 'flex' }}>{Array.from({length:5},(_,i)=><Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}</div>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>4.9</span>
                      </div>
                    </div>

                    <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: 380 }}>
                      <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,.25)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.07)' }} />
                        <span style={{ background: '#080E0C', padding: '0 12px', position: 'relative' }}>Monday, March 30</span>
                      </div>
                      {messages.map((m, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexDirection: m.from === 'me' ? 'row-reverse' : 'row' }}>
                          {m.from !== 'me' && <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#E1F5EE66', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#085041', flexShrink: 0 }}>SC</div>}
                          <div>
                            <div style={{ maxWidth: 380, padding: '10px 14px', borderRadius: 16, fontSize: 13, lineHeight: 1.55, ...(m.from === 'me' ? { background: 'linear-gradient(135deg, var(--apex-mid), var(--apex-bright))', color: 'white', borderBottomRightRadius: 4 } : { background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.85)', borderBottomLeftRadius: 4 }) }}>{m.text}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.25)', marginTop: 4, textAlign: m.from === 'me' ? 'right' : 'left' }}>{m.ts}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,.07)', display: 'flex', gap: 10 }}>
                      <input
                        value={msgInput}
                        onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMsg()}
                        placeholder="Type a message…"
                        className="input-field"
                        style={{ flex: 1, borderRadius: 100, padding: '10px 18px', fontSize: 13 }}
                      />
                      <motion.button onClick={sendMsg} whileHover={{ scale: 1.08 }} whileTap={{ scale: .95 }} style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--apex-mid), var(--apex-bright))', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 16px rgba(24,201,138,.35)', flexShrink: 0 }}>
                        <Send size={15} color="white" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* ════ SETTINGS ════ */}
              {activePage === 'settings' && (
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {(['profile','goals','notifications','privacy','account'] as const).map(t => (
                      <button key={t} onClick={() => setSettingsTab(t)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: settingsTab === t ? 'rgba(24,201,138,.1)' : 'transparent', border: settingsTab === t ? '1px solid rgba(24,201,138,.2)' : '1px solid transparent', color: settingsTab === t ? 'var(--apex-bright)' : 'rgba(255,255,255,.5)', fontSize: 13, fontWeight: settingsTab === t ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left', textTransform: 'capitalize', transition: 'all .15s' }}>
                        {['👤','🎯','🔔','🔒','⚙'][['profile','goals','notifications','privacy','account'].indexOf(t)]} {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {settingsTab === 'profile' && (
                      <>
                        <div style={card}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 4 }}>Personal information</div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginBottom: '1.5rem' }}>Update your profile details.</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--apex-mid), var(--apex-bright))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'white' }}>{initials}</div>
                            <div><div style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>{user.fname} {user.lname}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>Member since January 2026</div><button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>Change photo</button></div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {[['First name', user.fname], ['Last name', user.lname || ''], ['Email', user.email], ['Phone', '+1 (555) 012-3456'], ['Location', 'San Francisco, CA'], ['Date of birth', '1994-07-15']].map(([label, val]) => (
                              <div key={label}><label className="input-label">{label}</label><input className="input-field" defaultValue={val} /></div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: '1.5rem' }}>
                            <button className="btn btn-ghost btn-sm">Cancel</button>
                            <button className="btn btn-primary btn-sm">Save changes</button>
                          </div>
                        </div>
                        <div style={card}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 4 }}>Athletic details</div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginBottom: '1.5rem' }}>Used to personalise your programs.</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {[['Primary sport', user.sport], ['Level', user.level], ['Years training', '3'], ['Weekly hours', '8–10']].map(([label, val]) => (
                              <div key={label}><label className="input-label">{label}</label><input className="input-field" defaultValue={val} style={{ textTransform: 'capitalize' }} /></div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button className="btn btn-primary btn-sm">Save changes</button>
                          </div>
                        </div>
                      </>
                    )}
                    {settingsTab === 'goals' && (
                      <div style={card}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 4 }}>Training goals</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginBottom: '1.5rem' }}>Click to toggle goals on or off.</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.5rem' }}>
                          {['Complete first half-marathon','Improve 5K time','Run a marathon','Lose weight','Build endurance base','Increase weekly mileage','Qualify for a race','Injury prevention'].map(g => (
                            <button key={g} onClick={() => setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])} style={{ padding: '8px 16px', borderRadius: 100, border: `1px solid ${goals.includes(g) ? 'rgba(24,201,138,.5)' : 'rgba(255,255,255,.12)'}`, background: goals.includes(g) ? 'rgba(24,201,138,.12)' : 'transparent', color: goals.includes(g) ? 'var(--apex-bright)' : 'rgba(255,255,255,.5)', fontSize: 13, fontWeight: goals.includes(g) ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .2s' }}>{g}</button>
                          ))}
                        </div>
                        <button className="btn btn-primary btn-sm">Save goals</button>
                      </div>
                    )}
                    {settingsTab === 'notifications' && (
                      <div style={card}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 4 }}>Notification preferences</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginBottom: '1.5rem' }}>Choose what you want to hear about.</div>
                        {(Object.entries(toggles) as [keyof typeof toggles, boolean][]).map(([key, val]) => (
                          <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: 'white', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g,' $1')} reminders</div>
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>Receive notifications about {key.toLowerCase()}</div>
                            </div>
                            <motion.button onClick={() => setToggles(t => ({...t, [key]: !t[key]}))} animate={{ background: val ? 'var(--apex-bright)' : 'rgba(255,255,255,.1)' }} style={{ width: 42, height: 23, borderRadius: 100, border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                              <motion.div animate={{ left: val ? 21 : 3 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} style={{ position: 'absolute', top: 3, width: 17, height: 17, borderRadius: '50%', background: 'white' }} />
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    )}
                    {settingsTab === 'privacy' && (
                      <div style={card}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 4 }}>Privacy settings</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginBottom: '1.5rem' }}>Control who can see your data.</div>
                        {[['Public profile','Allow other athletes to find you',false],['Share data with coach','Your coach can view your runs',true],['Share PBs publicly','Show your records on your profile',true],['Analytics tracking','Help us improve ApexSport',true]].map(([label, sub, on]) => {
                          const [v, setV] = useState(on as boolean);
                          return (
                            <div key={label as string} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                              <div><div style={{ fontSize: 13, fontWeight: 500, color: 'white' }}>{label as string}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>{sub as string}</div></div>
                              <motion.button onClick={() => setV(!v)} animate={{ background: v ? 'var(--apex-bright)' : 'rgba(255,255,255,.1)' }} style={{ width: 42, height: 23, borderRadius: 100, border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                                <motion.div animate={{ left: v ? 21 : 3 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} style={{ position: 'absolute', top: 3, width: 17, height: 17, borderRadius: '50%', background: 'white' }} />
                              </motion.button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {settingsTab === 'account' && (
                      <>
                        <div style={card}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 4 }}>Change password</div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginBottom: '1.5rem' }}>Use a strong password of at least 12 characters.</div>
                          {['Current password','New password','Confirm new password'].map(l => (
                            <div key={l} style={{ marginBottom: 12 }}><label className="input-label">{l}</label><input type="password" className="input-field" placeholder="••••••••••••" /></div>
                          ))}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button className="btn btn-primary btn-sm">Update password</button>
                          </div>
                        </div>
                        <div style={card}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 4 }}>Connected apps</div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginBottom: '1.5rem' }}>Sync your training data automatically.</div>
                          {[['Strava','Sync runs automatically',true],['Garmin Connect','GPS & heart rate data',true],['Apple Health','Sleep & recovery',false]].map(([name,sub,on]) => {
                            const [v,setV] = useState(on as boolean);
                            return (
                              <div key={name as string} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                                <div><div style={{ fontSize: 13, fontWeight: 500, color: 'white' }}>{name as string}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>{sub as string}</div></div>
                                <motion.button onClick={() => setV(!v)} animate={{ background: v ? 'var(--apex-bright)' : 'rgba(255,255,255,.1)' }} style={{ width: 42, height: 23, borderRadius: 100, border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                                  <motion.div animate={{ left: v ? 21 : 3 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} style={{ position: 'absolute', top: 3, width: 17, height: 17, borderRadius: '50%', background: 'white' }} />
                                </motion.button>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ ...card, border: '1px solid rgba(239,68,68,.2)' }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#FCA5A5', marginBottom: 4 }}>Danger zone</div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginBottom: '1.5rem' }}>These actions are permanent and cannot be undone.</div>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <button style={{ padding: '8px 18px', borderRadius: 100, border: '1px solid rgba(239,68,68,.3)', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', color: '#FCA5A5' }}>Pause subscription</button>
                            <button style={{ padding: '8px 18px', borderRadius: 100, border: '1px solid rgba(239,68,68,.3)', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', color: '#FCA5A5' }}>Delete account</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
