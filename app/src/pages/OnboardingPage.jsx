import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OnboardingPage.css'

const BUSINESS_TYPES = [
  { id: 'restaurant', icon: '🍜', label: 'Restaurant / F&B' },
  { id: 'retail', icon: '👗', label: 'Retail / Boutique' },
  { id: 'fitness', icon: '💪', label: 'Fitness / Gym' },
  { id: 'salon', icon: '✂️', label: 'Salon / Spa' },
  { id: 'grocery', icon: '🛒', label: 'Grocery / Kirana' },
  { id: 'education', icon: '📚', label: 'Education / Classes' },
  { id: 'medical', icon: '🏥', label: 'Medical / Clinic' },
  { id: 'other', icon: '🏬', label: 'Other Business' },
]

const GOALS = [
  { id: 'footfall', label: 'More walk-in customers', icon: '🚶' },
  { id: 'online', label: 'Online orders / DMs', icon: '📲' },
  { id: 'brand', label: 'Build local brand awareness', icon: '⭐' },
  { id: 'events', label: 'Promote events / offers', icon: '🎉' },
]

const SPEND_OPTIONS = [
  { id: '500', label: '₹500 / week', sub: '~₹71/day · Starter' },
  { id: '1000', label: '₹1,000 / week', sub: '~₹143/day · Popular', recommended: true },
  { id: '2000', label: '₹2,000 / week', sub: '~₹286/day · Growth' },
  { id: 'custom', label: 'Custom amount', sub: 'Set your own limit' },
]

