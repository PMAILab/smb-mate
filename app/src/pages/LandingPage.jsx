import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './LandingPage.css'

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    business: 'Bloom Boutique, Pune',
    avatar: 'PS',
    avatarColor: '#7c3aed',
    text: 'I spent ₹500 and got 6 new customers in my first week. I couldn\'t believe it was this simple.',
    metric: '₹500 → 6 customers',
    metricLabel: 'First week results'
  },
  {
    name: 'Rajesh Nair',
    business: 'Spice Route Restaurant, Bengaluru',
    avatar: 'RN',
    avatarColor: '#0891b2',
    text: 'Weekday tables were always empty. Now they\'re filling up. I just reply to WhatsApp messages.',
    metric: '+43% weekday bookings',
    metricLabel: 'Month 2 results'
  },
  {
    name: 'Amit Patel',
    business: 'FitZone Gym, Mumbai',
    avatar: 'AP',
    avatarColor: '#d97706',
    text: 'Filled 12 new memberships in the first month. The AI writes all the content for me.',
    metric: '12 new members',
    metricLabel: 'First month'
  }
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Scan & Start',
    desc: 'Scan a QR code on your phone. Send "Hi" on WhatsApp. No app download. Takes 2 minutes.',
    icon: '📱'
  },
  {
    step: '02',
    title: 'Tell Us Your Business',
    desc: 'Answer 5 simple questions — by voice or text. Set your weekly budget and spend cap.',
    icon: '🎤'
  },
  {
    step: '03',
    title: 'AI Creates Your Ads',
    desc: 'We create professional campaigns automatically. You approve with a single tap.',
    icon: '✨'
  },
  {
    step: '04',
    title: 'See Results Daily',
    desc: 'Get a plain-language report at 9 PM: "₹500 spent → 6 people messaged you."',
    icon: '📊'
  }
]

const FEATURES = [
  {
    icon: '💬',
    label: 'WhatsApp-First',
    title: 'Works on WhatsApp',
    desc: 'No app to download. No dashboard to learn. Everything happens in WhatsApp — the app you already use.',
    highlight: 'Zero learning curve'
  },
  {
    icon: '🔒',
    label: 'Spend Cap Guarantee',
    title: 'Never Overspend',
    desc: 'Set a weekly budget. Our system makes it technically impossible to go even one rupee over. Guaranteed.',
    highlight: 'Hard limit enforced'
  },
  {
    icon: '📈',
    label: 'Plain-Language ROI',
    title: 'Simple Results',
    desc: 'Not CPM or CPC. Instead: "You spent ₹487. 2,847 people saw your ad. 6 messaged you. That\'s ₹81/chat."',
    highlight: 'In your language'
  },
  {
    icon: '🌙',
    label: 'Daily Reports',
    title: '9 PM WhatsApp Update',
    desc: 'Every evening: spend, reach, conversations, and one AI suggestion for tomorrow. One tap to approve.',
    highlight: '75% daily open rate'
  },
  {
    icon: '🎁',
    label: 'Free First Campaign',
    title: '₹500 Free Credit',
    desc: 'No credit card. No risk. See real results from a real campaign before you pay anything.',
    highlight: 'Zero upfront cost'
  },
  {
    icon: '🤖',
    label: 'AI Powered',
    title: 'Smart Targeting',
    desc: 'Our AI learns your business type and location to find customers who are most likely to visit.',
    highlight: '3x vs Boost Post'
  }
]

