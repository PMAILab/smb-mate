import { useState, useEffect } from 'react'
import './AddCampaignModal.css'

/* ─── Static data ─────────────────────────────────────────── */

const GOALS = [
  { id: 'customers',  icon: '👥', label: 'Get More Customers',   desc: 'Drive foot traffic and new enquiries' },
  { id: 'offer',      icon: '🎁', label: 'Promote an Offer',     desc: 'Flash sale, discount or seasonal deal' },
  { id: 'awareness',  icon: '📣', label: 'Build Awareness',      desc: 'Make more people know your business' },
  { id: 'products',   icon: '🛍️', label: 'Showcase Products',   desc: 'Highlight new arrivals or key items' },
  { id: 'events',     icon: '🎉', label: 'Promote an Event',     desc: 'Workshop, launch, or special occasion' },
  { id: 'retention',  icon: '❤️', label: 'Retain Customers',    desc: 'Bring back lapsed or loyal customers' },
]

const PLATFORMS = [
  { id: 'instagram', icon: '📸', label: 'Instagram', sub: 'Visual-first, great for fashion & food' },
  { id: 'facebook',  icon: '📘', label: 'Facebook',  sub: 'Widest reach across all demographics' },
  { id: 'both',      icon: '🚀', label: 'Both',      sub: 'Maximum reach (recommended)' },
]

const BUDGETS = [
  { value: 300,  label: '₹300/week',  sub: 'Try it out · ~2 leads',   tag: '' },
  { value: 500,  label: '₹500/week',  sub: 'Starter · ~4–6 leads',    tag: 'FREE with credit' },
  { value: 1000, label: '₹1,000/week', sub: 'Growth · ~10–15 leads',  tag: 'Most popular' },
  { value: 2000, label: '₹2,000/week', sub: 'Scale · ~25–35 leads',   tag: '' },
]

/* ─── AI copy generator (mock) ────────────────────────────── */
function generateAIContent(goal, businessName, city) {
  const biz = businessName || 'your business'
  const loc  = city        || 'your city'

  const templates = {
    customers:  {
      headline: `Discover ${biz} — Loved by locals in ${loc} 🌟`,
      body:     `Looking for quality you can trust? Visit ${biz} in ${loc} today. Trusted by hundreds of happy customers. Don't miss out!`,
      cta:      'Message Us',
      hashtags: '#local #shoplocal #quality',
    },
    offer: {
      headline: `🔥 Limited Time Offer at ${biz}!`,
      body:     `Don't miss our biggest sale of the season! Exclusive deals available for this week only at ${biz}, ${loc}. Tap to claim your offer.`,
      cta:      'Claim Offer',
      hashtags: '#sale #offer #deal',
    },
    awareness: {
      headline: `Meet ${biz} — ${loc}'s best-kept secret ✨`,
      body:     `We've been serving the people of ${loc} with heart. Find out why everyone is talking about ${biz}. Visit us or send a message!`,
      cta:      'Learn More',
      hashtags: `#${loc.toLowerCase()} #${biz.toLowerCase().replace(/\s+/g, '')}`,
    },
    products: {
      headline: `New Arrivals at ${biz} — You'll Love These! 🛍️`,
      body:     `Fresh collection just landed at ${biz}. Be the first to explore what's new. Limited stock — shop now before it's gone!`,
      cta:      'Shop Now',
      hashtags: '#newarrivals #newcollection #trending',
    },
    events: {
      headline: `🎉 You're Invited — Special Event at ${biz}!`,
      body:     `We're hosting something special at ${biz} in ${loc}. Join us for an exclusive experience. Reserve your spot — limited places available!`,
      cta:      'RSVP Now',
      hashtags: `#event #${loc.toLowerCase()} #special`,
    },
    retention: {
      headline: `We Miss You! Come Back to ${biz} 💚`,
      body:     `It's been a while! ${biz} has something special waiting for you. Come visit us again in ${loc} — you might just love what's new.`,
      cta:      'Visit Us Again',
      hashtags: `#loyalty #comeback #${loc.toLowerCase()}`,
    },
  }
  return templates[goal] || templates.customers
}

/* ─── Targeting generator ─────────────────────────────────── */
function generateTargeting(goal, city) {
  const loc = city || 'Your City'
  const targets = {
    customers:  { age: '25–45', gender: 'All', radius: `5 km from ${loc}`, interest: 'Local Shopping, Lifestyle' },
    offer:      { age: '18–40', gender: 'All', radius: `8 km from ${loc}`, interest: 'Deals, Discounts, Shopping' },
    awareness:  { age: '22–50', gender: 'All', radius: `10 km from ${loc}`, interest: 'Local Businesses, Community' },
    products:   { age: '20–40', gender: 'Women', radius: `5 km from ${loc}`, interest: 'Fashion, Shopping, Trends' },
    events:     { age: '20–45', gender: 'All', radius: `15 km from ${loc}`, interest: 'Events, Entertainment, Social' },
    retention:  { age: '25–50', gender: 'All', radius: `8 km from ${loc}`, interest: 'Brand Loyalty, Lifestyle' },
  }
  return targets[goal] || targets.customers
}