const STEPS = [
  { id: 1, title: 'Business Type', icon: '🏪' },
  { id: 2, title: 'Your Goal', icon: '🎯' },
  { id: 3, title: 'Weekly Budget', icon: '💰' },
  { id: 4, title: 'Free Credit', icon: '🎁' },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [businessType, setBusinessType] = useState(null)
  const [businessName, setBusinessName] = useState('')
  const [city, setCity] = useState('')
  const [goal, setGoal] = useState(null)
  const [spend, setSpend] = useState('1000')
  const [phone, setPhone] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [launching, setLaunching] = useState(false)

  const progress = (step / 4) * 100

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
    else handleLaunch()
  }

  const handleLaunch = () => {
    setLaunching(true)
    setTimeout(() => navigate('/dashboard'), 2500)
  }

  const canNext = () => {
    if (step === 1) return businessType && businessName && city
    if (step === 2) return goal
    if (step === 3) return spend
    if (step === 4) return phone.length >= 10 && agreed
    return true
  }

  return (
    <div className="onboarding-page">
      {/* Left Panel */}
      <div className="onboarding-left">
        <div className="onboarding-brand">
          <button className="brand-logo" onClick={() => navigate('/')}>
            <span>🤖</span> SMBMate
          </button>
        </div>
        <div className="onboarding-steps">
          {STEPS.map((s) => (
            <div key={s.id} className={`onb-step ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}>
              <div className="onb-step-icon">
                {step > s.id ? '✓' : s.icon}
              </div>
              <div>
                <div className="onb-step-num">Step {s.id}</div>
                <div className="onb-step-label">{s.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="onboarding-trust">
          <div className="trust-item">
            <span>🔒</span>
            <span>Spend cap — never exceed your budget</span>
          </div>
          <div className="trust-item">
            <span>🎁</span>
            <span>₹500 free credit — no card needed</span>
          </div>
          <div className="trust-item">
            <span>💬</span>
            <span>Managed entirely via WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="onboarding-right">
        {/* Progress */}
        <div className="onb-progress-bar">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="onb-progress-text">{step} of 4</span>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="onb-step-content fade-up">
            <div className="onb-step-header">
              <span className="onb-step-emoji">🏪</span>
              <h1 className="onb-title">Tell us about your business</h1>
              <p className="onb-sub">We'll personalise your campaigns based on your business type.</p>
            </div>

            <div className="business-type-grid">
              {BUSINESS_TYPES.map((bt) => (
                <button
                  key={bt.id}
                  id={`btype-${bt.id}`}
                  className={`business-type-btn ${businessType === bt.id ? 'selected' : ''}`}
                  onClick={() => setBusinessType(bt.id)}
                >
                  <span className="bt-icon">{bt.icon}</span>
                  <span className="bt-label">{bt.label}</span>
                </button>
              ))}
            </div>

            <div className="onb-inputs">
              <div className="onb-input-group">
                <label className="onb-label">Business Name</label>
                <input
                  id="business-name-input"
                  className="onb-input"
                  placeholder="e.g. Sharma's Boutique"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="onb-input-group">
                <label className="onb-label">City</label>
                <input
                  id="city-input"
                  className="onb-input"
                  placeholder="e.g. Pune, Mumbai, Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="onb-step-content fade-up">
            <div className="onb-step-header">
              <span className="onb-step-emoji">🎯</span>
              <h1 className="onb-title">What's your main goal?</h1>
              <p className="onb-sub">We'll optimise your campaigns around this goal.</p>
            </div>
            <div className="goals-grid">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  id={`goal-${g.id}`}
                  className={`goal-btn ${goal === g.id ? 'selected' : ''}`}
                  onClick={() => setGoal(g.id)}
                >
                  <span className="goal-icon">{g.icon}</span>
                  <span className="goal-label">{g.label}</span>
                  {goal === g.id && <span className="goal-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="onb-step-content fade-up">
            <div className="onb-step-header">
              <span className="onb-step-emoji">💰</span>
              <h1 className="onb-title">Set your weekly spend cap</h1>
              <p className="onb-sub">
                This is a <strong style={{color: 'var(--accent)'}}>hard limit</strong> — the system will never 
                spend even one rupee more. Guaranteed.
              </p>
            </div>
            <div className="spend-options">
              {SPEND_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  id={`spend-${s.id}`}
                  className={`spend-option ${spend === s.id ? 'selected' : ''}`}
                  onClick={() => setSpend(s.id)}
                >
                  <div className="spend-option-left">
                    <span className="spend-label">{s.label}</span>
                    <span className="spend-sub">{s.sub}</span>
                  </div>
                  {s.recommended && <div className="spend-recommended">Most Popular</div>}
                  {spend === s.id && <span className="spend-check">✓</span>}
                </button>
              ))}
            </div>
            <div className="spend-guarantee">
              <span className="spend-guarantee-icon">🔒</span>
              <div>
                <strong>Spend Cap Guarantee</strong>
                <p>We will never exceed your selected budget. This is enforced at the technical level, not just a setting.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="onb-step-content fade-up">
            <div className="onb-step-header">
              <span className="onb-step-emoji">🎁</span>
              <h1 className="onb-title">Claim your ₹500 free credit</h1>
              <p className="onb-sub">
                No credit card. No hidden charges. Run your first campaign completely free.
              </p>
            </div>

            <div className="credit-banner">
              <div className="credit-amount">₹500</div>
              <div className="credit-label">Free Ad Credit</div>
              <div className="credit-sub">Added to your account instantly</div>
            </div>

            <div className="onb-inputs">
              <div className="onb-input-group">
                <label className="onb-label">WhatsApp Number</label>
                <div className="phone-input-wrap">
                  <span className="phone-prefix">+91</span>
                  <input
                    id="phone-input"
                    className="onb-input phone-input"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    type="tel"
                  />
                </div>
                <p className="onb-hint">We'll send your campaign updates here.</p>
              </div>
            </div>

            <label className="onb-agree" htmlFor="agree-check">
              <input 
                id="agree-check"
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>
                I agree to the terms. I understand my spend cap will never be exceeded and I can cancel anytime.
              </span>
            </label>
          </div>
        )}

        {/* Launching overlay */}
        {launching && (
          <div className="launching-overlay">
            <div className="launching-content">
              <div className="launching-spinner" />
              <h2 className="launching-title">Setting up your account...</h2>
              <p className="launching-sub">Creating your first campaign · Applying ₹500 credit</p>
              <div className="launching-steps">
                <div className="ls-item done">✓ Business profile created</div>
                <div className="ls-item done">✓ Spend cap set</div>
                <div className="ls-item active">⟳ Generating your first campaign...</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="onb-nav">
          {step > 1 && (
            <button id="onb-back" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
              ← Back
            </button>
          )}
          <button
            id="onb-next"
            className={`btn btn-primary onb-next-btn ${!canNext() ? 'disabled' : ''}`}
            onClick={handleNext}
            disabled={!canNext()}
          >
            {step === 4 ? '🚀 Launch My Free Campaign' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}
