import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { addAccount, saveUser } from '../utils/auth';
import { programsBySport } from '../data';

const GOALS = ['Complete my first race','Improve my personal best','Build fitness & endurance','Train for a competition','Lose weight & get fit','Prenatal or postnatal training'];
const SPORTS = [
  { id:'running',       label:'Running',        icon:'🏃', desc:'5K to marathon' },
  { id:'swimming',      label:'Swimming',       icon:'🏊', desc:'Pool & open water' },
  { id:'cycling',       label:'Cycling',        icon:'🚴', desc:'Road, track & tri' },
  { id:'fitness-men',   label:'Men\'s Fitness', icon:'💪', desc:'Strength & conditioning' },
  { id:'fitness-women', label:'Women\'s Fitness',icon:'💃',desc:'Sculpt & strengthen' },
  { id:'prenatal',      label:'Prenatal',       icon:'🤰', desc:'Safe pregnancy fitness' },
  { id:'yoga',          label:'Yoga',           icon:'🧘', desc:'Flexibility & mindfulness' },
  { id:'hiit',          label:'HIIT',           icon:'⚡', desc:'High-intensity training' },
  { id:'strength',      label:'Strength',       icon:'🏋️', desc:'Powerlifting & Olympic' },
];
const LEVELS = [
  { id:'amateur', label:'Amateur',      desc:'Recreational or just starting structured training.' },
  { id:'pro',     label:'Professional', desc:'Competing regularly, serious performance goals.' },
  { id:'all',     label:'All Levels',   desc:'Suitable regardless of experience level.' },
];

interface State { fname:string; lname:string; email:string; password:string; goal:string; sport:string; level:string; program:string; }
const initial: State = { fname:'',lname:'',email:'',password:'',goal:'',sport:'',level:'',program:'' };

