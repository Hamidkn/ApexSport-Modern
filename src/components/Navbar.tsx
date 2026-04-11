import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { getUser, clearUser } from '../utils/auth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const user     = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => setOpen(false), [location.pathname]);

  const signOut = () => { clearUser(); navigate('/'); };
  const links   = [{ href:'/programs', label:'Programs' }, { href:'/coaches', label:'Coaches' }];

  return (
    <motion.header
      initial={{ y:-80, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:.55, ease:[.4,0,.2,1] }}
      style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        transition:'all .3s ease',
        background: scrolled ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.7)',
        backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(59,130,246,.12)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(30,64,175,.07)' : 'none',
      }}
    >
      <div style={{ maxWidth:1100, margin:'0 auto', height:66, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2rem' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#1D4ED8,#3B82F6,#06B6D4)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(59,130,246,.4)', animation:'pulse-glow 3s ease infinite' }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontFamily:'var(--font-display)', fontSize:20, color:'var(--n-900)', fontWeight:600, letterSpacing:'-.01em' }}>
            Apex<span style={{ background:'linear-gradient(135deg,#2563EB,#06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontStyle:'italic' }}>Sport</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="nav-desktop-links" style={{ display:'flex', alignItems:'center', gap:'2.5rem' }}>
          {links.map(l => (
            <Link key={l.href} to={l.href}
              style={{ fontSize:14, fontWeight:600, color:location.pathname===l.href?'var(--b-600)':'var(--n-600)', textDecoration:'none', transition:'color .2s', position:'relative' }}
              onMouseEnter={e => (e.currentTarget.style.color='var(--b-600)')}
              onMouseLeave={e => (e.currentTarget.style.color=location.pathname===l.href?'var(--b-600)':'var(--n-600)')}>
              {l.label}
              {location.pathname===l.href && <motion.div layoutId="ul" style={{ position:'absolute', bottom:-4, left:0, right:0, height:2, background:'linear-gradient(90deg,#2563EB,#06B6D4)', borderRadius:2 }} />}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="nav-cta-group" style={{ display:'flex', alignItems:'center', gap:10 }}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ textDecoration:'none' }}>Dashboard</Link>
              <button onClick={signOut} className="btn btn-primary btn-sm">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn btn-ghost btn-sm" style={{ textDecoration:'none' }}>Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ textDecoration:'none' }}>Get started →</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn"
          onClick={() => setOpen(!open)}
          style={{ display:'none', background:'none', border:'none', cursor:'pointer', padding:6, color:'var(--n-700)', borderRadius:8, transition:'background .15s' }}
          onMouseEnter={e => (e.currentTarget.style.background='var(--b-50)')}
          onMouseLeave={e => (e.currentTarget.style.background='none')}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }}
            transition={{ duration:.25 }}
            style={{ overflow:'hidden', background:'rgba(255,255,255,.98)', borderTop:'1px solid rgba(59,130,246,.1)', boxShadow:'0 8px 30px rgba(30,64,175,.1)' }}
          >
            <div style={{ padding:'1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:4 }}>
              {links.map(l => (
                <Link key={l.href} to={l.href}
                  style={{ display:'block', padding:'12px 14px', borderRadius:10, fontSize:16, fontWeight:500, color:location.pathname===l.href?'var(--b-600)':'var(--n-700)', textDecoration:'none', background:location.pathname===l.href?'var(--b-50)':'transparent', transition:'all .15s' }}>
                  {l.label}
                </Link>
              ))}
              <div style={{ height:1, background:'var(--n-100)', margin:'8px 0' }} />
              {user ? (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <Link to="/dashboard" style={{ display:'block', padding:'12px 14px', borderRadius:10, fontSize:16, fontWeight:500, color:'var(--b-600)', textDecoration:'none', background:'var(--b-50)' }}>My Dashboard</Link>
                  <button onClick={signOut} className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}>Sign out</button>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <Link to="/login"  style={{ display:'block', padding:'12px 14px', borderRadius:10, fontSize:15, fontWeight:500, color:'var(--n-700)', textDecoration:'none' }}>Log in</Link>
                  <Link to="/signup" className="btn btn-primary" style={{ textDecoration:'none', width:'100%', justifyContent:'center' }}>Get started →</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
