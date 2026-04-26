import { useState, useEffect } from 'react'
import './CampaignDrawer.css'

const STATUS_META = {
  active:  { color: '#22c55e', label: '● Live',         bg: 'rgba(34,197,94,0.1)'   },
  pending: { color: '#f97316', label: '⟳ Pending Approval', bg: 'rgba(249,115,22,0.1)' },
  paused:  { color: '#6b7280', label: '⏸ Paused',       bg: 'rgba(107,114,128,0.1)' },
  draft:   { color: '#6b7280', label: '✏️ Draft',        bg: 'rgba(107,114,128,0.1)' },
}

/* Fake day-by-day reach data for the sparkline */
function generateSparkData(spend) {
  if (!spend || spend === '—') return []
  const base = parseInt(spend.replace(/[^\d]/g, '')) || 0
  return Array.from({ length: 7 }, (_, i) =>
    Math.round(base * (0.6 + Math.random() * 0.8) * (i / 4 + 0.5))
  )
}

/* Mini SVG sparkline */
function Sparkline({ data }) {
  if (!data.length) return null
  const max = Math.max(...data, 1)
  const w = 160, h = 48, pad = 4
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - 2 * pad)
    const y = h - pad - (v / max) * (h - 2 * pad)
    return `${x},${y}`
  })
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - 2 * pad)
        const y = h - pad - (v / max) * (h - 2 * pad)
        return <circle key={i} cx={x} cy={y} r="3" fill="var(--accent)" />
      })}
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════
   Campaign Drawer
