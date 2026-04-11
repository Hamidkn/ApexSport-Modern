import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, TrendingUp, MessageSquare,
  Settings, LogOut, Zap, Bell, ChevronDown, Check, Send,
  Star, X, MessageCircle, Trophy, Clock, AlertCircle, Users
} from 'lucide-react';
import { getUser, clearUser } from '../utils/auth';
import { conversations as initialConvs, notifications as initialNotifs } from '../data';
import type { Conversation, Notification, ChatMessage } from '../types';

/* ── SPARKLINE ── */
function Sparkline({ data, color='#3B82F6' }: { data:number[]; color?:string }) {
  const max=Math.max(...data), min=Math.min(...data);
  const W=80, H=32;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*(W-4)+2},${H-4-((v-min)/(max-min||1))*(H-8)}`).join(' ');
  return <svg viewBox={`0 0 ${W} ${H}`} style={{ width:W, height:H }}><polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>;
}

/* ── BAR CHART ── */
function BarChart({ data }: { data:{ label:string; value:number; target:number; current?:boolean }[] }) {
  const max=50;
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:160, padding:'0 4px' }}>
      {data.map((d,i)=>(
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%' }}>
          <div style={{ flex:1, width:'100%', position:'relative', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
            <div style={{ position:'absolute', bottom:0, width:'100%', height:`${(d.target/max)*100}%`, background:'rgba(59,130,246,.08)', borderRadius:'3px 3px 0 0' }} />
            <motion.div initial={{ height:0 }} animate={{ height:`${(d.value/max)*100}%` }} transition={{ delay:i*.06, duration:.6, ease:[.4,0,.2,1] }}
              style={{ width:'100%', background:d.current?'linear-gradient(180deg,#60A5FA,#2563EB)':'rgba(59,130,246,.3)', borderRadius:'3px 3px 0 0', position:'relative', zIndex:1, boxShadow:d.current?'0 0 12px rgba(59,130,246,.4)':'none' }} />
          </div>
          <span style={{ fontSize:10, fontWeight:d.current?700:400, color:d.current?'var(--b-600)':'var(--n-400)' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── LINE CHART ── */
function LineChart({ data, color='#3B82F6', height=140 }: { data:number[]; color?:string; height?:number }) {
  const max=Math.max(...data)*1.1, min=Math.min(...data)*.9;
  const W=500, H=height;
  const pts=data.map((v,i):[number,number]=>{
    const x=(i/(data.length-1))*(W-20)+10;
    const y=H-10-((v-min)/(max-min||1))*(H-20);
    return [x,y];
  });
  const linePath=`M ${pts.map(p=>p.join(',')).join(' L ')}`;
  const areaPath=`M ${pts[0][0]},${H} L ${pts.map(p=>p.join(',')).join(' L ')} L ${pts[pts.length-1][0]},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width:'100%', height }} overflow="visible">
      <defs><linearGradient id={`g${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".2"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <path d={areaPath} fill={`url(#g${color.replace('#','')})`}/>
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3.5" fill={i===data.length-1?color:'white'} stroke={color} strokeWidth="2"/>)}
    </svg>
  );
}

/* ── WEEK STRIP ── */
function WeekStrip({ current=4, total=10 }: { current?:number; total?:number }) {
  return (
    <div style={{ display:'flex', gap:4 }}>
      {Array.from({length:total},(_,i)=>(
        <motion.div key={i} initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:i*.04 }}
          style={{ flex:1, height:5, borderRadius:3, background:i<current-1?'var(--b-500)':i===current-1?'var(--b-300)':'var(--n-200)', boxShadow:i===current-1?'0 0 6px rgba(59,130,246,.4)':'none' }} />
      ))}
    </div>
  );
}

/* ── NOTIFICATION ICON MAP ── */
const notifIcon = {
  message: <MessageCircle size={16} color="#2563EB" />,
  session: <Clock         size={16} color="#D97706" />,
  pb:      <Trophy        size={16} color="#059669" />,
  coach:   <Users         size={16} color="#7C3AED" />,
  system:  <AlertCircle  size={16} color="#0891B2" />,
} as const;
const notifBg = {
  message:'#EFF6FF', session:'#FFFBEB', pb:'#ECFDF5', coach:'#F5F3FF', system:'#F0F9FF',
} as const;

