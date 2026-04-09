import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Star, ChevronRight, Zap, Shield, TrendingUp, Users } from 'lucide-react';
import { coaches, programs } from '../data';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: .12 } } };

function AnimatedSection({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={stagger}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

const sports = ['Running', 'Swimming', 'Cycling', 'Triathlon', 'Track & Field', 'Open Water', 'Road Racing', 'Trail Running'];
const stats = [
  { value: '240+', label: 'Training Programs', color: 'var(--apex-bright)' },
  { value: '48',   label: 'Expert Coaches',    color: '#60A5FA' },
  { value: '12k',  label: 'Active Athletes',   color: '#F59E0B' },
  { value: '94%',  label: 'Goal Achievement',  color: '#A78BFA' },
];
const features = [
  { icon: Zap,        title: 'AI-Matched Programs',  desc: 'Our algorithm pairs you with the perfect training plan based on your history, goals, and schedule.', color: 'var(--apex-bright)' },
  { icon: Users,      title: 'Elite Coaching',        desc: 'Every athlete is matched with a certified expert who checks in weekly and adapts your plan in real-time.', color: '#60A5FA' },
  { icon: TrendingUp, title: 'Data-Driven Progress',  desc: 'Track every metric that matters — pace, heart rate, load, and recovery — in one clean dashboard.', color: '#F59E0B' },
  { icon: Shield,     title: 'Injury Prevention',     desc: 'Smart load monitoring and built-in recovery weeks keep you training consistently, year-round.', color: '#A78BFA' },
];

export default function HomePage() {
  return (
    <div style={{ background: 'var(--ink)', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 100 }}>
        {/* Radial glow */}
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(24,201,138,.13) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Animated grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)' }} />

        <div className="container" style={{ position: 'relative', paddingTop: '4rem', paddingBottom: '5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, ease: [.4, 0, .2, 1] }}
            style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: .9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: .15, duration: .5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(24,201,138,.1)', border: '1px solid rgba(24,201,138,.25)', borderRadius: 100, padding: '6px 16px', marginBottom: '2rem' }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--apex-bright)', boxShadow: '0 0 8px var(--apex-bright)', animation: 'pulse-glow 2s ease infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--apex-bright)', letterSpacing: '.05em' }}>Individual Sports Training Platform</span>
            </motion.div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.02em', color: 'white', marginBottom: '1.5rem' }}>
              Train like a{' '}
              <span className="gradient-text" style={{ fontStyle: 'italic' }}>champion.</span>
              <br />
              <span style={{ color: 'rgba(255,255,255,.55)' }}>Perform without limits.</span>
            </h1>

            <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: 'rgba(255,255,255,.55)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 2.5rem' }}>
              Expert-built programs for runners, swimmers, and cyclists — personalised to your level, coached by the best, and tracked to the last metre.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 16, padding: '14px 32px' }}>
                Start training free <ArrowRight size={18} />
              </Link>
              <Link to="/programs" className="btn btn-ghost" style={{ textDecoration: 'none', fontSize: 16, padding: '14px 32px' }}>
                Browse programs
              </Link>
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: .6 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: '2.5rem' }}
            >
              <div style={{ display: 'flex' }}>
                {['#18C98A', '#60A5FA', '#F59E0B', '#A78BFA', '#F87171'].map((c, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: '2px solid var(--ink)', marginLeft: i ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
                    {['AL','MR','SC','JP','LB'][i]}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.55)' }}>4.9 · Loved by 12,000+ athletes</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginTop: '5rem', maxWidth: 860, margin: '5rem auto 0' }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .5 + i * .1, duration: .6 }}
                className="glass"
                style={{ padding: '1.5rem', borderRadius: 'var(--r-lg)', textAlign: 'center' }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '18px 0', background: 'rgba(255,255,255,.02)', overflow: 'hidden' }}>
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[...sports, ...sports].map((s, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, paddingRight: 40, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.35)', letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                <span style={{ color: 'var(--apex-bright)', fontSize: 8 }}>◆</span>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding: '8rem 0' }}>
        <div className="container">
          <AnimatedSection>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'inline-block', background: 'rgba(24,201,138,.08)', border: '1px solid rgba(24,201,138,.15)', borderRadius: 100, padding: '5px 14px', marginBottom: '1rem' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--apex-bright)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Why ApexSport</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: 'white', letterSpacing: '-.02em' }}>
                Everything you need to{' '}
                <span className="gradient-text" style={{ fontStyle: 'italic' }}>reach the top</span>
              </h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              {features.map(f => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  className="card"
                  style={{ padding: '2rem' }}
                  whileHover={{ y: -6, transition: { duration: .2 } }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}15`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <f.icon size={22} color={f.color} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.65 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FEATURED PROGRAMS ── */}
      <section style={{ padding: '2rem 0 8rem' }}>
        <div className="container">
          <AnimatedSection>
            <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--apex-bright)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Training programs</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 600, color: 'white', letterSpacing: '-.02em' }}>
                  Your sport, your pace
                </h2>
              </div>
              <Link to="/programs" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                View all programs <ChevronRight size={16} />
              </Link>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
              {programs.slice(0, 6).map((p) => (
                <motion.div
                  key={p.name}
                  variants={fadeUp}
                  className="card"
                  style={{ padding: '1.75rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                  whileHover={{ y: -5, transition: { duration: .2 } }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle, ${p.bg}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: `${p.bg}22`, border: `1px solid ${p.bg}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{p.icon}</div>
                    <span className={`badge ${p.level === 'pro' ? 'badge-purple' : 'badge-blue'}`}>{p.level === 'pro' ? 'Pro' : 'Amateur'}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 8 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.55, marginBottom: '1.25rem' }}>{p.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', fontWeight: 500 }}>⏱ {p.meta}</span>
                    <Link to="/signup" style={{ fontSize: 13, fontWeight: 600, color: 'var(--apex-bright)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, transition: 'gap .2s' }}
                      onMouseEnter={e => (e.currentTarget.style.gap = '8px')}
                      onMouseLeave={e => (e.currentTarget.style.gap = '4px')}>
                      Enroll <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── COACHES ── */}
      <section style={{ padding: '5rem 0 8rem', background: 'rgba(255,255,255,.02)', borderTop: '1px solid rgba(255,255,255,.05)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
        <div className="container">
          <AnimatedSection>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--apex-bright)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>World-class coaches</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 600, color: 'white', letterSpacing: '-.02em' }}>
                Train with the <span className="gradient-text" style={{ fontStyle: 'italic' }}>best</span>
              </h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
              {coaches.slice(0, 3).map(c => (
                <motion.div key={c.name} variants={fadeUp} className="card" style={{ padding: '1.75rem' }} whileHover={{ y: -5, transition: { duration: .2 } }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1rem' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${c.avatarBg}, ${c.avatarColor}22)`, border: `1px solid ${c.avatarColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: c.avatarColor }}>{c.initials}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 2 }}>{c.sport}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {c.tags.slice(0, 3).map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.6)' }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem' }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>{c.rating} · {c.athletes} athletes</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.6, marginBottom: '1.25rem' }}>{c.bio}</p>
                  <div style={{ height: 1, background: 'rgba(255,255,255,.07)', marginBottom: '1.25rem' }} />
                  <Link to="/signup" className="btn btn-dark btn-sm" style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}>
                    Train with {c.name.split(' ')[0]}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/coaches" className="btn btn-ghost" style={{ textDecoration: 'none' }}>Meet all 6 coaches <ChevronRight size={16} /></Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '8rem 0' }}>
        <div className="container">
          <AnimatedSection>
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--apex-bright)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>How it works</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 600, color: 'white', letterSpacing: '-.02em' }}>
                Up and running in <span className="gradient-text" style={{ fontStyle: 'italic' }}>3 steps</span>
              </h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, maxWidth: 860, margin: '0 auto', position: 'relative' }}>
              {/* connector line */}
              <div style={{ position: 'absolute', top: '2.5rem', left: '16.67%', right: '16.67%', height: 1, background: 'linear-gradient(90deg, rgba(24,201,138,.4), rgba(24,201,138,.15), rgba(24,201,138,.4))', pointerEvents: 'none', zIndex: 0 }} />
              {[
                { n: '01', title: 'Pick your sport & level', desc: 'Tell us your discipline, current fitness level, and what you want to achieve.' },
                { n: '02', title: 'Get matched with a coach', desc: 'We pair you with a specialist coach who designs your custom training block.' },
                { n: '03', title: 'Train, track & improve', desc: 'Follow your program, log every session, and watch your metrics improve week by week.' },
              ].map((step, i) => (
                <motion.div key={step.n} variants={fadeUp} style={{ padding: '0 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--apex-mid), var(--apex-bright))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'white', boxShadow: '0 0 30px rgba(24,201,138,.3)', animation: `float ${3 + i * .5}s ease-in-out infinite` }}>{step.n}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', lineHeight: 1.65 }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '2rem 0 8rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .6 }}
            style={{ borderRadius: 'var(--r-2xl)', padding: '5rem 3rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(13,107,82,.6) 0%, rgba(24,201,138,.15) 50%, rgba(13,107,82,.6) 100%)', border: '1px solid rgba(24,201,138,.2)', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(24,201,138,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, color: 'white', letterSpacing: '-.02em', marginBottom: '1.25rem' }}>
              Ready to break your<br />
              <span className="gradient-text" style={{ fontStyle: 'italic' }}>personal best?</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.55)', marginBottom: '2.5rem', maxWidth: 500, margin: '0 auto 2.5rem' }}>
              Join 12,000 athletes already training smarter. No commitment required.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 16, padding: '14px 36px' }}>
                Start for free <ArrowRight size={18} />
              </Link>
              <Link to="/programs" className="btn btn-ghost" style={{ textDecoration: 'none', fontSize: 16, padding: '14px 36px' }}>
                Explore programs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.07)', padding: '3rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #0D6B52, #18C98A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={14} color="white" fill="white" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'white', fontWeight: 600 }}>Apex<span style={{ color: 'var(--apex-bright)', fontStyle: 'italic' }}>Sport</span></span>
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {['Privacy', 'Terms', 'Contact', 'Support'].map(l => (
                <span key={l} style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', cursor: 'pointer' }}>{l}</span>
              ))}
            </div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.25)' }}>© 2026 ApexSport</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