════════════════════════════════════════════════════════════ */
export default function CampaignDrawer({ campaign, onClose, onAction }) {
  const [confirmAction, setConfirmAction] = useState(null) // 'approve' | 'pause' | 'resume' | 'delete'
  const [done, setDone]                   = useState(false)
  const [actionLabel, setActionLabel]     = useState('')

  useEffect(() => {
    if (campaign) { setConfirmAction(null); setDone(false); setActionLabel('') }
  }, [campaign?.id])

  // Lock body scroll when open
  useEffect(() => {
    if (campaign) document.body.style.overflow = 'hidden'
    else          document.body.style.overflow  = ''
    return () => { document.body.style.overflow = '' }
  }, [campaign])

  if (!campaign) return null

  const meta       = STATUS_META[campaign.status] || STATUS_META.draft
  const sparkData  = generateSparkData(campaign.spend)
  const isActive   = campaign.status === 'active'
  const isPending  = campaign.status === 'pending'
  const isPaused   = campaign.status === 'paused'
  const isDraft    = campaign.status === 'draft'

  const runAction = (type) => {
    const labels = {
      approve: 'Campaign approved and is now live! 🚀',
      pause:   'Campaign paused. You can resume any time.',
      resume:  'Campaign resumed and is now live! ✅',
      delete:  'Campaign deleted.',
    }
    setActionLabel(labels[type])
    setDone(true)
    setTimeout(() => {
      onAction(campaign.id, type)
      onClose()
    }, 1600)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Drawer */}
      <div className="campaign-drawer">
        {/* ── Header ── */}
        <div className="drawer-header">
          <div className="drawer-campaign-icon">{campaign.image}</div>
          <div className="drawer-header-info">
            <div className="drawer-campaign-name">{campaign.name}</div>
            <div className="drawer-campaign-platform">{campaign.platform} · Started {campaign.started}</div>
          </div>
          <span className="drawer-status-badge"
            style={{ color: meta.color, background: meta.bg }}>
            {meta.label}
          </span>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        {/* ── Content ── */}
        <div className="drawer-body">

          {/* Action result */}
          {done && (
            <div className="drawer-done-banner">
              <span className="drawer-done-icon">✓</span>
              <span>{actionLabel}</span>
            </div>
          )}

          {/* ── Metrics ── */}
          <div className="drawer-section">
            <div className="drawer-section-title">Performance</div>
            <div className="drawer-metrics-grid">
              <div className="drawer-metric">
                <span className="dm-val">{campaign.spend}</span>
                <span className="dm-lbl">Spent</span>
              </div>
              <div className="drawer-metric">
                <span className="dm-val">{campaign.reach}</span>
                <span className="dm-lbl">Reached</span>
              </div>
              <div className="drawer-metric">
                <span className="dm-val">{campaign.conversations}</span>
                <span className="dm-lbl">Conversations</span>
              </div>
              <div className="drawer-metric featured">
                <span className="dm-val">{campaign.cpc}</span>
                <span className="dm-lbl">Per chat</span>
              </div>
            </div>

            {/* Sparkline — only for active */}
            {isActive && sparkData.length > 0 && (
              <div className="drawer-sparkline">
                <div className="spark-label">Daily reach — last 7 days</div>
                <Sparkline data={sparkData} />
                <div className="spark-days">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Pending / draft — placeholder */}
            {(isPending || isDraft) && (
              <div className="drawer-no-data">
                <span>📊</span>
                <span>Performance data will appear once your campaign goes live.</span>
              </div>
            )}
          </div>

          {/* ── AI Tip ── */}
          <div className="drawer-section">
            <div className="drawer-section-title">AI Insight</div>
            <div className="drawer-ai-tip">
              <span className="drawer-ai-icon">🤖</span>
              <span>{campaign.ai_tip}</span>
            </div>
          </div>

          {/* ── Ad Copy (if campaign was created via modal) ── */}
          {campaign.headline && (
            <div className="drawer-section">
              <div className="drawer-section-title">Ad Copy</div>
              <div className="drawer-ad-copy">
                <div className="drawer-copy-row">
                  <span className="drawer-copy-lbl">Headline</span>
                  <span className="drawer-copy-val">{campaign.headline}</span>
                </div>
                <div className="drawer-copy-row">
                  <span className="drawer-copy-lbl">Body</span>
                  <span className="drawer-copy-val">{campaign.body}</span>
                </div>
                <div className="drawer-copy-row">
                  <span className="drawer-copy-lbl">CTA</span>
                  <span className="drawer-copy-val">{campaign.cta}</span>
                </div>
                {campaign.budget && (
                  <div className="drawer-copy-row">
                    <span className="drawer-copy-lbl">Budget</span>
                    <span className="drawer-copy-val">₹{campaign.budget}/week</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Confirm panel ── */}
          {confirmAction && !done && (
            <div className="drawer-confirm">
              <div className="drawer-confirm-text">
                {confirmAction === 'approve' && '🚀 Approve this campaign? It will go live immediately on Meta Ads.'}
                {confirmAction === 'pause'   && '⏸ Pause this campaign? It will stop showing to new people.'}
                {confirmAction === 'resume'  && '▶️ Resume this campaign? It will start running again.'}
                {confirmAction === 'delete'  && '🗑 Delete this campaign? This action cannot be undone.'}
              </div>
              <div className="drawer-confirm-btns">
                <button className="btn btn-ghost btn-sm" onClick={() => setConfirmAction(null)}>
                  Cancel
                </button>
                <button
                  className={`btn btn-sm ${confirmAction === 'delete' ? 'btn-danger' : 'btn-primary'}`}
                  onClick={() => runAction(confirmAction)}
                >
                  {confirmAction === 'approve' && '✓ Yes, Approve'}
                  {confirmAction === 'pause'   && '⏸ Yes, Pause'}
                  {confirmAction === 'resume'  && '▶ Yes, Resume'}
                  {confirmAction === 'delete'  && '🗑 Delete'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer actions ── */}
        {!done && !confirmAction && (
          <div className="drawer-footer">

            {isPending && (
              <>
                <button
                  id={`drawer-approve-${campaign.id}`}
                  className="btn btn-primary"
                  onClick={() => setConfirmAction('approve')}
                >
                  ✓ Approve Campaign
                </button>
                <button
                  id={`drawer-delete-${campaign.id}`}
                  className="btn btn-ghost"
                  style={{ color: '#f87171' }}
                  onClick={() => setConfirmAction('delete')}
                >
                  🗑 Delete
                </button>
              </>
            )}

            {isActive && (
              <>
                <div className="drawer-active-tip">
                  Campaign is live · Pausing stops spend immediately
                </div>
                <button
                  id={`drawer-pause-${campaign.id}`}
                  className="btn btn-ghost"
                  onClick={() => setConfirmAction('pause')}
                >
                  ⏸ Pause Campaign
                </button>
              </>
            )}

            {isPaused && (
              <>
                <button
                  id={`drawer-resume-${campaign.id}`}
                  className="btn btn-primary"
                  onClick={() => setConfirmAction('resume')}
                >
                  ▶ Resume Campaign
                </button>
                <button
                  id={`drawer-delete-paused-${campaign.id}`}
                  className="btn btn-ghost"
                  style={{ color: '#f87171' }}
                  onClick={() => setConfirmAction('delete')}
                >
                  🗑 Delete
                </button>
              </>
            )}

            {isDraft && (
              <>
                <button
                  id={`drawer-approve-draft-${campaign.id}`}
                  className="btn btn-primary"
                  onClick={() => setConfirmAction('approve')}
                >
                  🚀 Launch Campaign
                </button>
                <button
                  id={`drawer-delete-draft-${campaign.id}`}
                  className="btn btn-ghost"
                  style={{ color: '#f87171' }}
                  onClick={() => setConfirmAction('delete')}
                >
                  🗑 Delete Draft
                </button>
              </>
            )}

            <button className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        )}

        {done && (
          <div className="drawer-footer">
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </>
  )
}
