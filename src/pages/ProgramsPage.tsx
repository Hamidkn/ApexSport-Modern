import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { programs } from '../data';

type SportFilter = 'all' | 'running' | 'swimming' | 'cycling';
type LevelFilter = 'all' | 'amateur' | 'pro';

const sportLabels: Record<SportFilter, string> = { all: 'All Sports', running: '🏃 Running', swimming: '🏊 Swimming', cycling: '🚴 Cycling' };
const levelLabels: Record<LevelFilter, string> = { all: 'All Levels', amateur: 'Amateur', pro: 'Professional' };

export default function ProgramsPage() {
  const [sport, setSport]   = useState<SportFilter>('all');
  const [level, setLevel]   = useState<LevelFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = programs.filter(p => {
    if (sport !== 'all' && p.sport !== sport) return false;
    if (level !== 'all' && p.level !== level) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 100 }}>
      {/* Header */}
      <div style={{ padding: '4rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(24,201,138,.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--apex-bright)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Training programs</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, color: 'white', letterSpacing: '-.02em', marginBottom: 16 }}>
              Find your perfect <span style={{ fontStyle: 'italic', color: 'var(--apex-bright)' }}>program</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.5)', maxWidth: 540 }}>
              {programs.length} professional programs across running, swimming, and cycling — for every level.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }} style={{ marginBottom: '2.5rem' }}>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 380, marginBottom: '1.25rem' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.3)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search programs…"
              className="input-field"
              style={{ paddingLeft: 42, paddingRight: 16 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {(Object.keys(sportLabels) as SportFilter[]).map(s => (
              <button
                key={s}
                onClick={() => setSport(s)}
                style={{
                  padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'var(--font-body)', transition: 'all .2s',
                  background: sport === s ? 'var(--apex-bright)' : 'rgba(255,255,255,.06)',
                  color: sport === s ? 'var(--ink)' : 'rgba(255,255,255,.6)',
                  boxShadow: sport === s ? '0 4px 16px rgba(24,201,138,.3)' : 'none',
                  transform: sport === s ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                {sportLabels[s]}
              </button>
            ))}
            <div style={{ width: 1, height: 34, background: 'rgba(255,255,255,.1)', margin: '0 4px' }} />
            {(Object.keys(levelLabels) as LevelFilter[]).map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                style={{
                  padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .2s',
                  background: level === l ? 'rgba(167,139,250,.2)' : 'rgba(255,255,255,.06)',
                  color: level === l ? '#A78BFA' : 'rgba(255,255,255,.6)',
                  border: level === l ? '1px solid rgba(167,139,250,.35)' : '1px solid transparent',
                  transform: level === l ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                {levelLabels[l]}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,.3)' }}>
            {filtered.length} program{filtered.length !== 1 ? 's' : ''} found
          </div>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 20 }}>
            {filtered.map((p, i) => (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, scale: .92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: .88 }}
                transition={{ delay: i * .05, duration: .35 }}
                className="card"
                style={{ padding: '1.75rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                whileHover={{ y: -6, transition: { duration: .2 } }}
              >
                <div style={{ position: 'absolute', top: -20, right: -20, width: 160, height: 160, background: `radial-gradient(circle, ${p.bg}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `${p.bg}20`, border: `1px solid ${p.bg}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{p.icon}</div>
                  <span className={`badge ${p.level === 'pro' ? 'badge-purple' : 'badge-blue'}`}>{p.level === 'pro' ? 'Professional' : 'Amateur'}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 8 }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.65, marginBottom: '1.5rem' }}>{p.desc}</p>
                <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span>⏱</span> {p.weeks} weeks
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textTransform: 'capitalize' }}>
                    📍 {p.sport}
                  </span>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,.06)', marginBottom: '1.25rem' }} />
                <Link
                  to="/signup"
                  className="btn btn-dark btn-sm"
                  style={{ textDecoration: 'none', width: '100%', justifyContent: 'center', gap: 6 }}
                >
                  Enroll now <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 8 }}>No programs found</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,.4)' }}>Try adjusting your filters or search term.</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
