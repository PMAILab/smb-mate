import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './PricingPage.css'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 999,
    period: 'month',
    tagline: 'Perfect to get started',
    color: '#22c55e',
    features: [
      '1 platform (Instagram or Facebook)',
      '10 posts/month (AI-generated)',
      'Basic AI targeting',
      '₹10,000 max weekly ad spend',
      'Daily WhatsApp reports',
      'Spend cap guarantee',
      '₹500 free credit to start',
    ],
    cta: 'Start Free',
    highlight: false
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 2499,
    period: 'month',
    tagline: 'Most popular for growing SMBs',
    color: '#f97316',
    features: [
      '2 platforms (Instagram + Facebook)',
      '30 posts/month (AI-generated)',
      'Advanced AI targeting + A/B testing',
      '₹50,000 max weekly ad spend',
      'Daily WhatsApp reports + weekly summary',
      'Smart auto-replies to customer messages',
      'One-tap campaign templates',
      '₹500 free credit to start',
    ],
    cta: 'Start Free',
    highlight: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 4999,
    period: 'month',
    tagline: 'For serious business growth',
    color: '#7c3aed',
    features: [
      'All platforms (Instagram, Facebook, YouTube)',
      'Unlimited posts + video content',
      'Priority AI targeting + custom audiences',
      'No weekly ad spend limit',
      'Real-time WhatsApp alerts',
      'Advanced auto-replies + chatbot',
      'Regional language support (8 languages)',
      'Dedicated account manager',
      '₹1,000 free credit to start',
    ],
    cta: 'Start Free',
    highlight: false
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 14999,
    period: 'month',
    tagline: 'Manage multiple businesses',
    color: '#0891b2',
    features: [
      'Up to 10 client businesses',
      'White-label reports and dashboard',
      'API access for integrations',
      'Dedicated account manager',
      'Custom onboarding for your clients',
      'Priority support (1-hour response)',
      'All Pro features included',
    ],
    cta: 'Contact Sales',
    highlight: false
  }
]

const FAQ = [
  {
    q: 'Do I need to give a credit card to start?',
    a: 'No. Your first campaign uses ₹500 in free ad credit. No credit card required until you decide to upgrade.'
  },
  {
    q: 'What happens if my campaign reaches my spend cap?',
    a: 'Your campaign automatically pauses. You will receive a WhatsApp notification and can choose to add more budget or let it wait for the next cycle. We never spend even ₹1 more than your cap.'
  },
  {
    q: 'Do I need to know anything about digital marketing?',
    a: 'Absolutely not. Our AI handles everything from creating the ad copy to running the campaigns. You only need to approve things via WhatsApp.'
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.'
  },
  {
    q: 'Which platforms does SMBMate support?',
    a: 'MVP V1 supports Instagram and Facebook. Google Ads and YouTube support is coming in V1.1 (June 2026).'
  },
  {
    q: 'What is the ₹500 free credit?',
    a: 'Every new account gets ₹500 in real ad credit — your actual ads run on Meta\'s platform. This is real money spent showing your business to real customers in your city.'
  }
]

