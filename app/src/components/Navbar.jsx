import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar glass">
      <div className="container navbar-inner">
        {/* Logo */}
        <button className="navbar-logo" onClick={() => navigate('/')} id="nav-logo">
          <span className="logo-icon">🤖</span>
          <span className="logo-text">SMBMate</span>
        </button>

        {/* Nav Links */}
        <div className="navbar-links">
          <button id="nav-home" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => navigate('/')}>
            Home
          </button>
          <button id="nav-dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button id="nav-report" className={`nav-link ${isActive('/report') ? 'active' : ''}`} onClick={() => navigate('/report')}>
            Daily Report
          </button>
          <button id="nav-pricing" className={`nav-link ${isActive('/pricing') ? 'active' : ''}`} onClick={() => navigate('/pricing')}>
            Pricing
          </button>
        </div>

        {/* CTA */}
        <div className="navbar-cta">
          <button id="nav-demo" className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}>
            See Demo
          </button>
          <button id="nav-start" className="btn btn-primary btn-sm" onClick={() => navigate('/onboarding')}>
            Start Free →
          </button>
        </div>
      </div>
    </nav>
  )
}
