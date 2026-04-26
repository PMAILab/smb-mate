import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

/* ─────────────────────────────────────────────────────────── */

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, signup, loginWithGoogle, loginWithOTP, isRegistered } = useAuth()

  const [mode, setMode] = useState('login')  // 'login' | 'signup' | 'otp'
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')       // green helpful hint

  const [form, setForm] = useState({
    name: '', businessName: '', businessType: '', city: '',
    phone: '', email: '', password: '', otp: '',
  })

  const update = (field, val) => { setError(''); setHint(''); setForm(f => ({ ...f, [field]: val })) }

  const switchMode = (m) => { setMode(m); setStep(1); setError(''); setHint(''); setOtpSent(false) }

  /* ── Async wrapper ── */
  const withLoading = (fn) => async (...args) => {
    setLoading(true)
    setError('')
    try {
      await fn(...args)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  /* ── LOGIN ── */
  const handleLogin = withLoading(async (e) => {
    e.preventDefault()
    if (!form.email && !form.phone) throw new Error('Please enter your email or phone number.')
    if (!form.password) throw new Error('Please enter your password.')

    // Smart check: if this identifier isn't registered, nudge to sign up
    const identifier = form.email || form.phone
    if (!isRegistered(identifier)) {
      setHint('Looks like you don\'t have an account yet.')
      throw new Error('No account found. Please sign up first or check your email/phone.')
    }

    login({ email: form.email, phone: form.phone, password: form.password })
    navigate('/dashboard')
  })

  /* ── GOOGLE ── */
  const handleGoogle = withLoading(async () => {
    loginWithGoogle()
    // If Google user has no business, send to onboarding; else dashboard
    navigate('/dashboard')
  })

  /* ── OTP SEND ── */
  const handleSendOtp = () => {
    setError('')
    if (!form.phone || form.phone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid 10-digit phone number.')
      return
    }
    // Check if phone is registered
    if (!isRegistered(form.phone)) {
      setHint('No account with this number.')
      setError('This phone is not registered. Please sign up first.')
      return
    }
    setOtpSent(true)
    setHint('OTP sent! (Use any 6 digits for this demo)')
  }

  /* ── OTP VERIFY ── */
  const handleVerifyOtp = withLoading(async (e) => {
    e.preventDefault()
    if (!form.otp || form.otp.replace(/\D/g, '').length < 6) {
      throw new Error('Enter the 6-digit OTP sent to your WhatsApp.')
    }
    // In mock: any 6 digits accepted — real validation would happen server-side
    loginWithOTP(form.phone)
    navigate('/dashboard')
  })

  /* ── SIGNUP step 1 → 2 ── */
  const handleSignupNext = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim())  { setError('Please enter your name.'); return }
    if (form.phone.replace(/\D/g, '').length < 10) { setError('Enter a valid 10-digit phone number.'); return }
    if (!form.email.includes('@')) { setError('Enter a valid email address.'); return }
    if (form.password.length < 6)  { setError('Password must be at least 6 characters.'); return }

    // Warn if already registered
    if (isRegistered(form.email)) {
      setHint('You already have an account with this email.')
      setError('This email is already registered. Please log in instead.')
      return
    }
    if (isRegistered(form.phone)) {
      setError('This phone number is already registered. Please log in instead.')
      return
    }
    setStep(2)
  }

  /* ── SIGNUP step 2 → create account ── */
  const handleSignupSubmit = withLoading(async (e) => {
    e.preventDefault()
    if (!form.businessName.trim()) throw new Error('Enter your business name.')
    if (!form.businessType)        throw new Error('Select a business type.')
    if (!form.city)                throw new Error('Select your city.')

    signup({
      name: form.name, email: form.email, phone: form.phone, password: form.password,
      businessName: form.businessName, businessType: form.businessType, city: form.city,
    })
    navigate('/onboarding')
  })

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="login-page">
      <div className="login-glow login-glow-1" />
      <div className="login-glow login-glow-2" />

      {/* Header */}
      <header className="login-header">
        <button className="login-logo-btn" onClick={() => navigate('/')} id="login-logo">
          <span className="login-logo-icon">🤖</span>
          <span className="login-logo-text">SMBMate</span>
        </button>
        <span className="login-header-sub">AI Marketing for Indian SMBs</span>
      </header>

      <div className="login-center">

        {/* ── Brand panel ── */}
        <div className="login-brand-panel">
          <div className="brand-panel-content">
            <div className="brand-badge badge badge-green">
              <span className="badge-dot-pulse" />
              ₹500 Free Credit · No Card Needed
            </div>
            <h2 className="brand-headline">
              More customers.<br />
              <span className="gradient-text">Zero complexity.</span>
            </h2>
            <p className="brand-sub">
              Join 1,200+ Indian small businesses already growing with WhatsApp-first AI marketing.
            </p>
            <div className="brand-stats">
              <div className="brand-stat"><span className="brand-stat-num">₹81</span><span className="brand-stat-lbl">Avg. cost per customer</span></div>
              <div className="brand-stat-divider" />
              <div className="brand-stat"><span className="brand-stat-num">3x</span><span className="brand-stat-lbl">Better than Boost Post</span></div>
              <div className="brand-stat-divider" />
              <div className="brand-stat"><span className="brand-stat-num">2 min</span><span className="brand-stat-lbl">Setup time</span></div>
            </div>
            <div className="brand-testimonial">
              <div className="brand-testimonial-text">"I spent ₹500 and got 6 new customers in my first week."</div>
              <div className="brand-testimonial-author">
                <div className="brand-avatar" style={{ background: '#7c3aed' }}>PS</div>
                <div>
                  <div className="brand-auth-name">Priya Sharma</div>
                  <div className="brand-auth-biz">Bloom Boutique, Pune</div>
                </div>
              </div>
            </div>
            <div className="brand-trust">
              <span>Works via</span><span className="trust-wa">WhatsApp</span>
              <span>·</span><span>Powered by</span><span className="trust-meta">Meta Ads</span>
            </div>
          </div>
        </div>

        {/* ── Auth card ── */}
        <div className="login-card-wrap">
          <div className="login-card glass">

            {/* Tabs */}
            {mode !== 'otp' && (
              <div className="login-tabs">
                <button id="tab-login" className={`login-tab ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => switchMode('login')}>Log In</button>
                <button id="tab-signup" className={`login-tab ${mode === 'signup' ? 'active' : ''}`}
                  onClick={() => switchMode('signup')}>Sign Up</button>
              </div>
            )}

            {/* ══════════════════ LOGIN ══════════════════ */}
            {mode === 'login' && (
              <div className="login-form-wrap fade-up" key="login">
                <div className="login-form-header">
                  <h1 className="login-form-title">Welcome back 👋</h1>
                  <p className="login-form-sub">Log in to your SMBMate dashboard</p>
                </div>

                <button id="btn-google-login" className="social-btn" onClick={handleGoogle} disabled={loading}>
                  <GoogleIcon />
                  Continue with Google
                </button>

                <div className="login-divider"><span>or log in with email</span></div>

                {error && (
                  <div className="auth-error">
                    {error}
                    {hint && (
                      <button className="auth-error-action" onClick={() => switchMode('signup')}>
                        Sign up instead →
                      </button>
                    )}
                  </div>
                )}

                <form onSubmit={handleLogin} className="login-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="login-email">Email or Phone</label>
                    <input id="login-email" className="form-input" type="text"
                      placeholder="priya@boutique.com or 9876543210"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      autoComplete="email" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="login-password">
                      Password
                      <button type="button" className="form-label-link"
                        onClick={() => switchMode('otp')}>
                        Forgot? Use OTP →
                      </button>
                    </label>
                    <input id="login-password" className="form-input" type="password"
                      placeholder="Your password"
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      autoComplete="current-password" />
                  </div>
                  <button id="btn-login-submit" type="submit"
                    className={`btn btn-primary login-submit-btn ${loading ? 'loading' : ''}`}
                    disabled={loading}>
                    {loading ? <span className="spinner" /> : 'Log In →'}
                  </button>
                </form>

                <button id="btn-otp-login" className="btn btn-ghost login-otp-alt-btn"
                  onClick={() => switchMode('otp')}>
                  💬 Login with WhatsApp OTP instead
                </button>

                <p className="login-switch">
                  No account?{' '}
                  <button className="form-label-link" onClick={() => switchMode('signup')}>Sign up free →</button>
                </p>
              </div>
            )}

            {/* ══════════════════ OTP ══════════════════ */}
            {mode === 'otp' && (
              <div className="login-form-wrap fade-up" key="otp">
                <div className="login-form-header">
                  <button className="form-label-link otp-back-btn" onClick={() => switchMode('login')}>
                    ← Back to login
                  </button>
                  <h1 className="login-form-title" style={{ marginTop: '10px' }}>
                    {otpSent ? 'Enter OTP 🔐' : 'WhatsApp OTP 💬'}
                  </h1>
                  <p className="login-form-sub">
                    {otpSent
                      ? `Enter the 6-digit code sent to +91 ${form.phone}`
                      : "Enter your registered phone number to receive an OTP."}
                  </p>
                </div>

                {error && (
                  <div className="auth-error">
                    {error}
                    {hint && (
                      <button className="auth-error-action" onClick={() => switchMode('signup')}>
                        Sign up instead →
                      </button>
                    )}
                  </div>
                )}
                {!error && hint && <div className="auth-hint">{hint}</div>}

                {!otpSent ? (
                  <div className="otp-phone-step">
                    <div className="form-group">
                      <label className="form-label" htmlFor="otp-phone">Phone Number (WhatsApp)</label>
                      <div className="phone-input-wrap">
                        <span className="phone-prefix">🇮🇳 +91</span>
                        <input id="otp-phone" className="form-input phone-input" type="tel"
                          placeholder="9876543210" maxLength={10}
                          value={form.phone}
                          onChange={e => update('phone', e.target.value)} />
                      </div>
                    </div>
                    <button id="btn-send-otp" className="btn btn-wa login-submit-btn"
                      onClick={handleSendOtp} disabled={loading}>
                      💬 Send WhatsApp OTP
                    </button>
                    <p className="login-switch" style={{ marginTop: '12px' }}>
                      Not registered?{' '}
                      <button className="form-label-link" onClick={() => switchMode('signup')}>
                        Sign up free →
                      </button>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="login-form">
                    <div className="form-group">
                      <label className="form-label" htmlFor="otp-code">
                        6-Digit OTP
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 400 }}>
                          (any 6 digits in demo)
                        </span>
                      </label>
                      <input id="otp-code" className="form-input otp-input" type="text"
                        placeholder="• • • • • •" maxLength={6} autoFocus
                        value={form.otp} onChange={e => update('otp', e.target.value)} />
                    </div>
                    <button id="btn-verify-otp" type="submit"
                      className={`btn btn-primary login-submit-btn ${loading ? 'loading' : ''}`}
                      disabled={loading}>
                      {loading ? <span className="spinner" /> : 'Verify & Login →'}
                    </button>
                    <button type="button" className="resend-otp-btn"
                      onClick={() => { setOtpSent(false); setError(''); setHint('') }}>
                      ← Change number / Resend OTP
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ══════════════════ SIGN UP ══════════════════ */}
            {mode === 'signup' && (
              <div className="login-form-wrap fade-up" key="signup">
                {/* Progress */}
                <div className="signup-progress">
                  <div className={`signup-step ${step >= 1 ? 'done' : ''}`}>
                    <span>{step > 1 ? '✓' : '1'}</span> Your Info
                  </div>
                  <div className="signup-step-line" />
                  <div className={`signup-step ${step >= 2 ? 'done' : ''}`}>
                    <span>2</span> Business
                  </div>
                </div>

                {step === 1 && (
                  <div className="login-form-header">
                    <h1 className="login-form-title">Create account 🚀</h1>
                    <p className="login-form-sub">Start with ₹500 free ad credit. No card needed.</p>
                  </div>
                )}

                {step === 1 && (
                  <>
                    <button id="btn-google-signup" className="social-btn"
                      onClick={handleGoogle} disabled={loading}>
                      <GoogleIcon /> Sign up with Google
                    </button>
                    <div className="login-divider"><span>or sign up with email</span></div>
                  </>
                )}

                {error && (
                  <div className="auth-error">
                    {error}
                    {hint && (
                      <button className="auth-error-action" onClick={() => switchMode('login')}>
                        Log in instead →
                      </button>
                    )}
                  </div>
                )}

                {/* Step 1 */}
                {step === 1 && (
                  <form onSubmit={handleSignupNext} className="login-form">
                    <div className="form-group">
                      <label className="form-label" htmlFor="su-name">Your Name</label>
                      <input id="su-name" className="form-input" type="text"
                        placeholder="Priya Sharma" autoComplete="name"
                        value={form.name} onChange={e => update('name', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="su-phone">Phone (WhatsApp)</label>
                      <div className="phone-input-wrap">
                        <span className="phone-prefix">🇮🇳 +91</span>
                        <input id="su-phone" className="form-input phone-input" type="tel"
                          placeholder="9876543210" maxLength={10} autoComplete="tel"
                          value={form.phone} onChange={e => update('phone', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="su-email">Email</label>
                      <input id="su-email" className="form-input" type="email"
                        placeholder="priya@boutique.com" autoComplete="email"
                        value={form.email} onChange={e => update('email', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="su-password">Create Password</label>
                      <input id="su-password" className="form-input" type="password"
                        placeholder="Min 6 characters" autoComplete="new-password"
                        value={form.password} onChange={e => update('password', e.target.value)} />
                    </div>
                    <button id="btn-signup-next" type="submit"
                      className={`btn btn-primary login-submit-btn ${loading ? 'loading' : ''}`}
                      disabled={loading}>
                      Continue →
                    </button>
                  </form>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <form onSubmit={handleSignupSubmit} className="login-form">
                    <div className="login-form-header" style={{ marginBottom: '16px' }}>
                      <h1 className="login-form-title">Your Business 🏪</h1>
                      <p className="login-form-sub">
                        Help us personalise your campaigns, {form.name.split(' ')[0]}.
                      </p>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="su-biz">Business Name</label>
                      <input id="su-biz" className="form-input" type="text"
                        placeholder="e.g. Priya's Boutique"
                        value={form.businessName} onChange={e => update('businessName', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="su-type">Business Type</label>
                      <select id="su-type" className="form-input form-select"
                        value={form.businessType} onChange={e => update('businessType', e.target.value)}>
                        <option value="">Select category…</option>
                        <option>Clothing &amp; Fashion</option>
                        <option>Restaurant / Food</option>
                        <option>Salon &amp; Beauty</option>
                        <option>Gym &amp; Fitness</option>
                        <option>Grocery / Kirana</option>
                        <option>Electronics</option>
                        <option>Jewellery</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="su-city">City</label>
                      <select id="su-city" className="form-input form-select"
                        value={form.city} onChange={e => update('city', e.target.value)}>
                        <option value="">Select city…</option>
                        <option>Mumbai</option>
                        <option>Pune</option>
                        <option>Bengaluru</option>
                        <option>Delhi / NCR</option>
                        <option>Hyderabad</option>
                        <option>Chennai</option>
                        <option>Ahmedabad</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="signup-credit-notice">
                      <span>🎁</span>
                      <span>You'll receive <strong>₹500 free ad credit</strong> immediately — no card required.</span>
                    </div>

                    <button id="btn-signup-submit" type="submit"
                      className={`btn btn-primary login-submit-btn ${loading ? 'loading' : ''}`}
                      disabled={loading}>
                      {loading
                        ? <span className="spinner" />
                        : '🚀 Create Account & Get ₹500'}
                    </button>
                  </form>
                )}

                {step === 1 && (
                  <p className="login-switch">
                    Already have an account?{' '}
                    <button className="form-label-link" onClick={() => switchMode('login')}>Log in →</button>
                  </p>
                )}
                {step === 2 && (
                  <button className="form-label-link back-step-btn"
                    onClick={() => { setStep(1); setError(''); setHint('') }}>
                    ← Back
                  </button>
                )}

                <p className="login-tos">
                  By signing up you agree to our <span className="form-label-link">Terms</span> &amp;{' '}
                  <span className="form-label-link">Privacy Policy</span>.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