export default function PricingPage() {
  const navigate = useNavigate()
  const [billing, setBilling] = useState('monthly')
  const [openFaq, setOpenFaq] = useState(null)

  const getPrice = (plan) => {
    if (billing === 'yearly') return Math.round(plan.price * 0.8)
    return plan.price
  }

  return (
    <div className="pricing-page">
      <Navbar />

      <div className="pricing-hero">
        <div className="pricing-hero-glow" />
        <div className="container pricing-hero-inner">
          <span className="tag">PRICING</span>
          <h1 className="pricing-title">
            Marketing that pays for itself
          </h1>
          <p className="pricing-sub">
            Start free. See results. Then decide. No contracts, no complexity.
          </p>

          {/* Billing Toggle */}
          <div className="billing-toggle">
            <button 
              id="billing-monthly"
              className={`billing-btn ${billing === 'monthly' ? 'active' : ''}`}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button 
              id="billing-yearly"
              className={`billing-btn ${billing === 'yearly' ? 'active' : ''}`}
              onClick={() => setBilling('yearly')}
            >
              Yearly
              <span className="save-badge">Save 20%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Plans */}
        <div className="plans-grid">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`plan-card card ${plan.highlight ? 'plan-featured' : ''}`}>
              {plan.highlight && (
                <div className="plan-popular-badge">⭐ Most Popular</div>
              )}
              <div className="plan-header" style={{ borderColor: plan.color + '30' }}>
                <div className="plan-name" style={{ color: plan.color }}>{plan.name}</div>
                <div className="plan-tagline">{plan.tagline}</div>
                <div className="plan-price-wrap">
                  <span className="plan-currency">₹</span>
                  <span className="plan-price">{getPrice(plan).toLocaleString()}</span>
                  <span className="plan-period">/{plan.period}</span>
                </div>
                {billing === 'yearly' && (
                  <div className="plan-savings">Save ₹{((plan.price - getPrice(plan)) * 12).toLocaleString()}/year</div>
                )}
              </div>

              <div className="plan-features">
                {plan.features.map((f, i) => (
                  <div key={i} className="plan-feature">
                    <span className="feature-check-icon" style={{ color: plan.color }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <button 
                id={`plan-cta-${plan.id}`}
                className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'} plan-cta-btn`}
                style={plan.highlight ? {} : { borderColor: plan.color, color: plan.color }}
                onClick={() => plan.id !== 'agency' ? navigate('/onboarding') : null}
              >
                {plan.cta} →
              </button>

              {plan.id !== 'agency' && (
                <p className="plan-note">₹500 free credit · No card required</p>
              )}
            </div>
          ))}
        </div>

        {/* Unit Economics */}
        <div className="unit-economics section">
          <div className="section-header">
            <span className="tag">WHY IT MAKES SENSE</span>
            <h2 className="section-title">The math is simple</h2>
          </div>
          <div className="math-grid">
            <div className="math-step card">
              <div className="math-emoji">💰</div>
              <div className="math-label">You pay</div>
              <div className="math-value">₹999/mo</div>
              <div className="math-sub">Less than ₹33/day</div>
            </div>
            <div className="math-arrow">→</div>
            <div className="math-step card">
              <div className="math-emoji">💬</div>
              <div className="math-label">Average result</div>
              <div className="math-value">~24 chats/mo</div>
              <div className="math-sub">From ₹4,000 in ads</div>
            </div>
            <div className="math-arrow">→</div>
            <div className="math-step card">
              <div className="math-emoji">🛍️</div>
              <div className="math-label">Even at 20% conversion</div>
              <div className="math-value">5 new customers</div>
              <div className="math-sub">Per month</div>
            </div>
            <div className="math-arrow">→</div>
            <div className="math-step card featured-math">
              <div className="math-emoji">📈</div>
              <div className="math-label">Average sale</div>
              <div className="math-value" style={{ color: 'var(--accent)' }}>₹1,500–₹3,000</div>
              <div className="math-sub" style={{ color: 'var(--accent)' }}>5x–15x ROI</div>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="guarantee-section">
          <div className="guarantee-card card">
            <div className="guarantee-inner">
              <div className="guarantee-icon">🔒</div>
              <div>
                <h3 className="guarantee-title">The SMBMate Guarantee</h3>
                <p className="guarantee-text">
                  We will never spend more than your spend cap. If we do — we refund the difference, 
                  no questions asked. This isn't a setting — it's an engineering-level hard limit.
                </p>
              </div>
              <button id="guarantee-start" className="btn btn-wa" onClick={() => navigate('/onboarding')}>
                <span>💬</span> Start for Free
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section section">
          <div className="section-header">
            <span className="tag">FAQ</span>
            <h2 className="section-title">Common questions</h2>
          </div>
          <div className="faq-list">
            {FAQ.map((faq, i) => (
              <div key={i} className={`faq-item card ${openFaq === i ? 'open' : ''}`}>
                <button 
                  id={`faq-${i}`}
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className="faq-chevron">{openFaq === i ? '↑' : '↓'}</span>
                </button>
                {openFaq === i && (
                  <div className="faq-answer fade-up">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bottom-cta">
          <h2 className="bottom-cta-title">Still not sure? Try it free.</h2>
          <p className="bottom-cta-sub">₹500 free credit. No card. 2-minute setup via WhatsApp.</p>
          <button id="bottom-start" className="btn btn-wa" onClick={() => navigate('/onboarding')}>
            <span>💬</span> Get Started Free →
          </button>
        </div>
      </div>
    </div>
  )
}
