import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Star, ChevronRight, Zap, Shield, TrendingUp, Users } from 'lucide-react';
import { coaches, programs } from '../data';

const fadeUp = { hidden: { opacity:0, y:28 }, show: { opacity:1, y:0 } };
const stagger = { show: { transition: { staggerChildren:.11 } } };

function Section({ children, style={} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin:'-80px' });
  return <motion.div ref={ref} initial="hidden" animate={inView?'show':'hidden'} variants={stagger} style={style}>{children}</motion.div>;
}

const stats = [
  { value:'240+', label:'Programs',         color:'var(--b-600)' },
  { value:'48',   label:'Expert Coaches',   color:'var(--c-500)' },
  { value:'12k',  label:'Active Athletes',  color:'var(--violet)' },
  { value:'94%',  label:'Goal Achievement', color:'var(--amber)' },
];
const features = [
  { icon:Zap,         title:'AI-Matched Programs',  desc:'Our algorithm pairs you with the perfect plan based on your history, goals, and schedule.',    color:'var(--b-600)' },
  { icon:Users,       title:'Elite Coaching',        desc:'Every athlete gets a certified expert who checks in weekly and adapts your plan in real-time.', color:'var(--c-500)' },
  { icon:TrendingUp,  title:'Data-Driven Progress',  desc:'Track pace, heart rate, load and recovery in one clean, beautiful dashboard.',                color:'var(--violet)' },
  { icon:Shield,      title:'Injury Prevention',     desc:'Smart load monitoring and built-in recovery weeks keep you training consistently year-round.',  color:'var(--green)' },
];
const sports = ['Running','Swimming','Cycling','Fitness','Prenatal','Yoga','HIIT','Strength','Trail Running','Open Water'];
const sportCards = [
  { icon:'🏃', label:'Running',    color:'#EFF6FF', border:'#BFDBFE', text:'var(--b-700)' },
  { icon:'🏊', label:'Swimming',   color:'#F0F9FF', border:'#BAE6FD', text:'#0369A1' },
  { icon:'🚴', label:'Cycling',    color:'#ECFDF5', border:'#A7F3D0', text:'#065F46' },
  { icon:'💪', label:'Fitness Men',color:'#FFF7ED', border:'#FED7AA', text:'#C2410C' },
  { icon:'💃', label:'Fitness Women',color:'#FDF4FF', border:'#E9D5FF', text:'#7E22CE' },
  { icon:'🤰', label:'Prenatal',   color:'#FFF1F2', border:'#FECDD3', text:'#BE123C' },
  { icon:'🧘', label:'Yoga',       color:'#F5F3FF', border:'#DDD6FE', text:'#5B21B6' },
  { icon:'⚡', label:'HIIT',       color:'#FFFBEB', border:'#FDE68A', text:'#92400E' },
];

