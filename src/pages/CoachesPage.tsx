import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown, ArrowRight } from 'lucide-react';
import { coaches } from '../data';

export default function CoachesPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 100 }}>
      <div style={{ padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(96,165,250,.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--apex-bright)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Expert coaches</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, color: 'white', letterSpacing: '-.02em', marginBottom: 16 }}>
              Meet the <span style={{ fontStyle: 'italic', color: 'var(--apex-bright)' }}>experts</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.5)', maxWidth: 540 }}>
              Every coach on ApexSport is a certified specialist with a proven track record of transforming athletes.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {coaches.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * .08, duration: .5 }}
              className="card"
              style={{ padding: '1.75rem', overflow: 'hidden' }}
            >
              {/* Avatar + header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.25rem' }}>
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  style={{ width: 60, height: 60, borderRadius: '50%', background: `linear-gradient(135deg, ${c.avatarBg}88, ${c.avatarColor}44)`, border: `2px solid ${c.avatarColor}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: c.avatarColor, flexShrink: 0, cursor: 'default' }}>
                  {c.initials}
                </motion.div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{c.sport}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
                    <Star size={12} fill="#F59E0B" color="#F59E0B" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#F59E0B' }}>{c.rating}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{c.athletes} athletes</div>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {c.tags.map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 100, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.55)' }}>{t}</span>
                ))}
              </div>

              {/* Expandable bio */}
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgba(255,255,255,.5)', fontSize: 13, fontFamily: 'var(--font-body)', marginBottom: expanded === i ? 10 : 0 }}
              >
                <span>About {c.name.split(' ')[0]}</span>
                <motion.div animate={{ rotate: expanded === i ? 180 : 0 }} transition={{ duration: .2 }}>
                  <ChevronDown size={16} />
                </motion.div>
              </button>

              <AnimatePresence>
                {expanded === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: .25 }}
                    style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.65, overflow: 'hidden', marginBottom: 10 }}
                  >
                    {c.bio}
                  </motion.p>
                )}
              </AnimatePresence>

              <div style={{ height: 1, background: 'rgba(255,255,255,.07)', margin: '1.25rem 0' }} />
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}>
                Train with {c.name.split(' ')[0]} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