function WhatsAppMockup() {
  const [messages, setMessages] = useState([
    { id: 1, type: 'in', text: 'Hi', time: '9:01 AM' },
    { id: 2, type: 'out', text: '👋 Welcome to SMBMate! I\'m your AI marketing partner.\n\nWhat type of business do you run?', time: '9:01 AM' },
    { id: 3, type: 'in', text: 'I have a saree boutique in Pune', time: '9:02 AM' },
    { id: 4, type: 'out', text: '✨ Great! I\'ve set up a campaign for your boutique.\n\n📍 Targeting women aged 25-50 in Pune\n💰 Budget: ₹500/week\n📸 3 posts ready\n\nShall I launch? Reply:\n✅ YES to start\n✏️ EDIT to change something', time: '9:02 AM' },
  ])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, 
        { id: 5, type: 'in', text: 'YES', time: '9:03 AM' },
      ])
    }, 2000)
    const timer2 = setTimeout(() => {
      setMessages(prev => [...prev, 
        { id: 6, type: 'out', text: '🚀 Your campaign is live!\n\n📊 Today\'s report will arrive at 9 PM.\n\nYour ₹500 free credit is being used. You won\'t be charged anything today.', time: '9:03 AM' },
      ])
    }, 3500)
    return () => { clearTimeout(timer); clearTimeout(timer2) }
  }, [])

  return (
    <div className="wa-mockup-phone">
      <div className="wa-phone-header">
        <div className="wa-phone-header-left">
          <div className="wa-avatar-small">SM</div>
          <div>
            <div className="wa-contact-name">SMBMate AI</div>
            <div className="wa-contact-status">● Online</div>
          </div>
        </div>
        <div className="wa-phone-header-right">
          <span>📞</span>
          <span>⋮</span>
        </div>
      </div>
      <div className="wa-messages-area">
        {messages.map((msg, i) => (
          <div key={msg.id} className={`wa-msg-row wa-msg-${msg.type}`} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`wa-bubble-new wa-bubble-${msg.type}`}>
              <div className="wa-msg-text">{msg.text}</div>
              <div className="wa-msg-time">{msg.time} {msg.type === 'out' && '✓✓'}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="wa-input-area">
        <div className="wa-type-box">Type a message...</div>
        <div className="wa-send-btn">🎤</div>
      </div>
    </div>
  )
}

function StatCard({ number, label }) {
  return (
    <div className="stat-card">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="landing">
      <Navbar />

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg-glow" />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-left fade-up">
              <div className="badge badge-green hero-badge">
                <span className="badge-dot" />
                🇮🇳 Built for Indian SMBs · ₹500 Free to Start
              </div>
              <h1 className="hero-title">
                More Customers.<br />
                <span className="gradient-text">Zero Complexity.</span>
              </h1>
              <p className="hero-subtitle">
                Get professional digital marketing through WhatsApp. No apps, no dashboards, no jargon. 
                Just tell us your budget — we handle everything else.
              </p>

              <div className="hero-stats">
                <StatCard number="₹81" label="Avg. cost per customer" />
                <div className="stat-divider" />
                <StatCard number="2 min" label="Setup time" />
                <div className="stat-divider" />
                <StatCard number="3x" label="Better than Boost Post" />
              </div>

              <div className="hero-cta-group">
                <button id="hero-start-free" className="btn btn-wa" onClick={() => navigate('/onboarding')}>
                  <span>💬</span> Start Free on WhatsApp
                </button>
                <button id="hero-see-demo" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
                  See Live Demo →
                </button>
              </div>

              <p className="hero-footnote">
                ✓ No credit card &nbsp;·&nbsp; ✓ ₹500 free ad credit &nbsp;·&nbsp; ✓ Cancel anytime
              </p>
            </div>

            <div className="hero-right fade-up" style={{ animationDelay: '0.2s' }}>
              <WhatsAppMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <div className="proof-bar">
        <div className="container">
          <div className="proof-bar-inner">
            <span className="proof-text">Trusted by small businesses across India</span>
            <div className="proof-cities">
              {['Mumbai', 'Pune', 'Bengaluru', 'Delhi', 'Hyderabad', 'Chennai'].map(c => (
                <span key={c} className="proof-city">📍 {c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">HOW IT WORKS</span>
            <h2 className="section-title">From "Hi" to customers in 48 hours</h2>
            <p className="section-sub">The entire setup takes less time than making chai.</p>
          </div>
          <div className="steps-grid">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="step-card card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
          <div className="how-cta">
            <button id="how-get-started" className="btn btn-primary" onClick={() => navigate('/onboarding')}>
              Get Started — It's Free →
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">FEATURES</span>
            <h2 className="section-title">Everything a small business needs</h2>
            <p className="section-sub">Five features that solve your five biggest marketing problems.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-icon-wrap">
                  <span className="feature-icon">{f.icon}</span>
                </div>
                <div className="feature-label badge badge-green">{f.label}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
                <div className="feature-highlight">
                  <span>✓ {f.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">RESULTS</span>
            <h2 className="section-title">Real businesses. Real results.</h2>
          </div>
          <div className="testimonials-slider">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`testimonial-card card ${i === activeTestimonial ? 'active' : ''}`}>
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-metric">
                  <span className="testimonial-metric-number">{t.metric}</span>
                  <span className="testimonial-metric-label">{t.metricLabel}</span>
                </div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.avatarColor }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-business">{t.business}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-dots">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`dot ${i === activeTestimonial ? 'active' : ''}`} 
                      onClick={() => setActiveTestimonial(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="section pricing-teaser">
        <div className="container">
          <div className="pricing-teaser-card card">
            <div className="pricing-teaser-inner">
              <div>
                <span className="tag">PRICING</span>
                <h2 className="pricing-teaser-title">Starts at ₹999/month</h2>
                <p className="pricing-teaser-sub">Less than ₹33/day — cheaper than one newspaper ad. 
                  Your first campaign is completely free.</p>
              </div>
              <div className="pricing-teaser-actions">
                <button id="see-pricing" className="btn btn-primary" onClick={() => navigate('/pricing')}>
                  See All Plans →
                </button>
                <p className="pricing-teaser-note">₹500 free credit · No card needed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section final-cta-section">
        <div className="container">
          <div className="final-cta-card">
            <div className="final-cta-glow" />
            <div className="final-cta-content">
              <h2 className="final-cta-title">Ready to get more customers?</h2>
              <p className="final-cta-sub">Join hundreds of businesses already growing with SMBMate.</p>
              <button id="final-start" className="btn btn-wa" onClick={() => navigate('/onboarding')}>
                <span>💬</span> Start Free — No Card Required
              </button>
              <div className="final-cta-logos">
                <span>Works via</span>
                <span className="wa-logo-text">WhatsApp</span>
                <span>·</span>
                <span>Powered by</span>
                <span className="meta-logo-text">Meta Ads</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="footer-logo">SMBMate</span>
              <p className="footer-tagline">Your AI Marketing Partner</p>
            </div>
            <div className="footer-links">
              <button className="footer-link" onClick={() => navigate('/pricing')}>Pricing</button>
              <button className="footer-link" onClick={() => navigate('/dashboard')}>Demo</button>
              <button className="footer-link" onClick={() => navigate('/report')}>Daily Report</button>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 SMBMate. Built for India's small businesses.</p>
            <p>SMBMate — Product Management Prototype · Confidential</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
