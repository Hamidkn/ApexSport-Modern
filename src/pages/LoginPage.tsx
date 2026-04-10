import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight, AlertCircle } from 'lucide-react';
import { loginWithCredentials, saveUser, DEMO_USER } from '../utils/auth';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700)); // realistic delay
    const user = loginWithCredentials(email, password);
    setLoading(false);
    if (user) { saveUser(user); navigate('/dashboard'); }
    else setError('Incorrect email or password. Try the demo credentials below.');
  }

  function fillDemo() {
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
    setError('');
  }

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1rem 3rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 400, background: 'radial-gradient(ellipse, rgba(59,130,246,.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .5 }}
        style={{ width: '100%', maxWidth: 420, position: 'relative' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1151A6, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59,130,246,.35)' }}>
              <Zap size={18} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'white', fontWeight: 600 }}>
              Apex<span style={{ color: 'var(--#3B82F6', fontStyle: 'italic' }}>Sport</span>
            </span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'white', letterSpacing: '-.02em', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.45)' }}>Sign in to access your dashboard</p>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: '2.5rem' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 'var(--r-md)', padding: '12px 14px', fontSize: 13, color: '#FCA5A5' }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </motion.div>
            )}

            <div>
              <label className="input-label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="input-field"
                  style={{ paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.35)', padding: 4 }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: .98 }}
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '13px', position: 'relative', overflow: 'hidden' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: .8, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.4)', borderTopColor: 'white', borderRadius: '50%' }}
                  />
                  Signing in…
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Sign in <ArrowRight size={16} /></span>
              )}
            </motion.button>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,.35)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--#3B82F6', textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link>
            </p>
          </form>

          {/* Demo hint */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.4)', marginBottom: 3 }}>Demo account</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)' }}>{DEMO_USER.email} / {DEMO_USER.password}</div>
            </div>
            <button
              onClick={fillDemo}
              style={{ padding: '7px 14px', borderRadius: 100, background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.25)', color: 'var(--#3B82F6', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}
            >
              Fill demo
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