/* ══════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [page, setPage]           = useState<'dashboard'|'program'|'progress'|'messages'|'settings'>('dashboard');
  const [notifOpen, setNotifOpen] = useState(false);
  const [convs, setConvs]         = useState<Conversation[]>(initialConvs);
  const [notifs, setNotifs]       = useState<Notification[]>(initialNotifs);
  const [activeConv, setActiveConv] = useState<string>(initialConvs[0].id);
  const [msgInput, setMsgInput]   = useState('');
  const [expandedWeek, setExpandedWeek] = useState<number|null>(3);
  const [settingsTab, setSettingsTab]   = useState<'profile'|'goals'|'notifications'|'privacy'|'account'>('profile');
  const [goals, setGoals]         = useState(['Complete first half-marathon','Improve 5K time','Build endurance base']);
  const [toggles, setToggles]     = useState({ sessions:true, coach:true, weekly:true, pbs:true, updates:false, marketing:false });
  const msgBodyRef = useRef<HTMLDivElement>(null);
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => { if (!user) navigate('/login'); }, []);
  useEffect(() => {
    if (msgBodyRef.current) msgBodyRef.current.scrollTop = msgBodyRef.current.scrollHeight;
  }, [activeConv, convs]);

  function signOut() { clearUser(); navigate('/'); }
  if (!user) return null;

  const initials = `${user.fname[0]}${(user.lname||'')[0]||''}`.toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour<12?'Good morning':hour<18?'Good afternoon':'Good evening';
  const unreadCount = notifs.filter(n => !n.read).length;

  function sendMsg() {
    const text = msgInput.trim();
    if (!text) return;
    const now = new Date();
    const ts  = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    const newMsg: ChatMessage = { id: Date.now().toString(), from:'me', text, ts };
    setConvs(prev => prev.map(c => c.id===activeConv ? {...c, messages:[...c.messages, newMsg], preview:text, time:'Just now', unread:0} : c));
    setMsgInput('');
  }

  function openConvFromNotif(notif: Notification) {
    setNotifs(prev => prev.map(n => n.id===notif.id ? {...n, read:true} : n));
    setNotifOpen(false);
    if (notif.convId) { setActiveConv(notif.convId); setPage('messages'); }
  }

  function markAllRead() { setNotifs(prev => prev.map(n => ({...n, read:true}))); }

  const currentConv = convs.find(c => c.id===activeConv) || convs[0];

  const navItems = [
    { id:'dashboard', icon:LayoutDashboard, label:'Dashboard' },
    { id:'program',   icon:Calendar,        label:'My Program' },
    { id:'progress',  icon:TrendingUp,      label:'Progress'   },
    { id:'messages',  icon:MessageSquare,   label:'Messages',  badge: convs.reduce((a,c)=>a+c.unread,0) },
    { id:'settings',  icon:Settings,        label:'Settings'   },
  ] as const;

  const weekData = [
    { label:'W1', value:22, target:28 },{ label:'W2', value:26, target:30 },
    { label:'W3', value:31, target:32 },{ label:'W4', value:29, target:32 },
    { label:'W5', value:34, target:35 },{ label:'W6', value:33, target:36 },
    { label:'W7', value:36, target:38 },{ label:'W8', value:38, target:40, current:true },
  ];

  const programWeeks = [
    { n:1, title:'Foundation week',      sub:'Easy mileage build',          done:true,    sessions:[{name:'Easy run 6km',detail:'Zone 2 · 35min',done:true,icon:'🏃'},{name:'Rest & stretch',detail:'Recovery · 20min',done:true,icon:'💤'},{name:'Tempo run 4km',detail:'5:10/km · 25min',done:true,icon:'🏃'},{name:'Long run 10km',detail:'Easy · 60min',done:true,icon:'🏃'}]},
    { n:2, title:'Base building',         sub:'Volume +10%',                 done:true,    sessions:[{name:'Easy run 7km',detail:'Conversational · 40min',done:true,icon:'🏃'},{name:'Strength & core',detail:'Gym · 45min',done:true,icon:'💪'},{name:'Intervals 5×800m',detail:'4:45/km · 50min',done:true,icon:'🏃'},{name:'Long run 12km',detail:'Easy · 70min',done:true,icon:'🏃'}]},
    { n:3, title:'Aerobic development',   sub:'Quality sessions introduced', done:true,    sessions:[{name:'Easy run 7km',detail:'HR zone 2 · 40min',done:true,icon:'🏃'},{name:'Rest day',detail:'Full recovery',done:true,icon:'💤'},{name:'Tempo 2×3km',detail:'5:00/km · 45min',done:true,icon:'🏃'},{name:'Long run 14km',detail:'Negative split · 85min',done:true,icon:'🏃'}]},
    { n:4, title:'Threshold week',        sub:'Current — key tempo',         current:true, sessions:[{name:'Easy run 8km',detail:'Zone 2 · 45min',done:true,icon:'🏃'},{name:'Rest & mobility',detail:'20min',done:true,icon:'💤'},{name:'Tempo 3×2km',detail:'4:55/km · 50min',done:true,icon:'🏃'},{name:'Long run 18km',detail:'5:10 → 5:00/km',done:false,icon:'🏃'},{name:'Recovery jog 5km',detail:'Easy · 30min',done:false,icon:'🏃'}]},
    { n:5, title:'Volume peak',           sub:'Highest mileage week',        future:true,  sessions:[{name:'Easy run 8km',detail:'Zone 2',done:false,icon:'🏃'},{name:'Strength',detail:'45min',done:false,icon:'💪'},{name:'Intervals 6×1km',detail:'4:50/km',done:false,icon:'🏃'},{name:'Long run 20km',detail:'Goal pace last 5km',done:false,icon:'🏃'}]},
    { n:6, title:'Recovery week',         sub:'Back off 20%',                future:true,  sessions:[{name:'Easy run 6km',detail:'Very easy',done:false,icon:'🏃'},{name:'Rest',detail:'Full rest',done:false,icon:'💤'},{name:'Tempo 2×2km',detail:'Relaxed',done:false,icon:'🏃'},{name:'Long run 14km',detail:'Easy',done:false,icon:'🏃'}]},
    { n:7, title:'Race simulation',       sub:'Practice race conditions',    future:true,  sessions:[{name:'Easy run 8km',detail:'Zone 2',done:false,icon:'🏃'},{name:'Strength',detail:'45min',done:false,icon:'💪'},{name:'Race sim 10km',detail:'Target pace',done:false,icon:'🏃'},{name:'Long run 18km',detail:'Last 4km race pace',done:false,icon:'🏃'}]},
    { n:8, title:'Peak week',             sub:'Maximum fitness',             future:true,  sessions:[{name:'Easy run 8km',detail:'Zone 2',done:false,icon:'🏃'},{name:'Rest & mobility',detail:'Foam rolling',done:false,icon:'💤'},{name:'Threshold 3×3km',detail:'4:58/km',done:false,icon:'🏃'},{name:'Long run 22km',detail:'Last 6km race pace',done:false,icon:'🏃'}]},
    { n:9, title:'Taper week 1',          sub:'Reduce volume, keep intensity',future:true, sessions:[{name:'Easy run 6km',detail:'Very relaxed',done:false,icon:'🏃'},{name:'Strides 4×100m',detail:'After run',done:false,icon:'🏃'},{name:'Tempo 1×4km',detail:'Race pace',done:false,icon:'🏃'},{name:'Long run 14km',detail:'Easy',done:false,icon:'🏃'}]},
    { n:10,title:'Race week',             sub:'Light, sharp, confident',     future:true,  sessions:[{name:'Easy run 4km',detail:'Very easy',done:false,icon:'🏃'},{name:'Rest',detail:'Full rest',done:false,icon:'💤'},{name:'Shakeout 3km',detail:'Easy + 2 strides',done:false,icon:'🏃'},{name:'🏁 SF Half Marathon',detail:'Goal: sub 1:50!',done:false,icon:'🏁'}]},
  ];

  const card: React.CSSProperties = { background:'white', border:'1px solid rgba(59,130,246,.1)', borderRadius:16, padding:'1.5rem', boxShadow:'0 2px 12px rgba(30,64,175,.06)' };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--page-bg)', position:'relative' }}>

      {/* ── SIDEBAR ── */}
      <motion.aside initial={{ x:-240 }} animate={{ x:0 }} transition={{ duration:.5, ease:[.4,0,.2,1] }}
        className="dashboard-sidebar"
        style={{ width:220, background:'linear-gradient(180deg, #1E3A8A 0%, #1D4ED8 100%)', display:'flex', flexDirection:'column', padding:'1.5rem 1rem', flexShrink:0, boxShadow:'4px 0 20px rgba(30,58,138,.2)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'2.5rem', paddingLeft:4 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 12px rgba(255,255,255,.2)' }}>
            <Zap size={15} color="white" fill="white" />
          </div>
          <span style={{ fontFamily:'var(--font-display)', fontSize:17, color:'white', fontWeight:600 }}>
            Apex<span style={{ fontStyle:'italic', color:'#93C5FD' }}>Sport</span>
          </span>
        </div>
        <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
          {navItems.map(item=>(
            <motion.button key={item.id} onClick={()=>setPage(item.id as typeof page)}
              whileHover={{ x:3 }} whileTap={{ scale:.97 }}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, cursor:'pointer', border:'none', fontFamily:'var(--font-body)', fontSize:13, fontWeight:500, transition:'all .15s', background:page===item.id?'rgba(255,255,255,.18)':'transparent', color:page===item.id?'white':'rgba(255,255,255,.65)', position:'relative' }}>
              <item.icon size={16} />
              {item.label}
              {'badge' in item && item.badge > 0 && (
                <span style={{ marginLeft:'auto', background:'#FCD34D', color:'#92400E', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:100 }}>{item.badge}</span>
              )}
              {page===item.id && <motion.div layoutId="sidebar-active" style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'rgba(255,255,255,.8)', borderRadius:'0 3px 3px 0' }} />}
            </motion.button>
          ))}
        </nav>
        <div style={{ borderTop:'1px solid rgba(255,255,255,.15)', paddingTop:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:10, background:'rgba(255,255,255,.1)', marginBottom:8 }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white', flexShrink:0 }}>{initials}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.fname} {user.lname}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.5)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.program}</div>
            </div>
          </div>
          <button onClick={signOut} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:10, background:'none', border:'none', cursor:'pointer', fontSize:13, color:'rgba(255,255,255,.45)', fontFamily:'var(--font-body)', transition:'all .15s' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(239,68,68,.2)'; e.currentTarget.style.color='#FCA5A5'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='none'; e.currentTarget.style.color='rgba(255,255,255,.45)'; }}>
            <LogOut size={15}/> Sign out
          </button>
        </div>
      </motion.aside>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* ── TOPBAR ── */}
        <header className="dashboard-topbar" style={{ height:58, background:'white', borderBottom:'1px solid rgba(59,130,246,.1)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2rem', flexShrink:0, boxShadow:'0 2px 8px rgba(30,64,175,.05)' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)' }}>{greeting}, {user.fname} 👋</div>
            <div style={{ fontSize:12, color:'var(--n-400)', marginTop:1 }}>Saturday, April 4 · Week 4 of 10</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, position:'relative' }}>
            {/* NOTIFICATION BUTTON */}
            <button onClick={()=>setNotifOpen(!notifOpen)}
              style={{ width:36, height:36, borderRadius:'50%', border:'1px solid rgba(59,130,246,.15)', background:notifOpen?'var(--b-50)':'white', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative', transition:'all .2s' }}>
              <Bell size={16} color={notifOpen?'var(--b-600)':'var(--n-500)'} />
              {unreadCount>0 && (
                <div style={{ position:'absolute', top:6, right:6, width:8, height:8, background:'var(--rose)', borderRadius:'50%', border:'1.5px solid white' }} />
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            <AnimatePresence>
              {notifOpen && (
                <>
                  <div onClick={()=>setNotifOpen(false)} style={{ position:'fixed', inset:0, zIndex:49 }} />
                  <motion.div initial={{ opacity:0, y:-8, scale:.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-8, scale:.96 }} transition={{ duration:.2 }}
                    style={{ position:'absolute', top:'calc(100% + 10px)', right:0, width:380, background:'white', border:'1px solid rgba(59,130,246,.12)', borderRadius:'var(--r-xl)', boxShadow:'0 20px 60px rgba(30,64,175,.15)', zIndex:50, overflow:'hidden' }}>
                    <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--n-100)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div>
                        <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)' }}>Notifications</div>
                        {unreadCount>0 && <div style={{ fontSize:12, color:'var(--b-600)', marginTop:1 }}>{unreadCount} unread</div>}
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        {unreadCount>0 && <button onClick={markAllRead} style={{ fontSize:12, color:'var(--b-600)', fontWeight:600, background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>Mark all read</button>}
                        <button onClick={()=>setNotifOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--n-400)', padding:2 }}><X size={16}/></button>
                      </div>
                    </div>
                    <div style={{ maxHeight:380, overflowY:'auto' }}>
                      {notifs.map(n=>(
                        <motion.div key={n.id} whileHover={{ background:'var(--n-50)' }} onClick={()=>openConvFromNotif(n)}
                          style={{ display:'flex', gap:12, padding:'12px 1.25rem', borderBottom:'1px solid var(--n-50)', cursor:n.convId?'pointer':'default', background:n.read?'transparent':'var(--b-50)', transition:'background .15s' }}>
                          <div style={{ width:34, height:34, borderRadius:10, background:notifBg[n.type], display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            {notifIcon[n.type]}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:600, color:'var(--n-900)', marginBottom:2, display:'flex', alignItems:'center', gap:6 }}>
                              {n.title}
                              {!n.read && <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--b-500)', flexShrink:0 }} />}
                            </div>
                            <div style={{ fontSize:12, color:'var(--n-500)', lineHeight:1.4 }}>{n.body}</div>
                            <div style={{ fontSize:11, color:'var(--n-400)', marginTop:4 }}>{n.time}</div>
                          </div>
                          {n.convId && <div style={{ fontSize:11, color:'var(--b-600)', fontWeight:600, alignSelf:'center', whiteSpace:'nowrap' }}>View →</div>}
                        </motion.div>
                      ))}
                    </div>
                    <div style={{ padding:'10px 1.25rem', borderTop:'1px solid var(--n-100)', textAlign:'center' }}>
                      <button onClick={()=>{ setPage('messages'); setNotifOpen(false); }} style={{ fontSize:13, color:'var(--b-600)', fontWeight:600, background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>
                        Go to Messages →
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <div className="dashboard-content" style={{ flex:1, overflow:'auto', padding:'2rem' }}>
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:.25 }}>

              {/* ════ DASHBOARD ════ */}
              {page==='dashboard' && (
                <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                  {/* Stat cards */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
                    {[
                      { label:'Distance',   value:'38.4', unit:'km',   delta:'+12%', up:true,  color:'var(--b-600)',  icon:'🏃', spark:[22,28,31,26,34,33,36,38] },
                      { label:'Avg Pace',   value:'4:58', unit:'/km',  delta:'+8%',  up:true,  color:'#0891B2',      icon:'⏱', spark:[5.4,5.3,5.2,5.3,5.1,5.1,5.0,4.9] },
                      { label:'Heart Rate', value:'142',  unit:'bpm',  delta:'−3',   up:false, color:'var(--rose)',   icon:'❤', spark:[148,145,146,143,144,142,143,142] },
                      { label:'Calories',   value:'2,140',unit:'kcal', delta:'+5%',  up:true,  color:'var(--amber)', icon:'🔥', spark:[1800,1900,2000,1950,2050,2100,2120,2140] },
                    ].map((s,i)=>(
                      <motion.div key={s.label} initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.07 }} style={card}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                          <span style={{ fontSize:20 }}>{s.icon}</span>
                          <span style={{ fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:100, background:s.up?'#EFF6FF':'#FEF2F2', color:s.up?'var(--b-700)':'#B91C1C' }}>{s.delta}</span>
                        </div>
                        <div style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:600, color:'var(--n-900)', lineHeight:1 }}>{s.value}<span style={{ fontSize:14, color:'var(--n-400)', fontFamily:'var(--font-body)', fontWeight:400 }}> {s.unit}</span></div>
                        <div style={{ fontSize:12, color:'var(--n-400)', marginTop:4, marginBottom:10 }}>{s.label} this week</div>
                        <Sparkline data={s.spark} color={s.color} />
                      </motion.div>
                    ))}
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:14 }}>
                    <div style={card}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
                        <div><div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)' }}>Weekly distance</div><div style={{ fontSize:12, color:'var(--n-400)', marginTop:2 }}>km per week · last 8 weeks</div></div>
                        <div style={{ display:'flex', gap:4 }}>
                          {['8W','3M','All'].map(t=><button key={t} style={{ padding:'5px 12px', borderRadius:100, border:t==='8W'?'1px solid var(--b-300)':'1px solid var(--n-200)', background:t==='8W'?'var(--b-50)':'white', color:t==='8W'?'var(--b-700)':'var(--n-400)', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)' }}>{t}</button>)}
                        </div>
                      </div>
                      <BarChart data={weekData} />
                      <div style={{ display:'flex', gap:16, marginTop:12 }}>
                        {[{ c:'rgba(59,130,246,.25)', l:'Past' },{ c:'#2563EB', l:'Current' },{ c:'rgba(59,130,246,.08)', l:'Target' }].map(l=>(
                          <div key={l.l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--n-400)' }}>
                            <div style={{ width:10, height:10, borderRadius:2, background:l.c }} />{l.l}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ ...card, display:'flex', flexDirection:'column', gap:'1rem' }}>
                      <div>
                        <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                          <span className="badge badge-blue">Running</span>
                          <span className="badge badge-cyan">Amateur</span>
                        </div>
                        <div style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:600, color:'var(--n-900)', marginBottom:2 }}>{user.program}</div>
                        <div style={{ fontSize:12, color:'var(--n-400)' }}>Coach Sara Chen</div>
                      </div>
                      <div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--n-400)', marginBottom:6 }}>
                          <span>Week 4 of 10</span><span style={{ color:'var(--b-600)', fontWeight:600 }}>40%</span>
                        </div>
                        <WeekStrip current={4} total={10} />
                      </div>
                      <div style={{ fontSize:12, fontWeight:600, color:'var(--n-400)', marginBottom:2 }}>This week</div>
                      {[{n:'Easy run',d:'Mon',done:true},{n:'Tempo intervals',d:'Wed',done:true},{n:'Long run',d:'Sat',done:false,today:true},{n:'Recovery jog',d:'Sun',done:false}].map(s=>(
                        <div key={s.n} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:'1px solid var(--n-100)' }}>
                          <div style={{ width:7, height:7, borderRadius:'50%', background:s.done?'var(--b-500)':s.today?'var(--b-300)':'var(--n-200)', border:s.today?'1.5px solid var(--b-500)':'none', flexShrink:0 }} />
                          <span style={{ flex:1, fontSize:13, color:s.done?'var(--n-400)':'var(--n-900)' }}>{s.n}</span>
                          <span style={{ fontSize:11, color:'var(--n-400)' }}>{s.d}</span>
                          <span style={{ fontSize:11, fontWeight:600, padding:'2px 7px', borderRadius:100, background:s.done?'#EFF6FF':s.today?'#DBEAFE':'var(--n-100)', color:s.done?'var(--b-600)':s.today?'var(--b-700)':'var(--n-400)' }}>{s.done?'Done':s.today?'Today':'Soon'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
                    {/* Upcoming */}
                    <div style={card}>
                      <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)', marginBottom:'1rem' }}>Upcoming sessions</div>
                      {[{day:'4',dow:'SAT',name:'Long run — 18 km',meta:'7:00 AM · ~1h 35m',type:'Run',today:true},{day:'5',dow:'SUN',name:'Recovery jog — 5 km',meta:'Easy · ~30m',type:'Rest'},{day:'7',dow:'TUE',name:'Strength & core',meta:'45 min · Gym',type:'Strength'},{day:'9',dow:'THU',name:'Tempo run — 10 km',meta:'Threshold · ~52m',type:'Run'}].map(s=>(
                        <div key={s.day} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:'1px solid var(--n-100)' }}>
                          <div style={{ width:38, height:42, borderRadius:8, background:s.today?'var(--b-50)':'var(--n-50)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0, border:s.today?'1px solid var(--b-200)':'none' }}>
                            <span style={{ fontSize:14, fontWeight:700, color:s.today?'var(--b-600)':'var(--n-800)', lineHeight:1 }}>{s.day}</span>
                            <span style={{ fontSize:9, color:s.today?'var(--b-400)':'var(--n-400)' }}>{s.dow}</span>
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:500, color:'var(--n-900)', marginBottom:2 }}>{s.name}</div>
                            <div style={{ fontSize:11, color:'var(--n-400)' }}>{s.meta}</div>
                          </div>
                          <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:100, alignSelf:'flex-start', background:s.type==='Run'?'var(--b-50)':s.type==='Strength'?'#FFFBEB':'var(--n-50)', color:s.type==='Run'?'var(--b-700)':s.type==='Strength'?'#92400E':'var(--n-500)', textTransform:'uppercase', letterSpacing:'.05em' }}>{s.type}</span>
                        </div>
                      ))}
                    </div>
                    {/* Metrics */}
                    <div style={card}>
                      <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)', marginBottom:'1rem' }}>Performance metrics</div>
                      {[
                        { label:'Total sessions', value:'3 of 4', icon:'🏃', spark:[3,4,3,4,4,3,4,3],    color:'var(--b-500)' },
                        { label:'Training load',  value:'342 TSS',icon:'⏱', spark:[280,310,295,320,330,315,340,342], color:'#0891B2' },
                        { label:'Avg sleep',      value:'7.4 hrs', icon:'💤', spark:[6.8,7.2,6.9,7.5,7.1,7.3,7.6,7.4], color:'var(--violet)' },
                        { label:'Readiness',      value:'84/100',  icon:'⚡', spark:[72,78,75,80,79,82,83,84],  color:'var(--amber)' },
                      ].map(m=>(
                        <div key={m.label} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid var(--n-100)' }}>
                          <div style={{ width:30, height:30, borderRadius:8, background:'var(--n-50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{m.icon}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:11, color:'var(--n-400)', marginBottom:1 }}>{m.label}</div>
                            <div style={{ fontSize:14, fontWeight:600, color:'var(--n-900)' }}>{m.value}</div>
                          </div>
                          <Sparkline data={m.spark} color={m.color} />
                        </div>
                      ))}
                    </div>
                    {/* Coach */}
                    <div style={{ ...card, background:'linear-gradient(160deg, #1E40AF 0%, #1D4ED8 100%)', border:'none', display:'flex', flexDirection:'column', gap:'1rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.35)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:16, fontWeight:600, color:'white' }}>SC</div>
                        <div><div style={{ fontSize:14, fontWeight:600, color:'white' }}>Sara Chen</div><div style={{ fontSize:11, color:'rgba(255,255,255,.6)' }}>● Online · Your coach</div></div>
                      </div>
                      <div style={{ background:'rgba(255,255,255,.12)', borderRadius:10, padding:'12px' }}>
                        <div style={{ fontSize:10, fontWeight:700, color:'#93C5FD', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Latest note</div>
                        <p style={{ fontSize:13, color:'rgba(255,255,255,.85)', lineHeight:1.55 }}>Great tempo Wednesday 💪 Today — 5:10/km first 12km, push to 5:00 on the last stretch. You're on track for sub-1:50!</p>
                      </div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>2 hours ago</div>
                      <div style={{ display:'flex', gap:8, marginTop:'auto' }}>
                        <button onClick={()=>setPage('messages')} style={{ flex:1, padding:'8px', borderRadius:'var(--r-sm)', background:'rgba(255,255,255,.2)', border:'1px solid rgba(255,255,255,.3)', color:'white', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)' }}>Reply</button>
                        <button onClick={()=>setPage('program')}  style={{ flex:1, padding:'8px', borderRadius:'var(--r-sm)', background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', color:'rgba(255,255,255,.8)', fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)' }}>View plan</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ════ MY PROGRAM ════ */}
              {page==='program' && (
                <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                  <div style={{ ...card, background:'linear-gradient(135deg, #1E40AF 0%, #1D4ED8 60%, #0891B2 100%)', border:'none', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:20, boxShadow:'0 8px 32px rgba(30,64,175,.3)' }}>
                    <div>
                      <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                        <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:100, background:'rgba(255,255,255,.2)', color:'white', textTransform:'uppercase', letterSpacing:'.05em' }}>Running</span>
                        <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:100, background:'rgba(255,255,255,.15)', color:'rgba(255,255,255,.85)', textTransform:'uppercase', letterSpacing:'.05em' }}>Amateur</span>
                      </div>
                      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:600, color:'white', marginBottom:4 }}>{user.program}</h2>
                      <p style={{ fontSize:13, color:'rgba(255,255,255,.6)', marginBottom:16 }}>Coach Sara Chen · Started March 4, 2026</p>
                      <div style={{ display:'flex', gap:24 }}>
                        {[['10','Weeks'],['4','Days/week'],['38','Sessions'],['480','Target km']].map(([v,l])=>(
                          <div key={l}><div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, color:'white', lineHeight:1 }}>{v}</div><div style={{ fontSize:11, color:'rgba(255,255,255,.5)', marginTop:2 }}>{l}</div></div>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:'var(--font-display)', fontSize:'4rem', fontWeight:600, color:'#93C5FD', lineHeight:1 }}>40%</div>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,.5)', marginBottom:8 }}>complete</div>
                      <div style={{ width:140, height:4, background:'rgba(255,255,255,.2)', borderRadius:2, marginLeft:'auto', overflow:'hidden' }}>
                        <motion.div initial={{ width:0 }} animate={{ width:'40%' }} transition={{ duration:.8, delay:.2 }} style={{ height:'100%', background:'#93C5FD', borderRadius:2 }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {programWeeks.map((week,wi)=>(
                      <motion.div key={week.n} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:wi*.04 }} style={{ ...card, overflow:'hidden', padding:0 }}>
                        <button onClick={()=>setExpandedWeek(expandedWeek===wi?null:wi)}
                          style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'1rem 1.5rem', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)', textAlign:'left' }}>
                          <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:600, color:week.current?'var(--b-600)':week.done?'var(--n-400)':'var(--n-300)', minWidth:28 }}>W{week.n}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:14, fontWeight:600, color:week.done?'var(--n-500)':week.current?'var(--n-900)':'var(--n-400)' }}>{week.title}</div>
                            <div style={{ fontSize:12, color:'var(--n-400)', marginTop:1 }}>{week.sub}</div>
                          </div>
                          <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:100, textTransform:'uppercase', letterSpacing:'.05em', background:week.done?'#EFF6FF':week.current?'#DBEAFE':'var(--n-100)', color:week.done?'var(--b-600)':week.current?'var(--b-700)':'var(--n-400)' }}>
                            {week.done?'Done':week.current?'Current':'Upcoming'}
                          </span>
                          <motion.div animate={{ rotate:expandedWeek===wi?180:0 }} style={{ color:'var(--n-400)' }}><ChevronDown size={16}/></motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedWeek===wi && (
                            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:.25 }} style={{ overflow:'hidden' }}>
                              <div style={{ padding:'0 1.5rem 1.25rem', display:'flex', flexDirection:'column', gap:6 }}>
                                {week.sessions.map((s,si)=>(
                                  <div key={si} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10, background:'var(--n-50)' }}>
                                    <div style={{ width:34, height:34, borderRadius:9, background:'white', border:'1px solid var(--n-200)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{s.icon}</div>
                                    <div style={{ flex:1 }}>
                                      <div style={{ fontSize:13, fontWeight:500, color:s.done?'var(--n-400)':'var(--n-900)' }}>{s.name}</div>
                                      <div style={{ fontSize:11, color:'var(--n-400)', marginTop:1 }}>{s.detail}</div>
                                    </div>
                                    <div style={{ width:22, height:22, borderRadius:'50%', border:s.done?'none':'1px solid var(--n-300)', background:s.done?'var(--b-500)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                      {s.done && <Check size={13} color="white" strokeWidth={3}/>}
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
              {page==='progress' && (
                <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
                    {[
                      { icon:'🏃', label:'Total distance', value:'312 km',   sub:'All time',     trend:'↑ 18% vs last month', up:true },
                      { icon:'⏱', label:'Best avg pace',  value:'4:52/km',  sub:'This month',   trend:'↑ 6 sec faster than March', up:true },
                      { icon:'🏆', label:'Personal bests', value:'3 PBs',    sub:'This season',  trend:'↑ 2 new this program', up:true },
                    ].map(s=>(
                      <motion.div key={s.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={card}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                          <span style={{ fontSize:22 }}>{s.icon}</span>
                          <span className="badge badge-cyan">{s.sub}</span>
                        </div>
                        <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:600, color:'var(--n-900)', lineHeight:1 }}>{s.value}</div>
                        <div style={{ fontSize:12, color:'var(--n-400)', marginTop:4 }}>{s.label}</div>
                        <div style={{ fontSize:12, color:'var(--b-600)', marginTop:8, fontWeight:500 }}>{s.trend}</div>
                      </motion.div>
                    ))}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <div style={card}>
                      <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)', marginBottom:4 }}>Distance over time</div>
                      <div style={{ fontSize:12, color:'var(--n-400)', marginBottom:'1.25rem' }}>Weekly km · last 12 weeks</div>
                      <LineChart data={[19,24,28,26,31,30,33,29,34,36,38,38]} color="#2563EB" height={150}/>
                      <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:11, color:'var(--n-300)' }}>
                        {['W1','','W3','','W5','','W7','','W9','','W11','W12'].map((l,i)=><span key={i}>{l}</span>)}
                      </div>
                    </div>
                    <div style={card}>
                      <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)', marginBottom:4 }}>Pace progression</div>
                      <div style={{ fontSize:12, color:'var(--n-400)', marginBottom:'1.25rem' }}>Avg min/km · improving weekly</div>
                      <LineChart data={[5.42,5.35,5.28,5.32,5.22,5.18,5.12,5.15,5.08,5.02,4.98,4.92]} color="#0891B2" height={150}/>
                      <div style={{ fontSize:12, color:'var(--n-400)', marginTop:10 }}>Trend: <span style={{ color:'var(--b-600)', fontWeight:600 }}>improving ~4 sec/km per week</span></div>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                      <div>
                        <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)' }}>Personal bests</div>
                        <div style={{ fontSize:12, color:'var(--n-400)', marginTop:2 }}>Your fastest recorded times</div>
                      </div>
                      <button className="btn btn-ghost btn-sm">+ Log result</button>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
                      {[
                        { event:'5 km',         time:'24:18',   date:'March 22, 2026',    prev:'Previous: 25:44 · −1:26 faster' },
                        { event:'10 km',        time:'51:02',   date:'February 14, 2026', prev:'Previous: 53:30 · −2:28 faster' },
                        { event:'Half marathon',time:'1:54:44', date:'October 8, 2025',   prev:'First attempt · Goal: sub 1:50' },
                        { event:'1 km',         time:'4:31',    date:'April 2, 2026',     prev:'Previous: 4:48 · −17 sec faster' },
                      ].map(pb=>(
                        <div key={pb.event} style={{ padding:'1rem', borderRadius:12, background:'var(--n-50)', border:'1px solid var(--n-200)' }}>
                          <div style={{ fontSize:13, fontWeight:600, color:'var(--n-600)', marginBottom:4 }}>{pb.event}</div>
                          <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:600, color:'var(--b-600)', lineHeight:1 }}>{pb.time}</div>
                          <div style={{ fontSize:11, color:'var(--n-400)', marginTop:4, marginBottom:8 }}>{pb.date}</div>
                          <div style={{ fontSize:11, color:'var(--n-400)', paddingTop:8, borderTop:'1px solid var(--n-200)' }}>{pb.prev}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={card}>
                    <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)', marginBottom:4 }}>Training activity</div>
                    <div style={{ fontSize:12, color:'var(--n-400)', marginBottom:'1.25rem' }}>Sessions completed · last 6 months</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(26,1fr)', gap:3 }}>
                      {Array.from({length:182},(_,i)=>{
                        const lvls=[0,0,1,0,2,1,3,2,1,0,2,3,4,2,1,3,2,4,3,2];
                        const intensity=lvls[i%lvls.length];
                        const colors=['var(--n-100)','#BFDBFE','#93C5FD','#60A5FA','#2563EB'];
                        return <div key={i} style={{ aspectRatio:'1', borderRadius:2, background:colors[intensity] }} />;
                      })}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:10, fontSize:11, color:'var(--n-400)' }}>
                      Less {['var(--n-100)','#BFDBFE','#93C5FD','#60A5FA','#2563EB'].map((c,i)=><div key={i} style={{ width:12, height:12, borderRadius:2, background:c }} />)} More
                    </div>
                  </div>
                </div>
              )}

              {/* ════ MESSAGES ════ */}
              {page==='messages' && (
                <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', background:'white', borderRadius:16, border:'1px solid rgba(59,130,246,.1)', overflow:'hidden', minHeight:580, boxShadow:'0 4px 20px rgba(30,64,175,.08)' }}>
                  {/* Sidebar */}
                  <div style={{ borderRight:'1px solid var(--n-100)', display:'flex', flexDirection:'column' }}>
                    <div style={{ padding:'1.25rem', borderBottom:'1px solid var(--n-100)' }}>
                      <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)', marginBottom:10 }}>Messages</div>
                      <input placeholder="Search…" className="input-field" style={{ fontSize:13, padding:'8px 12px' }}/>
                    </div>
                    <div style={{ flex:1, overflowY:'auto' }}>
                      {convs.map(c=>(
                        <div key={c.id} onClick={()=>{ setActiveConv(c.id); setConvs(prev=>prev.map(cv=>cv.id===c.id?{...cv,unread:0}:cv)); }}
                          style={{ display:'flex', gap:10, padding:'12px 1.25rem', background:activeConv===c.id?'var(--b-50)':'transparent', borderBottom:'1px solid var(--n-50)', cursor:'pointer', borderLeft:activeConv===c.id?'3px solid var(--b-500)':'3px solid transparent', transition:'all .15s' }}>
                          <div style={{ width:38, height:38, borderRadius:'50%', background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:14, fontWeight:600, color:c.color, flexShrink:0 }}>{c.initials}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:600, color:'var(--n-900)' }}>{c.name}</div>
                            <div style={{ fontSize:12, color:'var(--n-400)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginTop:2 }}>{c.preview}</div>
                          </div>
                          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
                            <span style={{ fontSize:10, color:'var(--n-400)' }}>{c.time}</span>
                            {c.unread>0 && <span style={{ background:'var(--b-500)', color:'white', fontSize:10, fontWeight:700, width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{c.unread}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat area */}
                  <div style={{ display:'flex', flexDirection:'column' }}>
                    {/* Chat header */}
                    <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid var(--n-100)', display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:40, height:40, borderRadius:'50%', background:currentConv.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:15, fontWeight:600, color:currentConv.color, flexShrink:0 }}>{currentConv.initials}</div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:600, color:'var(--n-900)' }}>{currentConv.name}</div>
                        <div style={{ fontSize:12, color:currentConv.online?'var(--green)':'var(--n-400)', display:'flex', alignItems:'center', gap:4 }}>
                          {currentConv.online && <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--green)' }}/>}
                          {currentConv.role}
                        </div>
                      </div>
                      <div style={{ marginLeft:'auto', display:'flex', gap:4 }}>
                        {[1,2,3,4,5].map(i=><Star key={i} size={12} fill="#F59E0B" color="#F59E0B"/>)}
                      </div>
                    </div>

                    {/* Messages */}
                    <div ref={msgBodyRef} style={{ flex:1, padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem', overflowY:'auto', maxHeight:400, background:'var(--n-50)' }}>
                      {currentConv.messages.map((m, i) => {
                        const showDay = m.day && (i===0 || currentConv.messages[i-1].day !== m.day);
                        return (
                          <div key={m.id}>
                            {showDay && (
                              <div style={{ textAlign:'center', fontSize:11, color:'var(--n-400)', position:'relative', margin:'8px 0' }}>
                                <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:'var(--n-200)' }}/>
                                <span style={{ background:'var(--n-50)', padding:'0 10px', position:'relative' }}>{m.day}</span>
                              </div>
                            )}
                            <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                              style={{ display:'flex', gap:8, alignItems:'flex-end', flexDirection:m.from==='me'?'row-reverse':'row' }}>
                              {m.from!=='me' && <div style={{ width:26, height:26, borderRadius:'50%', background:currentConv.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:currentConv.color, flexShrink:0 }}>{currentConv.initials}</div>}
                              <div>
                                <div style={{ maxWidth:380, padding:'10px 14px', borderRadius:16, fontSize:13, lineHeight:1.55, ...(m.from==='me' ? { background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', color:'white', borderBottomRightRadius:4 } : { background:'white', color:'var(--n-900)', borderBottomLeftRadius:4, boxShadow:'0 1px 4px rgba(0,0,0,.06)' }) }}>{m.text}</div>
                                <div style={{ fontSize:10, color:'var(--n-400)', marginTop:3, textAlign:m.from==='me'?'right':'left' }}>{m.ts}</div>
                              </div>
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Input */}
                    <div style={{ padding:'1rem 1.5rem', borderTop:'1px solid var(--n-100)', display:'flex', gap:10, background:'white' }}>
                      <input value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()}
                        placeholder="Type a message…" className="input-field"
                        style={{ flex:1, borderRadius:100, padding:'10px 18px', fontSize:13 }}/>
                      <motion.button onClick={sendMsg} whileHover={{ scale:1.08 }} whileTap={{ scale:.95 }}
                        style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 12px rgba(59,130,246,.4)', flexShrink:0 }}>
                        <Send size={15} color="white"/>
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* ════ SETTINGS ════ */}
              {page==='settings' && (
                <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:'1.5rem' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                    {(['profile','goals','notifications','privacy','account'] as const).map(t=>(
                      <button key={t} onClick={()=>setSettingsTab(t)}
                        style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, background:settingsTab===t?'var(--b-50)':'transparent', border:settingsTab===t?'1px solid var(--b-200)':'1px solid transparent', color:settingsTab===t?'var(--b-700)':'var(--n-500)', fontSize:13, fontWeight:settingsTab===t?600:400, cursor:'pointer', fontFamily:'var(--font-body)', textAlign:'left', textTransform:'capitalize', transition:'all .15s' }}>
                        {['👤','🎯','🔔','🔒','⚙'][['profile','goals','notifications','privacy','account'].indexOf(t)]} {t.charAt(0).toUpperCase()+t.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                    {settingsTab==='profile' && (<>
                      <div style={card}>
                        <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)', marginBottom:4 }}>Personal information</div>
                        <div style={{ fontSize:13, color:'var(--n-400)', marginBottom:'1.5rem' }}>Update your profile details.</div>
                        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:'1.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid var(--n-100)' }}>
                          <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, color:'white' }}>{initials}</div>
                          <div><div style={{ fontSize:16, fontWeight:600, color:'var(--n-900)' }}>{user.fname} {user.lname}</div><div style={{ fontSize:13, color:'var(--n-400)', marginTop:2 }}>Member since January 2026</div><button className="btn btn-ghost btn-sm" style={{ marginTop:8 }}>Change photo</button></div>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                          {[['First name',user.fname],['Last name',user.lname||''],['Email',user.email],['Phone','+1 (555) 012-3456'],['Location','San Francisco, CA'],['Date of birth','1994-07-15']].map(([lbl,val])=>(
                            <div key={lbl}><label className="input-label">{lbl}</label><input className="input-field" defaultValue={val}/></div>
                          ))}
                        </div>
                        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:'1.5rem' }}>
                          <button className="btn btn-ghost btn-sm">Cancel</button>
                          <button className="btn btn-primary btn-sm">Save changes</button>
                        </div>
                      </div>
                    </>)}
                    {settingsTab==='goals' && (
                      <div style={card}>
                        <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)', marginBottom:4 }}>Training goals</div>
                        <div style={{ fontSize:13, color:'var(--n-400)', marginBottom:'1.5rem' }}>Select all that apply.</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:'1.5rem' }}>
                          {['Complete first half-marathon','Improve 5K time','Run a marathon','Lose weight','Build endurance','Increase mileage','Qualify for a race','Injury prevention','Prenatal fitness','Women\'s strength'].map(g=>(
                            <button key={g} onClick={()=>setGoals(prev=>prev.includes(g)?prev.filter(x=>x!==g):[...prev,g])}
                              style={{ padding:'7px 14px', borderRadius:100, border:`1px solid ${goals.includes(g)?'var(--b-300)':'var(--n-200)'}`, background:goals.includes(g)?'var(--b-50)':'white', color:goals.includes(g)?'var(--b-700)':'var(--n-500)', fontSize:13, fontWeight:goals.includes(g)?600:400, cursor:'pointer', fontFamily:'var(--font-body)', transition:'all .2s' }}>{g}</button>
                          ))}
                        </div>
                        <button className="btn btn-primary btn-sm">Save goals</button>
                      </div>
                    )}
                    {(settingsTab==='notifications'||settingsTab==='privacy') && (
                      <div style={card}>
                        <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)', marginBottom:4 }}>{settingsTab==='notifications'?'Notification preferences':'Privacy settings'}</div>
                        <div style={{ fontSize:13, color:'var(--n-400)', marginBottom:'1.5rem' }}>{settingsTab==='notifications'?'Choose what you want to hear about.':'Control who can see your data.'}</div>
                        {(settingsTab==='notifications'
                          ? [['Session reminders','Get notified 1 hour before each session','sessions'],['Coach messages','Notify when your coach sends a message','coach'],['Weekly summary','Receive a training digest every Monday','weekly'],['Personal bests','Celebrate new PBs','pbs'],['Program updates','Coach adjustments to your plan','updates'],['Marketing emails','News from ApexSport','marketing']]
                          : [['Public profile','Allow others to find you','sessions'],['Share with coach','Coach can view your stats','coach'],['Share PBs','Show records on your profile','pbs'],['Analytics','Help us improve ApexSport','weekly']]
                        ).map(([label,sub,key])=>{
                          const k = key as keyof typeof toggles;
                          return (
                            <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--n-100)' }}>
                              <div><div style={{ fontSize:13, fontWeight:500, color:'var(--n-900)' }}>{label}</div><div style={{ fontSize:12, color:'var(--n-400)', marginTop:2 }}>{sub}</div></div>
                              <motion.button onClick={()=>setToggles(t=>({...t,[k]:!t[k]}))} animate={{ background:toggles[k]?'var(--b-500)':'var(--n-200)' }}
                                style={{ width:40, height:22, borderRadius:100, border:'none', cursor:'pointer', position:'relative', flexShrink:0 }}>
                                <motion.div animate={{ left:toggles[k]?20:3 }} transition={{ type:'spring', stiffness:500, damping:30 }}
                                  style={{ position:'absolute', top:3, width:16, height:16, borderRadius:'50%', background:'white', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
                              </motion.button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {settingsTab==='account' && (<>
                      <div style={card}>
                        <div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)', marginBottom:4 }}>Change password</div>
                        <div style={{ fontSize:13, color:'var(--n-400)', marginBottom:'1.5rem' }}>Use a strong password of at least 12 characters.</div>
                        {['Current password','New password','Confirm new password'].map(l=>(
                          <div key={l} style={{ marginBottom:12 }}><label className="input-label">{l}</label><input type="password" className="input-field" placeholder="••••••••••••"/></div>
                        ))}
                        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'1rem' }}><button className="btn btn-primary btn-sm">Update password</button></div>
                      </div>
                      <div style={{ ...card, border:'1px solid #FECACA' }}>
                        <div style={{ fontSize:15, fontWeight:600, color:'#B91C1C', marginBottom:4 }}>Danger zone</div>
                        <div style={{ fontSize:13, color:'var(--n-400)', marginBottom:'1.5rem' }}>These actions cannot be undone.</div>
                        <div style={{ display:'flex', gap:10 }}>
                          <button style={{ padding:'8px 18px', borderRadius:100, border:'1px solid #FECACA', background:'transparent', fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)', color:'#B91C1C' }}>Pause subscription</button>
                          <button style={{ padding:'8px 18px', borderRadius:100, border:'1px solid #FECACA', background:'transparent', fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)', color:'#B91C1C' }}>Delete account</button>
                        </div>
                      </div>
                    </>)}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-inner">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id as typeof page)}
              className={`mobile-nav-item ${page===item.id?'active':''}`}>
              <item.icon size={20} color={page===item.id ? 'var(--b-600)' : 'var(--n-400)'} />
              <span style={{ fontSize:10, fontWeight:500, color:page===item.id?'var(--b-600)':'var(--n-400)' }}>
                {item.label}
              </span>
              {'badge' in item && item.badge > 0 && (
                <div className="mobile-nav-badge">{item.badge}</div>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