export default function SignupPage() {
  const [step, setStep]   = useState(1);
  const [s, setS]         = useState<State>(initial);
  const [showPw,setShowPw]= useState(false);
  const [errors,setErrors]= useState('');
  const navigate = useNavigate();
  const up = (p: Partial<State>) => setS(prev => ({...prev, ...p}));

  function next() {
    setErrors('');
    if (step===1) {
      if (!s.fname||!s.email||!s.password||!s.goal) { setErrors('Please fill in all fields.'); return; }
      if (s.password.length<8) { setErrors('Password must be at least 8 characters.'); return; }
    }
    if (step===2 && (!s.sport||!s.level)) { setErrors('Please select sport and level.'); return; }
    if (step===3 && !s.program)           { setErrors('Please choose a program.'); return; }
    setStep(n => n+1);
  }

  function confirm() {
    addAccount({...s, password:s.password});
    saveUser({ fname:s.fname, lname:s.lname, email:s.email, sport:s.sport, level:s.level, program:s.program });
    navigate('/dashboard');
  }

  const progs = s.sport ? (programsBySport[s.sport]||[]) : [];
  const titles = ['Create your profile','Sport & level','Choose your program','Review & confirm'];

  return (
    <div style={{ background:'var(--page-bg)', minHeight:'100vh', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'6rem 1rem 4rem' }}>
      <div style={{ position:'absolute', top:'15%', left:'10%', width:400, height:400, background:'radial-gradient(circle, rgba(59,130,246,.07) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ width:'100%', maxWidth:540 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <Link to="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#1D4ED8,#3B82F6,#06B6D4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Zap size={16} color="white" fill="white" /></div>
            <span style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--n-900)', fontWeight:600 }}>
              Apex<span style={{ background:'linear-gradient(135deg,#2563EB,#06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontStyle:'italic' }}>Sport</span>
            </span>
          </Link>
        </div>

        {/* Progress */}
        <div style={{ marginBottom:'2rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
            {Array.from({length:4},(_,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <motion.div animate={{ background: i+1<step?'var(--b-600)': i+1===step?'var(--b-500)':'var(--n-200)', scale: i+1===step?1.1:1 }} transition={{ duration:.25 }}
                  style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:i+1<=step?'white':'var(--n-500)', border:i+1===step?'2px solid var(--b-400)':'none' }}>
                  {i+1<step?<Check size={14}/>:i+1}
                </motion.div>
                <span style={{ fontSize:12, color:i+1===step?'var(--n-900)':'var(--n-400)', fontWeight:i+1===step?600:400 }}>{['Profile','Sport','Program','Confirm'][i]}</span>
                {i<3 && <div style={{ flex:1, height:1.5, background:i+1<step?'var(--b-400)':'var(--n-200)', minWidth:16, marginLeft:6, transition:'background .4s' }} />}
              </div>
            ))}
          </div>
          <div style={{ height:3, background:'var(--n-100)', borderRadius:2, overflow:'hidden' }}>
            <motion.div animate={{ width:`${(step/4)*100}%` }} transition={{ duration:.4 }} style={{ height:'100%', background:'linear-gradient(90deg,var(--b-700),var(--b-500),var(--c-500))', borderRadius:2 }} />
          </div>
        </div>

        <div className="card" style={{ padding:'2.5rem', overflow:'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:.3 }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.65rem', fontWeight:600, color:'var(--n-900)', marginBottom:5 }}>{titles[step-1]}</h2>
              <p style={{ fontSize:14, color:'var(--n-400)', marginBottom:'1.75rem' }}>Step {step} of 4</p>

              {errors && (
                <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                  style={{ display:'flex', alignItems:'center', gap:10, background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'var(--r-md)', padding:'11px 14px', fontSize:13, color:'#B91C1C', marginBottom:'1.25rem' }}>
                  ⚠ {errors}
                </motion.div>
              )}

              {step===1 && (
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div><label className="input-label">First name</label><input className="input-field" value={s.fname} onChange={e=>up({fname:e.target.value})} placeholder="Alex" /></div>
                    <div><label className="input-label">Last name</label><input className="input-field" value={s.lname} onChange={e=>up({lname:e.target.value})} placeholder="Müller" /></div>
                  </div>
                  <div><label className="input-label">Email</label><input type="email" className="input-field" value={s.email} onChange={e=>up({email:e.target.value})} placeholder="you@email.com" /></div>
                  <div>
                    <label className="input-label">Password</label>
                    <div style={{ position:'relative' }}>
                      <input type={showPw?'text':'password'} className="input-field" value={s.password} onChange={e=>up({password:e.target.value})} placeholder="Min. 8 characters" style={{ paddingRight:44 }} />
                      <button type="button" onClick={()=>setShowPw(!showPw)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--n-400)', padding:4 }}>
                        {showPw?<EyeOff size={16}/>:<Eye size={16}/>}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Your main goal</label>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                      {GOALS.map(g=>(
                        <button key={g} type="button" onClick={()=>up({goal:g})}
                          style={{ padding:'10px 12px', borderRadius:'var(--r-md)', border:`1.5px solid ${s.goal===g?'var(--b-400)':'var(--n-200)'}`, background:s.goal===g?'var(--b-50)':'white', cursor:'pointer', fontSize:12, fontWeight:500, color:s.goal===g?'var(--b-700)':'var(--n-600)', textAlign:'left', fontFamily:'var(--font-body)', transition:'all .2s', lineHeight:1.4 }}>{g}</button>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize:12, color:'var(--n-400)', textAlign:'center' }}>
                    Already have an account? <Link to="/login" style={{ color:'var(--b-600)', textDecoration:'none', fontWeight:600 }}>Log in</Link>
                  </p>
                </div>
              )}

              {step===2 && (
                <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                  <div>
                    <label className="input-label">Your sport</label>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                      {SPORTS.map(sp=>(
                        <motion.button key={sp.id} type="button" onClick={()=>up({sport:sp.id,program:''})} whileHover={{ y:-2 }} whileTap={{ scale:.97 }}
                          style={{ padding:'1rem 8px', borderRadius:'var(--r-lg)', border:`1.5px solid ${s.sport===sp.id?'var(--b-400)':'var(--n-200)'}`, background:s.sport===sp.id?'var(--b-50)':'white', cursor:'pointer', fontFamily:'var(--font-body)', textAlign:'center', transition:'all .2s', boxShadow:s.sport===sp.id?'0 4px 16px rgba(37,99,235,.15)':'none' }}>
                          <div style={{ fontSize:26, marginBottom:5 }}>{sp.icon}</div>
                          <div style={{ fontSize:13, fontWeight:600, color:s.sport===sp.id?'var(--b-700)':'var(--n-700)' }}>{sp.label}</div>
                          <div style={{ fontSize:11, color:'var(--n-400)', marginTop:2 }}>{sp.desc}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Your level</label>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                      {LEVELS.map(l=>(
                        <button key={l.id} type="button" onClick={()=>up({level:l.id,program:''})}
                          style={{ padding:'1rem', borderRadius:'var(--r-lg)', border:`1.5px solid ${s.level===l.id?'var(--b-400)':'var(--n-200)'}`, background:s.level===l.id?'var(--b-50)':'white', cursor:'pointer', fontFamily:'var(--font-body)', textAlign:'left', transition:'all .2s', boxShadow:s.level===l.id?'0 4px 16px rgba(37,99,235,.12)':'none' }}>
                          <div style={{ fontSize:14, fontWeight:600, color:s.level===l.id?'var(--b-700)':'var(--n-700)', marginBottom:5 }}>{l.label}</div>
                          <div style={{ fontSize:11, color:'var(--n-400)', lineHeight:1.4 }}>{l.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step===3 && (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {progs.length===0 && <p style={{ fontSize:14, color:'var(--n-400)' }}>Go back and select your sport first.</p>}
                  {progs.map(p=>(
                    <motion.button key={p.name} type="button" onClick={()=>up({program:p.name})} whileHover={{ x:3 }}
                      style={{ padding:'1rem 1.1rem', borderRadius:'var(--r-lg)', border:`1.5px solid ${s.program===p.name?'var(--b-400)':'var(--n-200)'}`, background:s.program===p.name?'var(--b-50)':'white', cursor:'pointer', fontFamily:'var(--font-body)', textAlign:'left', transition:'all .2s', display:'flex', alignItems:'center', gap:14 }}>
                      <div style={{ width:42, height:42, borderRadius:12, background:p.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{p.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:600, color:s.program===p.name?'var(--b-700)':'var(--n-800)' }}>{p.name}</div>
                        <div style={{ fontSize:12, color:'var(--n-400)', marginTop:2 }}>{p.meta}</div>
                      </div>
                      <span className={`badge ${p.level==='pro'?'badge-purple':p.level==='all'?'badge-green':'badge-blue'}`}>{p.level==='pro'?'Pro':p.level==='all'?'All levels':'Amateur'}</span>
                      {s.program===p.name && <Check size={16} color="var(--b-600)" />}
                    </motion.button>
                  ))}
                </div>
              )}

              {step===4 && (
                <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                  {[['Name',`${s.fname} ${s.lname}`],['Email',s.email],['Goal',s.goal],['Sport',s.sport],['Level',s.level],['Program',s.program]].map(([label,value])=>(
                    <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--n-100)', fontSize:14 }}>
                      <span style={{ color:'var(--n-500)', fontWeight:500 }}>{label}</span>
                      <span style={{ color:'var(--n-900)', fontWeight:600, textTransform:(label==='Sport'||label==='Level')?'capitalize':'none' }}>{value}</span>
                    </div>
                  ))}
                  <div style={{ marginTop:'1.5rem', padding:'1rem', borderRadius:'var(--r-md)', background:'var(--b-50)', border:'1px solid var(--b-200)' }}>
                    <p style={{ fontSize:13, color:'var(--b-700)', lineHeight:1.6 }}>🎉 After enrolling, your coach will reach out within 24 hours to schedule your first session.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div style={{ display:'flex', gap:10, marginTop:'2rem' }}>
            {step>1 && (
              <button onClick={()=>{ setStep(n=>n-1); setErrors(''); }} className="btn btn-ghost" style={{ flex:'0 0 auto', display:'flex', alignItems:'center', gap:6, fontSize:14 }}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
            {step<4 ? (
              <motion.button onClick={next} className="btn btn-primary" whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }} style={{ flex:1, justifyContent:'center', fontSize:15 }}>
                Continue <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.button onClick={confirm} className="btn btn-primary" whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }} style={{ flex:1, justifyContent:'center', fontSize:15 }}>
                Confirm & start training 🚀
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
