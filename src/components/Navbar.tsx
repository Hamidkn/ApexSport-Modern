import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { getUser, clearUser } from '../utils/auth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => setOpen(false), [location.pathname]);
  const signOut = () => { clearUser(); navigate('/'); };
  const links = [{ href: '/programs', label: 'Programs' }, { href: '/coaches', label: 'Coaches' }];
  return (
    <motion.header initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .55, ease: [.4,0,.2,1] }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 2rem', transition: 'all .3s ease',
        background: scrolled ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.6)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(59,130,246,.12)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(30,64,175,.07)' : 'none' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1D4ED8, #3B82F6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(59,130,246,.4)', animation: 'pulse-glow 3s ease infinite' }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--n-900)', fontWeight: 600, letterSpacing: '-.01em' }}>
            Apex<span style={{ background: 'linear-gradient(135deg,#2563EB,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>Sport</span>
          </span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {links.map(l => (
            <Link key={l.href} to={l.href}
              style={{ fontSize: 14, fontWeight: 600, color: location.pathname === l.href ? 'var(--b-600)' : 'var(--n-600)', textDecoration: 'none', transition: 'color .2s', position: 'relative' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--b-600)')}
              onMouseLeave={e => (e.currentTarget.style.color = location.pathname === l.href ? 'var(--b-600)' : 'var(--n-600)')}>
              {l.label}
              {location.pathname === l.href && <motion.div layoutId="ul" style={{ position: 'absolute', bottom: -4, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#2563EB,#06B6D4)', borderRadius: 2 }} />}
            </Link>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>Dashboard</Link>
              <button onClick={signOut} className="btn btn-primary btn-sm">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Get started →</Link>
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ background: 'rgba(255,255,255,.97)', borderTop: '1px solid rgba(59,130,246,.1)', padding: '1.25rem 2rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {links.map(l => <Link key={l.href} to={l.href} style={{ color: 'var(--n-700)', textDecoration: 'none', fontSize: 16, fontWeight: 500 }}>{l.label}</Link>)}
            {user ? <><Link to="/dashboard" style={{ color: 'var(--b-600)', textDecoration: 'none', fontSize: 16, fontWeight: 500 }}>Dashboard</Link><button onClick={signOut} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Sign out</button></>
                  : <><Link to="/login"  style={{ color: 'var(--n-600)', textDecoration: 'none', fontSize: 15 }}>Log in</Link><Link to="/signup" className="btn btn-primary" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>Get started</Link></>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
