import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoggedIn, logout } = useAuth()

  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const userMenuRef = useRef(null)

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const navLinks = isLoggedIn
    ? [
        { id: 'nav-dashboard', path: '/dashboard', label: 'Dashboard' },
        { id: 'nav-report', path: '/report', label: 'Daily Report' },
        { id: 'nav-pricing', path: '/pricing', label: 'Pricing' },
      ]
    : [
        { id: 'nav-home', path: '/', label: 'Home' },
        { id: 'nav-pricing', path: '/pricing', label: 'Pricing' },
      ]

  /** Initials avatar */
  const initials = user
    ? (user.name || user.email || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : ''

  return (
    <>
      <nav className={`navbar glass ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <button className="navbar-logo" onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')} id="nav-logo">
            <span className="logo-icon">🤖</span>
            <span className="logo-text">SMBMate</span>
          </button>

          {/* Nav Links — desktop */}
          <div className="navbar-links">
            {navLinks.map(l => (
              <button key={l.id} id={l.id}
                className={`nav-link ${isActive(l.path) ? 'active' : ''}`}
                onClick={() => navigate(l.path)}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="navbar-cta">
            {isLoggedIn ? (
              /* ── User avatar dropdown ── */
              <div className="user-menu-wrap" ref={userMenuRef}>
                <button
                  id="nav-user-avatar"
                  className={`user-avatar-btn ${userMenuOpen ? 'open' : ''}`}
                  onClick={() => setUserMenuOpen(o => !o)}
                  aria-label="User menu"
                >
                  <span className="avatar-initials">{initials}</span>
                  <div className="avatar-info">
                    <span className="avatar-name">{user.name || user.email}</span>
                    {user.businessName && <span className="avatar-biz">{user.businessName}</span>}
                  </div>
                  <span className={`avatar-chevron ${userMenuOpen ? 'up' : ''}`}>▾</span>
                </button>

                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-dropdown-avatar">{initials}</div>
                      <div>
                        <div className="user-dropdown-name">{user.name || 'User'}</div>
                        <div className="user-dropdown-email">{user.email || `+91 ${user.phone}`}</div>
                      </div>
                    </div>
                    {user.businessName && (
                      <div className="user-dropdown-biz">
                        🏪 {user.businessName} · {user.city}
                      </div>
                    )}
                    <div className="user-dropdown-credit">
                      🎁 ₹{user.credit || 500} free credit · {user.plan || 'Starter'} plan
                    </div>
                    <div className="user-dropdown-divider" />
                    <button id="nav-profile" className="user-dropdown-item" onClick={() => { navigate('/dashboard'); setUserMenuOpen(false) }}>
                      📊 Dashboard
                    </button>
                    <button id="nav-report-link" className="user-dropdown-item" onClick={() => { navigate('/report'); setUserMenuOpen(false) }}>
                      📑 Daily Report
                    </button>
                    <div className="user-dropdown-divider" />
                    <button id="nav-logout" className="user-dropdown-item logout" onClick={handleLogout}>
                      🚪 Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Guest CTAs ── */
              <>
                <button id="nav-login" className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>
                  Log In
                </button>
                <button id="nav-start" className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
                  Start Free →
                </button>
              </>
            )}
          </div>

          {/* Hamburger — mobile */}
          <button id="nav-hamburger"
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-inner">
          {isLoggedIn && (
            <div className="mobile-user-banner">
              <div className="mobile-user-avatar">{initials}</div>
              <div>
                <div className="mobile-user-name">{user.name || 'User'}</div>
                <div className="mobile-user-sub">{user.businessName || user.email}</div>
              </div>
            </div>
          )}

          {navLinks.map(l => (
            <button key={l.id}
              className={`mobile-nav-link ${isActive(l.path) ? 'active' : ''}`}
              onClick={() => navigate(l.path)}>
              {l.label}
            </button>
          ))}

          <div className="mobile-cta-group">
            {isLoggedIn ? (
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', color: '#f87171' }}
                onClick={handleLogout}>
                🚪 Log Out
              </button>
            ) : (
              <>
                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => navigate('/login')}>Log In</button>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => navigate('/login')}>Start Free →</button>
              </>
            )}
          </div>
        </div>
      </div>

      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  )
}
