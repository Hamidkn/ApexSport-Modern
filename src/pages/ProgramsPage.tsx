import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { programs } from '../data';

type SportFilter = 'all'|'running'|'swimming'|'cycling'|'fitness-men'|'fitness-women'|'prenatal'|'yoga'|'hiit'|'strength';
type LevelFilter = 'all'|'amateur'|'pro'|'all-levels';

const sportBtns: { id: SportFilter; label: string; icon: string }[] = [
  { id:'all',           label:'All Sports',     icon:'🏅' },
  { id:'running',       label:'Running',        icon:'🏃' },
  { id:'swimming',      label:'Swimming',       icon:'🏊' },
  { id:'cycling',       label:'Cycling',        icon:'🚴' },
  { id:'fitness-men',   label:'Men\'s Fitness', icon:'💪' },
  { id:'fitness-women', label:'Women\'s Fitness',icon:'💃' },
  { id:'prenatal',      label:'Prenatal',       icon:'🤰' },
  { id:'yoga',          label:'Yoga',           icon:'🧘' },
  { id:'hiit',          label:'HIIT',           icon:'⚡' },
  { id:'strength',      label:'Strength',       icon:'🏋️' },
];

const levelBadge = { amateur:'badge-blue', pro:'badge-purple', all:'badge-green' } as const;
const levelLabel = { amateur:'Amateur', pro:'Pro', all:'All levels' } as const;

export default function ProgramsPage() {
  const [sport, setSport] = useState<SportFilter>('all');
  const [level, setLevel] = useState<LevelFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = programs.filter(p => {
    if (sport !== 'all' && p.sport !== sport) return false;
    if (level === 'amateur' && p.level === 'pro') return false;
    if (level === 'pro'     && p.level !== 'pro') return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ background:'var(--page-bg)', minHeight:'100vh', paddingTop:100 }}>
      {/* Header */}
      <div style={{ padding:'4rem 0 3rem', background:'white', borderBottom:'1px solid var(--n-200)' }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--b-600)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Training programs</div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:600, color:'var(--n-900)', letterSpacing:'-.02em', marginBottom:12 }}>
              Find your perfect <span className="gradient-text" style={{ fontStyle:'italic' }}>program</span>
            </h1>
            <p style={{ fontSize:17, color:'var(--n-500)', maxWidth:520 }}>
              {programs.length} professional programs across {sportBtns.length - 1} disciplines — for every level and goal.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingTop:'2rem', paddingBottom:'6rem' }}>
        {/* Search */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }} style={{ marginBottom:'1.5rem' }}>
          <div style={{ position:'relative', maxWidth:380 }}>
            <Search size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--n-400)' }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search programs…" className="input-field" style={{ paddingLeft:42 }} />
          </div>
        </motion.div>

        {/* Sport filter */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25 }} style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'1rem' }}>
          {sportBtns.map(s=>(
            <button key={s.id} onClick={()=>setSport(s.id)}
              style={{ padding:'7px 16px', borderRadius:100, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', transition:'all .2s', display:'flex', alignItems:'center', gap:6,
                background: sport===s.id ? 'var(--b-600)' : 'white',
                color:       sport===s.id ? 'white'        : 'var(--n-600)',
                border:      sport===s.id ? '1px solid var(--b-600)' : '1px solid var(--n-200)',
                boxShadow:   sport===s.id ? '0 4px 14px rgba(37,99,235,.3)' : 'none',
              }}>
              <span>{s.icon}</span>{s.label}
            </button>
          ))}
        </motion.div>

        {/* Level filter */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }} style={{ display:'flex', gap:8, marginBottom:'1.5rem' }}>
          {(['all','amateur','pro'] as LevelFilter[]).map(l=>(
            <button key={l} onClick={()=>setLevel(l)}
              style={{ padding:'6px 16px', borderRadius:100, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', transition:'all .2s', textTransform:'capitalize',
                background: level===l ? 'var(--n-900)' : 'white',
                color:       level===l ? 'white'         : 'var(--n-600)',
                border:      level===l ? '1px solid var(--n-900)' : '1px solid var(--n-200)',
              }}>
              {l==='all'?'All Levels':l}
            </button>
          ))}
        </motion.div>

        <div style={{ fontSize:13, color:'var(--n-400)', marginBottom:'1.5rem' }}>
          {filtered.length} program{filtered.length!==1?'s':''} found
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))', gap:20 }}>
            {filtered.map((p,i)=>(
              <motion.div key={p.name} layout initial={{ opacity:0, scale:.93 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:.9 }} transition={{ delay:i*.04, duration:.3 }}
                className="card" style={{ padding:'1.75rem' }} whileHover={{ y:-5, transition:{ duration:.2 } }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:p.bg, border:'1px solid rgba(0,0,0,.07)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>{p.icon}</div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                    <span className={`badge ${levelBadge[p.level]}`}>{levelLabel[p.level]}</span>
                    {p.forWhom && <span style={{ fontSize:11, color:'var(--n-400)', fontWeight:500 }}>👤 {p.forWhom}</span>}
                  </div>
                </div>
                <h3 style={{ fontSize:16, fontWeight:600, color:'var(--n-900)', marginBottom:8 }}>{p.name}</h3>
                <p style={{ fontSize:13, color:'var(--n-500)', lineHeight:1.65, marginBottom:'1.25rem' }}>{p.desc}</p>
                <div style={{ display:'flex', gap:12, marginBottom:'1.25rem' }}>
                  <span style={{ fontSize:12, color:'var(--n-400)', display:'flex', alignItems:'center', gap:4 }}>⏱ {p.weeks} weeks</span>
                  <span style={{ fontSize:12, color:'var(--n-400)', textTransform:'capitalize' }}>📍 {p.category}</span>
                </div>
                <div style={{ height:1, background:'var(--n-100)', marginBottom:'1.25rem' }} />
                <Link to="/signup" className="btn btn-primary btn-sm" style={{ textDecoration:'none', width:'100%', justifyContent:'center', gap:6 }}>
                  Enroll now <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length===0 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center', padding:'5rem 0' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
            <div style={{ fontSize:18, fontWeight:600, color:'var(--n-700)', marginBottom:8 }}>No programs found</div>
            <div style={{ fontSize:14, color:'var(--n-400)' }}>Try adjusting your filters.</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
