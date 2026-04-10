import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { getUser, clearUser } from '../utils/auth';

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const user     = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  function signOut() { clearUser(); navigate('/'); }

  const links = [
    { href: '/programs', label: 'Programs' },
    { href: '/coaches',  label: 'Coaches'  },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: .6, ease: [.4,0,.2,1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem',
        transition: 'all .35s ease',
        background: scrolled ? 'rgba(2,11,24,.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(59,130,246,.12)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #1151A6, #3B82F6, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(59,130,246,.45)',
            animation: 'pulse-glow 3s ease infinite',
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'white', fontWeight: 600, letterSpacing: '-.01em' }}>
            Apex<span style={{ background: 'linear-gradient(135deg, #60A5FA, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>Sport</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {links.map(l => (
            <Link
              key={l.href} to={l.href}
              style={{ fontSize: 14, fontWeight: 500, color: location.pathname === l.href ? '#60A5FA' : 'rgba(255,255,255,.6)', textDecoration: 'none', transition: 'color .2s', position: 'relative' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = location.pathname === l.href ? '#60A5FA' : 'rgba(255,255,255,.6)')}
            >
              {l.label}
              {location.pathname === l.href && (
                <motion.div layoutId="nav-underline" style={{ position: 'absolute', bottom: -4, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #3B82F6, #06B6D4)', borderRadius: 2 }} />
              )}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>Dashboard</Link>
              <button onClick={signOut} className="btn btn-primary btn-sm">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                Get started <span style={{ fontSize: 16 }}>→</span>
              </Link>
            </>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'none', padding: 4 }} className="mobile-menu-btn">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: 'rgba(2,11,24,.97)', borderTop: '1px solid rgba(59,130,246,.15)', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {links.map(l => (
              <Link key={l.href} to={l.href} style={{ color: 'rgba(255,255,255,.8)', textDecoration: 'none', fontSize: 16, fontWeight: 500 }}>{l.label}</Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" style={{ color: '#60A5FA', textDecoration: 'none', fontSize: 16, fontWeight: 500 }}>Dashboard</Link>
                <button onClick={signOut} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login"  style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: 15 }}>Log in</Link>
                <Link to="/signup" className="btn btn-primary" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>Get started</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
