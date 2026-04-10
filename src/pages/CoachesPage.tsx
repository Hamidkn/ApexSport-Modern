import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown, ArrowRight } from 'lucide-react';
import { coaches } from '../data';

export default function CoachesPage() {
  const [expanded, setExpanded] = useState<number|null>(null);
  return (
    <div style={{ background:'var(--page-bg)', minHeight:'100vh', paddingTop:100 }}>
      <div style={{ padding:'4rem 0 3rem', background:'white', borderBottom:'1px solid var(--n-200)' }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--b-600)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Expert coaches</div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:600, color:'var(--n-900)', letterSpacing:'-.02em', marginBottom:12 }}>
              Meet the <span className="gradient-text" style={{ fontStyle:'italic' }}>experts</span>
            </h1>
            <p style={{ fontSize:17, color:'var(--n-500)', maxWidth:520 }}>
              Every coach on ApexSport is a certified specialist with a proven track record.
            </p>
          </motion.div>
        </div>
      </div>
      <div className="container" style={{ paddingTop:'2.5rem', paddingBottom:'6rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:20 }}>
          {coaches.map((c,i)=>(
            <motion.div key={c.name} initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.08, duration:.5 }}
              className="card" style={{ padding:'1.75rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:'1.25rem' }}>
                <motion.div whileHover={{ scale:1.08 }} style={{ width:60, height:60, borderRadius:'50%', background:c.avatarBg, border:`2px solid ${c.avatarColor}44`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:20, fontWeight:600, color:c.avatarColor, flexShrink:0 }}>{c.initials}</motion.div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16, fontWeight:600, color:'var(--n-900)' }}>{c.name}</div>
                  <div style={{ fontSize:12, color:'var(--n-500)', marginTop:2 }}>{c.sport}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:3, justifyContent:'flex-end' }}>
                    <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    <span style={{ fontSize:13, fontWeight:600, color:'#92400E' }}>{c.rating}</span>
                  </div>
                  <div style={{ fontSize:11, color:'var(--n-400)', marginTop:2 }}>{c.athletes} athletes</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:'1.25rem' }}>
                {c.tags.map(t=><span key={t} style={{ fontSize:11, padding:'4px 10px', borderRadius:100, background:'var(--b-50)', border:'1px solid var(--b-100)', color:'var(--b-700)' }}>{t}</span>)}
              </div>
              <button onClick={()=>setExpanded(expanded===i?null:i)}
                style={{ width:'100%', background:'none', border:'none', cursor:'pointer', padding:'8px 0', display:'flex', alignItems:'center', justifyContent:'space-between', color:'var(--n-500)', fontSize:13, fontFamily:'var(--font-body)' }}>
                <span>About {c.name.split(' ')[0]}</span>
                <motion.div animate={{ rotate:expanded===i?180:0 }} transition={{ duration:.2 }}><ChevronDown size={16} /></motion.div>
              </button>
              <AnimatePresence>
                {expanded===i && (
                  <motion.p initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:.25 }}
                    style={{ fontSize:13, color:'var(--n-500)', lineHeight:1.65, overflow:'hidden', marginBottom:8 }}>{c.bio}</motion.p>
                )}
              </AnimatePresence>
              <div style={{ height:1, background:'var(--n-100)', margin:'1rem 0' }} />
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ textDecoration:'none', width:'100%', justifyContent:'center' }}>
                Train with {c.name.split(' ')[0]} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