/* ─── Platform icon ───────────────────────────────────────── */
const platformIcon = { instagram: '📸', facebook: '📘', both: '🚀' }

/* ════════════════════════════════════════════════════════════
   Main Component
════════════════════════════════════════════════════════════ */
export default function AddCampaignModal({ open, onClose, onAdd, businessName, city }) {
  const [step, setStep]             = useState(1)
  const [goal, setGoal]             = useState('')
  const [platform, setPlatform]     = useState('both')
  const [aiContent, setAiContent]   = useState(null)
  const [generating, setGenerating] = useState(false)
  const [budget, setBudget]         = useState(500)
  const [campaignName, setCampaignName] = useState('')
  const [headline, setHeadline]     = useState('')
  const [body, setBody]             = useState('')
  const [cta, setCta]               = useState('')
  const [launching, setLaunching]   = useState(false)
  const [launchDone, setLaunchDone] = useState(false)

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(1); setGoal(''); setPlatform('both'); setAiContent(null)
      setGenerating(false); setBudget(500); setCampaignName('')
      setHeadline(''); setBody(''); setCta(''); setLaunching(false); setLaunchDone(false)
    }
  }, [open])

  if (!open) return null

  /* ── Step 1 → 2: generate AI copy ── */
  const handleGoalNext = () => {
    if (!goal) return
    const goalObj = GOALS.find(g => g.id === goal)
    setCampaignName(goalObj?.label || 'New Campaign')
    setStep(2)
    setGenerating(true)

    setTimeout(() => {
      const content = generateAIContent(goal, businessName, city)
      setAiContent(content)
      setHeadline(content.headline)
      setBody(content.body)
      setCta(content.cta)
      setGenerating(false)
    }, 1600)
  }

  /* ── Step 2 → 3 ── */
  const handleContentNext = () => {
    if (!headline.trim() || !body.trim()) return
    setStep(3)
  }

  /* ── Step 3 → Launch ── */
  const handleLaunch = () => {
    setLaunching(true)
    setTimeout(() => {
      setLaunchDone(true)
      const goalObj   = GOALS.find(g => g.id === goal)
      const platLabel = PLATFORMS.find(p => p.id === platform)?.label || platform
      const now       = new Date()
      const dateStr   = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

      const newCampaign = {
        id:            Date.now(),
        name:          campaignName,
        status:        'pending',
        platform:      `${platformIcon[platform] || '🚀'} ${platLabel}`,
        spend:         '—',
        reach:         '—',
        conversations: '—',
        cpc:           '—',
        started:       dateStr,
        image:         goalObj?.icon || '📣',
        ai_tip:        `AI has prepared your ${goalObj?.label} campaign · Budget ₹${budget}/week`,
        budget,
        goal,
        headline,
        body,
        cta,
      }

      setTimeout(() => {
        onAdd(newCampaign)
        onClose()
      }, 1400)
    }, 2000)
  }

  const targeting = goal ? generateTargeting(goal, city) : null

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="campaign-modal">

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon">✨</div>
            <div>
              <div className="modal-title">Create New Campaign</div>
              <div className="modal-sub">AI will write your ad copy in seconds</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Progress steps */}
        <div className="modal-progress">
          {['Goal & Platform', 'AI-Generated Copy', 'Budget & Launch'].map((label, i) => (
            <div key={i} className={`modal-step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="modal-step-circle">
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="modal-step-label">{label}</span>
              {i < 2 && <div className="modal-step-line" />}
            </div>
          ))}
        </div>

        {/* ══ STEP 1 ══ Goal + Platform */}
        {step === 1 && (
          <div className="modal-body fade-up">
            <div className="modal-section-title">What's the goal of this campaign?</div>
            <div className="goal-grid">
              {GOALS.map(g => (
                <button
                  key={g.id}
                  className={`goal-option ${goal === g.id ? 'selected' : ''}`}
                  onClick={() => setGoal(g.id)}
                  id={`goal-${g.id}`}
                >
                  <span className="goal-option-icon">{g.icon}</span>
                  <span className="goal-option-label">{g.label}</span>
                  <span className="goal-option-desc">{g.desc}</span>
                  {goal === g.id && <span className="goal-check">✓</span>}
                </button>
              ))}
            </div>

            <div className="modal-section-title" style={{ marginTop: '24px' }}>Which platform?</div>
            <div className="platform-row">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  className={`platform-option ${platform === p.id ? 'selected' : ''}`}
                  onClick={() => setPlatform(p.id)}
                  id={`platform-${p.id}`}
                >
                  <span className="platform-icon">{p.icon}</span>
                  <div>
                    <div className="platform-label">{p.label}</div>
                    <div className="platform-sub">{p.sub}</div>
                  </div>
                  {platform === p.id && <span className="platform-check">✓</span>}
                </button>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button
                id="btn-goal-next"
                className={`btn btn-primary ${!goal ? 'btn-disabled' : ''}`}
                onClick={handleGoalNext}
                disabled={!goal}
              >
                Generate AI Copy →
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 2 ══ AI Copy */}
        {step === 2 && (
          <div className="modal-body fade-up">
            {generating ? (
              <div className="ai-generating">
                <div className="ai-gen-spinner" />
                <div className="ai-gen-title">AI is writing your campaign copy…</div>
                <div className="ai-gen-steps">
                  <div className="ai-gen-step">✓ Analysing your business type</div>
                  <div className="ai-gen-step">✓ Researching {city || 'local'} audience</div>
                  <div className="ai-gen-step ai-gen-step-active">⟳ Generating ad copy &amp; targeting…</div>
                </div>
              </div>
            ) : (
              <>
                <div className="ai-copy-notice">
                  <span>🤖</span>
                  <span>AI wrote this copy for you based on your business. Edit anything before launching.</span>
                </div>

                {/* Editable copy */}
                <div className="copy-editor">
                  <div className="copy-field-group">
                    <label className="copy-field-label">
                      Ad Headline
                      <span className="copy-field-chars">{headline.length}/90</span>
                    </label>
                    <textarea
                      id="copy-headline"
                      className="copy-textarea headline-ta"
                      rows={2}
                      maxLength={90}
                      value={headline}
                      onChange={e => setHeadline(e.target.value)}
                    />
                  </div>

                  <div className="copy-field-group">
                    <label className="copy-field-label">
                      Ad Body Copy
                      <span className="copy-field-chars">{body.length}/280</span>
                    </label>
                    <textarea
                      id="copy-body"
                      className="copy-textarea body-ta"
                      rows={4}
                      maxLength={280}
                      value={body}
                      onChange={e => setBody(e.target.value)}
                    />
                  </div>

                  <div className="copy-row-2">
                    <div className="copy-field-group" style={{ flex: 1 }}>
                      <label className="copy-field-label">Call to Action</label>
                      <select
                        id="copy-cta"
                        className="copy-select"
                        value={cta}
                        onChange={e => setCta(e.target.value)}
                      >
                        {['Message Us', 'Shop Now', 'Learn More', 'Call Now',
                          'Claim Offer', 'Visit Us', 'RSVP Now', 'Get Quote'].map(o => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    <div className="copy-field-group" style={{ flex: 1 }}>
                      <label className="copy-field-label">Campaign Name</label>
                      <input
                        id="copy-campaign-name"
                        className="copy-input"
                        type="text"
                        value={campaignName}
                        onChange={e => setCampaignName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Targeting preview */}
                {targeting && (
                  <div className="targeting-preview">
                    <div className="targeting-title">🎯 AI-Suggested Targeting</div>
                    <div className="targeting-grid">
                      <div className="targeting-item">
                        <span className="targeting-lbl">Age</span>
                        <span className="targeting-val">{targeting.age}</span>
                      </div>
                      <div className="targeting-item">
                        <span className="targeting-lbl">Gender</span>
                        <span className="targeting-val">{targeting.gender}</span>
                      </div>
                      <div className="targeting-item">
                        <span className="targeting-lbl">Radius</span>
                        <span className="targeting-val">{targeting.radius}</span>
                      </div>
                      <div className="targeting-item">
                        <span className="targeting-lbl">Interests</span>
                        <span className="targeting-val">{targeting.interest}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ad Preview */}
                <div className="ad-preview-box">
                  <div className="ad-preview-title">📱 Ad Preview</div>
                  <div className="ad-preview-card">
                    <div className="ad-preview-header">
                      <div className="ad-preview-avatar">
                        {(businessName || 'B').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="ad-preview-bizname">{businessName || 'Your Business'}</div>
                        <div className="ad-preview-sponsored">Sponsored · {PLATFORMS.find(p => p.id === platform)?.label}</div>
                      </div>
                    </div>
                    <div className="ad-preview-img">
                      <span>{GOALS.find(g => g.id === goal)?.icon}</span>
                      <span className="ad-preview-img-label">AI-selected image</span>
                    </div>
                    <div className="ad-preview-body-copy">
                      <div className="ad-preview-headline">{headline}</div>
                      <div className="ad-preview-body-text">{body.slice(0, 80)}{body.length > 80 ? '…' : ''}</div>
                    </div>
                    <div className="ad-preview-cta-btn">{cta}</div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                  <button
                    id="btn-copy-next"
                    className="btn btn-primary"
                    onClick={handleContentNext}
                    disabled={!headline.trim() || !body.trim()}
                  >
                    Set Budget & Launch →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ STEP 3 ══ Budget + Launch */}
        {step === 3 && !launching && (
          <div className="modal-body fade-up">
            <div className="modal-section-title">Choose your weekly budget</div>

            <div className="budget-grid">
              {BUDGETS.map(b => (
                <button
                  key={b.value}
                  id={`budget-${b.value}`}
                  className={`budget-option ${budget === b.value ? 'selected' : ''}`}
                  onClick={() => setBudget(b.value)}
                >
                  {b.tag && <span className="budget-tag">{b.tag}</span>}
                  <span className="budget-amount">{b.label}</span>
                  <span className="budget-sub">{b.sub}</span>
                  {budget === b.value && <span className="budget-check">✓</span>}
                </button>
              ))}
            </div>

            {/* ROI estimate */}
            <div className="roi-estimate">
              <div className="roi-estimate-title">📊 Estimated Results for ₹{budget}/week</div>
              <div className="roi-estimate-row">
                <div className="roi-item">
                  <span className="roi-val">
                    {Math.round(budget * 8.5).toLocaleString('en-IN')}+
                  </span>
                  <span className="roi-lbl">People reached</span>
                </div>
                <div className="roi-divider" />
                <div className="roi-item">
                  <span className="roi-val">
                    {Math.round(budget / 500 * 5)}–{Math.round(budget / 500 * 10)}
                  </span>
                  <span className="roi-lbl">Conversations</span>
                </div>
                <div className="roi-divider" />
                <div className="roi-item">
                  <span className="roi-val">
                    ₹{Math.round(budget / (budget / 500 * 7))}
                  </span>
                  <span className="roi-lbl">Per conversation</span>
                </div>
              </div>
            </div>

            {/* Spend cap notice */}
            <div className="spend-cap-notice">
              <span>🔒</span>
              <span>
                Your weekly spend cap is <strong>₹{budget}</strong>. 
                We will <strong>never</strong> charge more than this — guaranteed.
              </span>
            </div>

            {/* Summary */}
            <div className="launch-summary">
              <div className="launch-summary-title">Campaign Summary</div>
              <div className="launch-summary-row">
                <span>Name</span><span>{campaignName}</span>
              </div>
              <div className="launch-summary-row">
                <span>Goal</span><span>{GOALS.find(g => g.id === goal)?.label}</span>
              </div>
              <div className="launch-summary-row">
                <span>Platform</span><span>{PLATFORMS.find(p => p.id === platform)?.label}</span>
              </div>
              <div className="launch-summary-row">
                <span>Budget</span><span>₹{budget}/week</span>
              </div>
              <div className="launch-summary-row">
                <span>CTA</span><span>{cta}</span>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
              <button id="btn-launch-campaign" className="btn btn-wa" onClick={handleLaunch}>
                🚀 Launch Campaign Now
              </button>
            </div>
          </div>
        )}

        {/* ══ LAUNCHING ══ */}
        {launching && (
          <div className="modal-body launching-modal fade-up">
            {!launchDone ? (
              <>
                <div className="launching-anim">
                  <div className="launching-ring" />
                  <div className="launching-rocket">🚀</div>
                </div>
                <div className="launching-title">Launching your campaign…</div>
                <div className="launching-checklist">
                  <div className="lc-item lc-done">✓ Ad copy finalised</div>
                  <div className="lc-item lc-done">✓ Targeting configured</div>
                  <div className="lc-item lc-active">⟳ Submitting to {PLATFORMS.find(p => p.id === platform)?.label}…</div>
                  <div className="lc-item">· Pending approval (usually &lt;1 hour)</div>
                </div>
              </>
            ) : (
              <>
                <div className="launch-success-icon">🎉</div>
                <div className="launch-success-title">Campaign Submitted!</div>
                <div className="launch-success-sub">
                  <strong>{campaignName}</strong> is now pending review.<br />
                  You'll receive a WhatsApp update once it goes live.
                </div>
                <div className="launch-success-detail">
                  📊 Your first daily report will arrive at <strong>9 PM</strong> today.
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