export default function HomePage() {
  return (
    <div style={{ background:'var(--page-bg)', overflowX:'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden', paddingTop:100 }}>
        {/* Soft blobs */}
        <div style={{ position:'absolute', top:'-10%', right:'-5%', width:700, height:700, background:'radial-gradient(circle, rgba(59,130,246,.12) 0%, transparent 65%)', pointerEvents:'none', animation:'float 14s ease infinite' }} />
        <div style={{ position:'absolute', bottom:'5%', left:'-5%', width:500, height:500, background:'radial-gradient(circle, rgba(6,182,212,.09) 0%, transparent 65%)', pointerEvents:'none', animation:'float 18s ease infinite reverse' }} />
        {/* Dot grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(59,130,246,.18) 1px, transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none', opacity:.4 }} />

        <div className="container" style={{ paddingTop:'3rem', paddingBottom:'5rem' }}>
          <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:.7, ease:[.4,0,.2,1] }} style={{ maxWidth:820, margin:'0 auto', textAlign:'center' }}>
            <motion.div initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.15 }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(59,130,246,.1)', border:'1px solid rgba(59,130,246,.25)', borderRadius:100, padding:'7px 18px', marginBottom:'2rem' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--b-500)', boxShadow:'0 0 8px var(--b-400)', animation:'pulse-glow 2s ease infinite' }} />
              <span style={{ fontSize:13, fontWeight:600, color:'var(--b-700)', letterSpacing:'.05em' }}>Individual Sports Training Platform</span>
            </motion.div>

            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.8rem,7vw,5.8rem)', fontWeight:600, lineHeight:1.07, letterSpacing:'-0.025em', color:'var(--n-900)', marginBottom:'1.5rem' }}>
              Train like a{' '}
              <span className="gradient-text" style={{ fontStyle:'italic' }}>champion.</span>
              <br />
              <span style={{ color:'var(--n-400)' }}>Perform without limits.</span>
            </h1>

            <p style={{ fontSize:'clamp(16px,2vw,19px)', color:'var(--n-500)', lineHeight:1.7, maxWidth:560, margin:'0 auto 2.5rem' }}>
              Expert-built programs for runners, swimmers, cyclists, and more — personalised to your level, coached by the best.
            </p>

            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/signup" className="btn btn-primary" style={{ textDecoration:'none', fontSize:16, padding:'14px 34px' }}>
                Start training free <ArrowRight size={18} />
              </Link>
              <Link to="/programs" className="btn btn-ghost" style={{ textDecoration:'none', fontSize:16, padding:'14px 34px' }}>Browse programs</Link>
            </div>

            {/* Social proof */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.7 }}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginTop:'2.5rem' }}>
              <div style={{ display:'flex' }}>
                {['#3B82F6','#06B6D4','#8B5CF6','#60A5FA','#22D3EE'].map((c,i)=>(
                  <div key={i} style={{ width:32, height:32, borderRadius:'50%', background:c, border:'2px solid white', marginLeft:i?-8:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white', boxShadow:'0 2px 6px rgba(0,0,0,.15)' }}>
                    {['AL','MR','SC','JP','LB'][i]}
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                {[1,2,3,4,5].map(i=><Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />)}
                <span style={{ fontSize:13, color:'var(--n-500)' }}>4.9 · Loved by 12,000+ athletes</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Stat cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginTop:'5rem', maxWidth:880, margin:'5rem auto 0' }}>
            {stats.map((s,i)=>(
              <motion.div key={s.label} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:.5+i*.1 }}
                style={{ padding:'1.5rem', borderRadius:'var(--r-lg)', textAlign:'center', background:'white', border:`1px solid rgba(59,130,246,.15)`, boxShadow:'0 4px 20px rgba(59,130,246,.08)' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'2.3rem', fontWeight:600, color:s.color, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:12, color:'var(--n-500)', marginTop:6, fontWeight:500 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop:'1px solid rgba(59,130,246,.1)', borderBottom:'1px solid rgba(59,130,246,.1)', padding:'16px 0', background:'rgba(59,130,246,.03)', overflow:'hidden' }}>
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[...sports,...sports].map((s,i)=>(
              <span key={i} style={{ display:'flex', alignItems:'center', gap:18, paddingRight:40, fontSize:13, fontWeight:600, color:'var(--n-400)', letterSpacing:'.08em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
                <span style={{ color:'var(--b-400)', fontSize:8 }}>◆</span>{s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── SPORT CATEGORIES ── */}
      <section style={{ padding:'7rem 0 4rem' }}>
        <div className="container">
          <Section>
            <motion.div variants={fadeUp} style={{ textAlign:'center', marginBottom:'3rem' }}>
              <div style={{ display:'inline-block', background:'var(--b-50)', border:'1px solid var(--b-200)', borderRadius:100, padding:'5px 16px', marginBottom:'1rem' }}>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--b-700)', letterSpacing:'.1em', textTransform:'uppercase' }}>8 Disciplines</span>
              </div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,4vw,3rem)', fontWeight:600, color:'var(--n-900)', letterSpacing:'-.02em' }}>
                Find your <span className="gradient-text" style={{ fontStyle:'italic' }}>discipline</span>
              </h2>
            </motion.div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
              {sportCards.map(s=>(
                <motion.div key={s.label} variants={fadeUp}
                  whileHover={{ y:-4, transition:{ duration:.18 } }}
                  style={{ padding:'1.5rem', borderRadius:'var(--r-lg)', background:s.color, border:`1px solid ${s.border}`, textAlign:'center', cursor:'pointer' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>{s.icon}</div>
                  <div style={{ fontSize:14, fontWeight:600, color:s.text }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:'5rem 0 7rem', background:'white' }}>
        <div className="container">
          <Section>
            <motion.div variants={fadeUp} style={{ textAlign:'center', marginBottom:'4rem' }}>
              <div style={{ display:'inline-block', background:'var(--b-50)', border:'1px solid var(--b-200)', borderRadius:100, padding:'5px 16px', marginBottom:'1rem' }}>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--b-700)', letterSpacing:'.1em', textTransform:'uppercase' }}>Why ApexSport</span>
              </div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,4vw,3rem)', fontWeight:600, color:'var(--n-900)', letterSpacing:'-.02em' }}>
                Everything you need to{' '}<span className="gradient-text" style={{ fontStyle:'italic' }}>reach the top</span>
              </h2>
            </motion.div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
              {features.map(f=>(
                <motion.div key={f.title} variants={fadeUp} className="card" style={{ padding:'2rem' }} whileHover={{ y:-6, transition:{ duration:.2 } }}>
                  <div style={{ width:52, height:52, borderRadius:16, background:`color-mix(in srgb, ${f.color} 10%, white)`, border:`1.5px solid color-mix(in srgb, ${f.color} 25%, white)`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.25rem' }}>
                    <f.icon size={22} color={f.color} />
                  </div>
                  <h3 style={{ fontSize:17, fontWeight:600, color:'var(--n-900)', marginBottom:10 }}>{f.title}</h3>
                  <p style={{ fontSize:14, color:'var(--n-500)', lineHeight:1.65 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── PROGRAMS PREVIEW ── */}
      <section style={{ padding:'6rem 0 7rem' }}>
        <div className="container">
          <Section>
            <motion.div variants={fadeUp} style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'3rem', flexWrap:'wrap', gap:16 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--b-600)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Training programs</div>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:600, color:'var(--n-900)', letterSpacing:'-.02em' }}>Your sport, your pace</h2>
              </div>
              <Link to="/programs" className="btn btn-ghost btn-sm" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:6 }}>View all <ChevronRight size={16} /></Link>
            </motion.div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:18 }}>
              {programs.slice(0,6).map(p=>(
                <motion.div key={p.name} variants={fadeUp} className="card" style={{ padding:'1.75rem' }} whileHover={{ y:-5, transition:{ duration:.2 } }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
                    <div style={{ width:50, height:50, borderRadius:14, background:p.bg, border:'1px solid rgba(0,0,0,.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{p.icon}</div>
                    <span className={`badge ${p.level==='pro'?'badge-purple':'badge-blue'}`}>{p.level==='pro'?'Pro':'Amateur'}</span>
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:600, color:'var(--n-900)', marginBottom:8 }}>{p.name}</h3>
                  <p style={{ fontSize:13, color:'var(--n-500)', lineHeight:1.6, marginBottom:'1.25rem' }}>{p.desc}</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'1rem', borderTop:'1px solid var(--n-100)' }}>
                    <span style={{ fontSize:12, color:'var(--n-400)', fontWeight:500 }}>⏱ {p.meta}</span>
                    <Link to="/signup" style={{ fontSize:13, fontWeight:600, color:'var(--b-600)', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}
                      onMouseEnter={e=>(e.currentTarget.style.gap='8px')} onMouseLeave={e=>(e.currentTarget.style.gap='4px')}>
                      Enroll <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── COACHES ── */}
      <section style={{ padding:'5rem 0 7rem', background:'white' }}>
        <div className="container">
          <Section>
            <motion.div variants={fadeUp} style={{ textAlign:'center', marginBottom:'3.5rem' }}>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--b-600)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>World-class coaches</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:600, color:'var(--n-900)', letterSpacing:'-.02em' }}>
                Train with the <span className="gradient-text" style={{ fontStyle:'italic' }}>best</span>
              </h2>
            </motion.div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
              {coaches.slice(0,3).map(c=>(
                <motion.div key={c.name} variants={fadeUp} className="card" style={{ padding:'1.75rem' }} whileHover={{ y:-5, transition:{ duration:.2 } }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:'1rem' }}>
                    <div style={{ width:54, height:54, borderRadius:'50%', background:c.avatarBg, border:`2px solid ${c.avatarColor}33`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:18, fontWeight:600, color:c.avatarColor }}>{c.initials}</div>
                    <div><div style={{ fontSize:15, fontWeight:600, color:'var(--n-900)' }}>{c.name}</div><div style={{ fontSize:12, color:'var(--n-500)', marginTop:2 }}>{c.sport}</div></div>
                  </div>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:'1rem' }}>
                    {c.tags.slice(0,3).map(t=><span key={t} style={{ fontSize:11, padding:'3px 9px', borderRadius:100, background:'var(--b-50)', border:'1px solid var(--b-100)', color:'var(--b-700)' }}>{t}</span>)}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:'1rem' }}>
                    {[1,2,3,4,5].map(i=><Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}
                    <span style={{ fontSize:12, color:'var(--n-500)' }}>{c.rating} · {c.athletes} athletes</span>
                  </div>
                  <p style={{ fontSize:13, color:'var(--n-500)', lineHeight:1.6, marginBottom:'1.25rem' }}>{c.bio}</p>
                  <div style={{ height:1, background:'var(--n-100)', marginBottom:'1.25rem' }} />
                  <Link to="/signup" className="btn btn-dark btn-sm" style={{ textDecoration:'none', width:'100%', justifyContent:'center' }}>Train with {c.name.split(' ')[0]}</Link>
                </motion.div>
              ))}
            </div>
            <motion.div variants={fadeUp} style={{ textAlign:'center', marginTop:'2.5rem' }}>
              <Link to="/coaches" className="btn btn-ghost" style={{ textDecoration:'none' }}>Meet all 6 coaches <ChevronRight size={16} /></Link>
            </motion.div>
          </Section>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:'7rem 0' }}>
        <div className="container">
          <Section>
            <motion.div variants={fadeUp} style={{ textAlign:'center', marginBottom:'4.5rem' }}>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--b-600)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>How it works</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:600, color:'var(--n-900)', letterSpacing:'-.02em' }}>
                Up and running in <span className="gradient-text" style={{ fontStyle:'italic' }}>3 steps</span>
              </h2>
            </motion.div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2, maxWidth:860, margin:'0 auto', position:'relative' }}>
              <div style={{ position:'absolute', top:'2.5rem', left:'16.67%', right:'16.67%', height:1.5, background:'linear-gradient(90deg,var(--b-300),var(--c-400),var(--b-300))', pointerEvents:'none', zIndex:0 }} />
              {[
                { n:'01', title:'Pick sport & level',       desc:'Tell us your discipline, fitness level, and training goals.' },
                { n:'02', title:'Get matched with a coach', desc:'A specialist designs your custom training block.' },
                { n:'03', title:'Train, track & improve',   desc:'Follow your program and watch your metrics climb week by week.' },
              ].map((step,i)=>(
                <motion.div key={step.n} variants={fadeUp} style={{ padding:'0 2rem', textAlign:'center', position:'relative', zIndex:1 }}>
                  <div style={{ width:54, height:54, borderRadius:'50%', background:'linear-gradient(135deg,#1D4ED8,#3B82F6,#06B6D4)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem', fontFamily:'var(--font-display)', fontSize:18, fontWeight:600, color:'white', boxShadow:'0 8px 24px rgba(59,130,246,.35)', animation:`float ${3+i*.5}s ease-in-out infinite` }}>{step.n}</div>
                  <h3 style={{ fontSize:16, fontWeight:600, color:'var(--n-900)', marginBottom:10 }}>{step.title}</h3>
                  <p style={{ fontSize:14, color:'var(--n-500)', lineHeight:1.65 }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:'2rem 0 8rem' }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.6 }}
            style={{ borderRadius:'var(--r-2xl)', padding:'5rem 3rem', textAlign:'center', background:'linear-gradient(135deg, #1E40AF 0%, #2563EB 40%, #0891B2 100%)', position:'relative', overflow:'hidden', boxShadow:'0 20px 60px rgba(30,64,175,.4)' }}>
            <div style={{ position:'absolute', top:'20%', right:'10%', width:300, height:300, background:'radial-gradient(circle, rgba(255,255,255,.08) 0%, transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:'-10%', left:'5%', width:400, height:400, background:'radial-gradient(circle, rgba(6,182,212,.2) 0%, transparent 70%)', pointerEvents:'none' }} />
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:600, color:'white', letterSpacing:'-.02em', marginBottom:'1.25rem', position:'relative' }}>
              Ready to break your<br />
              <span style={{ background:'linear-gradient(135deg,#93C5FD,#67E8F9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontStyle:'italic' }}>personal best?</span>
            </h2>
            <p style={{ fontSize:17, color:'rgba(255,255,255,.7)', marginBottom:'2.5rem', maxWidth:500, margin:'0 auto 2.5rem', position:'relative' }}>
              Join 12,000 athletes already training smarter. No commitment required.
            </p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', position:'relative' }}>
              <Link to="/signup" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, padding:'14px 36px', borderRadius:100, background:'white', color:'var(--b-700)', fontSize:16, fontWeight:600, boxShadow:'0 4px 20px rgba(0,0,0,.15)', transition:'all .2s' }}
                onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-2px)')}
                onMouseLeave={e=>(e.currentTarget.style.transform='translateY(0)')}>
                Start for free <ArrowRight size={18} />
              </Link>
              <Link to="/programs" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, padding:'14px 36px', borderRadius:100, background:'rgba(255,255,255,.15)', color:'white', fontSize:16, fontWeight:600, border:'1px solid rgba(255,255,255,.3)', backdropFilter:'blur(8px)', transition:'all .2s' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,.22)')}
                onMouseLeave={e=>(e.currentTarget.style.background='rgba(255,255,255,.15)')}>
                Explore programs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:'1px solid var(--n-200)', padding:'3rem 0 2rem', background:'white' }}>
        <div className="container">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Zap size={14} color="white" fill="white" />
              </div>
              <span style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--n-900)', fontWeight:600 }}>
                Apex<span style={{ background:'linear-gradient(135deg,#2563EB,#06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontStyle:'italic' }}>Sport</span>
              </span>
            </div>
            <div style={{ display:'flex', gap:24 }}>
              {['Privacy','Terms','Contact','Support'].map(l=>(
                <span key={l} style={{ fontSize:13, color:'var(--n-400)', cursor:'pointer', transition:'color .2s' }}
                  onMouseEnter={e=>(e.currentTarget.style.color='var(--b-600)')}
                  onMouseLeave={e=>(e.currentTarget.style.color='var(--n-400)')}>{l}</span>
              ))}
            </div>
            <span style={{ fontSize:13, color:'var(--n-400)' }}>© 2026 ApexSport</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
