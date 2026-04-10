import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { addAccount, saveUser } from '../utils/auth';
import { programsBySport } from '../data';

const GOALS = ['Complete my first race', 'Improve my personal best', 'Build fitness & endurance', 'Train for a competition'];
const SPORTS = [{ id: 'running', label: 'Running', icon: '🏃', desc: 'From 5K to marathon' }, { id: 'swimming', label: 'Swimming', icon: '🏊', desc: 'Pool or open water' }, { id: 'cycling', label: 'Cycling', icon: '🚴', desc: 'Road, track, or tri' }];
const LEVELS = [{ id: 'amateur', label: 'Amateur', desc: 'Recreational athlete or just getting started with structured training.' }, { id: 'pro', label: 'Professional', desc: 'Competing regularly and training seriously with performance goals.' }];

interface State {
  fname: string; lname: string; email: string; password: string; goal: string;
  sport: string; level: string; program: string;
}

const initial: State = { fname: '', lname: '', email: '', password: '', goal: '', sport: '', level: '', program: '' };

export default function SignupPage() {
  const [step, setStep]     = useState(1);
  const [state, setState]   = useState<State>(initial);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<string>('');
  const navigate = useNavigate();
  const totalSteps = 4;

  function update(partial: Partial<State>) { setState(s => ({ ...s, ...partial })); }

  function nextStep() {
    setErrors('');
    if (step === 1) {
      if (!state.fname || !state.email || !state.password || !state.goal) { setErrors('Please fill in all fields.'); return; }
      if (state.password.length < 8) { setErrors('Password must be at least 8 characters.'); return; }
    }
    if (step === 2 && (!state.sport || !state.level)) { setErrors('Please select your sport and level.'); return; }
    if (step === 3 && !state.program) { setErrors('Please choose a program.'); return; }
    setStep(s => s + 1);
  }

  function confirm() {
    addAccount({ ...state, password: state.password });
    saveUser({ fname: state.fname, lname: state.lname, email: state.email, sport: state.sport, level: state.level, program: state.program });
    navigate('/dashboard');
  }

  const stepTitles = ['Create your profile', 'Sport & level', 'Choose your program', 'Review & confirm'];
  const programs = state.sport ? (programsBySport[state.sport] || []) : [];

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '6rem 1rem 4rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 400, background: 'radial-gradient(ellipse, rgba(59,130,246,.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 520, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #1151A6, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'white', fontWeight: 600 }}>
              Apex<span style={{ color: 'var(--#3B82F6', fontStyle: 'italic' }}>Sport</span>
            </span>
          </Link>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <motion.div
                  animate={{ background: i + 1 < step ? 'var(--#3B82F6' : i + 1 === step ? '#1151A6' : 'rgba(255,255,255,.1)', scale: i + 1 === step ? 1.15 : 1 }}
                  transition={{ duration: .3 }}
                  style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', border: i + 1 === step ? '2px solid var(--#3B82F6' : 'none' }}
                >
                  {i + 1 < step ? <Check size={14} /> : i + 1}
                </motion.div>
                <span style={{ fontSize: 12, color: i + 1 === step ? 'white' : 'rgba(255,255,255,.35)', fontWeight: i + 1 === step ? 600 : 400, display: window.innerWidth > 500 ? 'block' : 'none' }}>
                  {['Profile', 'Sport', 'Program', 'Confirm'][i]}
                </span>
                {i < totalSteps - 1 && <div style={{ flex: 1, height: 1, background: i + 1 < step ? 'var(--#3B82F6' : 'rgba(255,255,255,.1)', minWidth: 20, marginLeft: 6, transition: 'background .4s' }} />}
              </div>
            ))}
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,.08)', borderRadius: 2, overflow: 'hidden' }}>
            <motion.div animate={{ width: `${(step / totalSteps) * 100}%` }} transition={{ duration: .4 }} style={{ height: '100%', background: 'linear-gradient(90deg, #1151A6, var(--#3B82F6)', borderRadius: 2 }} />
          </div>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: '2.5rem', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: .3 }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.65rem', fontWeight: 600, color: 'white', marginBottom: 6 }}>{stepTitles[step - 1]}</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', marginBottom: '1.75rem', lineHeight: 1.5 }}>Step {step} of {totalSteps}</p>

              {errors && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 'var(--r-md)', padding: '11px 14px', fontSize: 13, color: '#FCA5A5', marginBottom: '1.25rem' }}>
                  ⚠ {errors}
                </motion.div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label className="input-label">First name</label><input className="input-field" value={state.fname} onChange={e => update({ fname: e.target.value })} placeholder="Alex" /></div>
                    <div><label className="input-label">Last name</label><input className="input-field" value={state.lname} onChange={e => update({ lname: e.target.value })} placeholder="Müller" /></div>
                  </div>
                  <div><label className="input-label">Email</label><input type="email" className="input-field" value={state.email} onChange={e => update({ email: e.target.value })} placeholder="you@email.com" /></div>
                  <div>
                    <label className="input-label">Password</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPw ? 'text' : 'password'} className="input-field" value={state.password} onChange={e => update({ password: e.target.value })} placeholder="Min. 8 characters" style={{ paddingRight: 44 }} />
                      <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.35)', padding: 4 }}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Your main goal</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {GOALS.map(g => (
                        <button key={g} type="button" onClick={() => update({ goal: g })} style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', border: `1px solid ${state.goal === g ? 'rgba(59,130,246,.5)' : 'rgba(255,255,255,.1)'}`, background: state.goal === g ? 'rgba(59,130,246,.12)' : 'rgba(255,255,255,.04)', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: state.goal === g ? 'var(--#3B82F6' : 'rgba(255,255,255,.6)', textAlign: 'left', fontFamily: 'var(--font-body)', transition: 'all .2s', lineHeight: 1.4 }}>{g}</button>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--#3B82F6', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
                  </p>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label className="input-label">Your sport</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                      {SPORTS.map(s => (
                        <motion.button key={s.id} type="button" onClick={() => update({ sport: s.id, program: '' })} whileHover={{ y: -2 }} whileTap={{ scale: .97 }} style={{ padding: '1rem 8px', borderRadius: 'var(--r-lg)', border: `1px solid ${state.sport === s.id ? 'rgba(59,130,246,.6)' : 'rgba(255,255,255,.1)'}`, background: state.sport === s.id ? 'rgba(59,130,246,.1)' : 'rgba(255,255,255,.04)', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'center', transition: 'all .2s', boxShadow: state.sport === s.id ? '0 0 20px rgba(59,130,246,.2)' : 'none' }}>
                          <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: state.sport === s.id ? 'var(--#3B82F6' : 'rgba(255,255,255,.8)' }}>{s.label}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{s.desc}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Your level</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {LEVELS.map(l => (
                        <button key={l.id} type="button" onClick={() => update({ level: l.id, program: '' })} style={{ padding: '1.1rem', borderRadius: 'var(--r-lg)', border: `1px solid ${state.level === l.id ? 'rgba(59,130,246,.6)' : 'rgba(255,255,255,.1)'}`, background: state.level === l.id ? 'rgba(59,130,246,.1)' : 'rgba(255,255,255,.04)', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left', transition: 'all .2s', boxShadow: state.level === l.id ? '0 0 20px rgba(59,130,246,.15)' : 'none' }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: state.level === l.id ? 'var(--#3B82F6' : 'rgba(255,255,255,.8)', marginBottom: 5 }}>{l.label}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', lineHeight: 1.4 }}>{l.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {programs.length === 0 && <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)' }}>Go back and select your sport first.</p>}
                  {programs.map(p => (
                    <motion.button key={p.name} type="button" onClick={() => update({ program: p.name })} whileHover={{ x: 3 }} style={{ padding: '1rem 1.1rem', borderRadius: 'var(--r-lg)', border: `1px solid ${state.program === p.name ? 'rgba(59,130,246,.5)' : 'rgba(255,255,255,.08)'}`, background: state.program === p.name ? 'rgba(59,130,246,.08)' : 'rgba(255,255,255,.03)', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${p.bg}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{p.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: state.program === p.name ? 'var(--#3B82F6' : 'white' }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{p.meta}</div>
                      </div>
                      <span className={`badge ${p.level === 'pro' ? 'badge-purple' : 'badge-blue'}`}>{p.level === 'pro' ? 'Pro' : 'Amateur'}</span>
                      {state.program === p.name && <Check size={16} color="var(--#3B82F6" />}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[['Name', `${state.fname} ${state.lname}`], ['Email', state.email], ['Goal', state.goal], ['Sport', state.sport], ['Level', state.level], ['Program', state.program]].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,.07)', fontSize: 14 }}>
                      <span style={{ color: 'rgba(255,255,255,.4)', fontWeight: 500 }}>{label}</span>
                      <span style={{ color: 'white', fontWeight: 600, textTransform: label === 'Sport' || label === 'Level' ? 'capitalize' : 'none' }}>{value}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 'var(--r-md)', background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.2)' }}>
                    <p style={{ fontSize: 13, color: 'rgba(59,130,246,.8)', lineHeight: 1.6 }}>🎉 You're all set! After enrolling, your coach will reach out within 24 hours to schedule your first session.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 10, marginTop: '2rem' }}>
            {step > 1 && (
              <button onClick={() => { setStep(s => s - 1); setErrors(''); }} className="btn btn-ghost" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
            {step < totalSteps ? (
              <motion.button onClick={nextStep} className="btn btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }} style={{ flex: 1, justifyContent: 'center', fontSize: 15 }}>
                Continue <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.button onClick={confirm} className="btn btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }} style={{ flex: 1, justifyContent: 'center', fontSize: 15 }}>
                Confirm & start training 🚀
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
