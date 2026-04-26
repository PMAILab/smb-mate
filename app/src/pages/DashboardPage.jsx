import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import './DashboardPage.css'

// Spend cap (not in session, kept as constant for prototype)
const SPEND_CAP = 1000
const WEEK_SPENT = 347

const CAMPAIGNS = [
  {
    id: 1,
    name: 'Summer Collection Launch',
    status: 'active',
    platform: '📸 Instagram',
    spend: '₹347',
    reach: '4,231',
    conversations: 8,
    cpc: '₹43',
    started: 'Apr 22',
    image: '👗',
    ai_tip: 'Running 12% better than similar boutiques in Pune'
  },
  {
    id: 2,
    name: 'Weekend Special Offer',
    status: 'pending',
    platform: '📘 Facebook',
    spend: '—',
    reach: '—',
    conversations: '—',
    cpc: '—',
    started: 'Draft',
    image: '🎉',
    ai_tip: 'Scheduled to launch Saturday 7 AM'
  },
  {
    id: 3,
    name: 'New Arrivals - May',
    status: 'draft',
    platform: '📸 Instagram',
    spend: '—',
    reach: '—',
    conversations: '—',
    cpc: '—',
    started: 'Draft',
    image: '🛍️',
    ai_tip: 'AI has prepared 3 creative options for your review'
  }
]

const MESSAGES = [
  {
    id: 1,
    sender: 'Anjali K.',
    preview: 'Do you have sarees in blue? I saw your ad...',
    time: '10 min ago',
    unread: true,
    avatar: 'AK',
    avatarColor: '#7c3aed'
  },
  {
    id: 2,
    sender: 'Sunita Rao',
    preview: 'What are your store timings? I\'d like to visit...',
    time: '1 hr ago',
    unread: true,
    avatar: 'SR',
    avatarColor: '#0891b2'
  },
  {
    id: 3,
    sender: 'Meena Sharma',
    preview: 'Do you do custom tailoring?',
    time: '3 hrs ago',
    unread: false,
    avatar: 'MS',
    avatarColor: '#d97706'
  },
  {
    id: 4,
    sender: 'Rekha D.',
    preview: 'Loved the collection! Are you open Sunday?',
    time: 'Yesterday',
    unread: false,
    avatar: 'RD',
    avatarColor: '#dc2626'
  }
]

const AI_SUGGESTIONS = [
  {
    id: 1,
    icon: '💡',
    title: 'Post at 7 PM today',
    desc: 'Your followers are most active 7–9 PM. I\'ve prepared a "New Arrivals" post.',
    action: 'Approve & Schedule',
    priority: 'high'
  },
  {
    id: 2,
    icon: '📊',
    title: 'Increase weekend budget by ₹200',
    desc: 'Your Saturday campaigns get 40% more conversations. ₹200 extra = ~4 more leads.',
    action: 'Approve Increase',
    priority: 'medium'
  },
  {
    id: 3,
    icon: '🎯',
    title: 'Target women 30–45 in Kothrud',
    desc: 'Similar boutiques in Kothrud are getting ₹35/conversation vs your ₹43. Let me refine targeting.',
    action: 'Apply Now',
    priority: 'low'
  }
]

const WEEKLY_CHART = [
  { day: 'Mon', spend: 45, conversations: 1 },
  { day: 'Tue', spend: 52, conversations: 2 },
  { day: 'Wed', spend: 63, conversations: 1 },
  { day: 'Thu', spend: 78, conversations: 2 },
  { day: 'Fri', spend: 92, conversations: 1 },
  { day: 'Sat', spend: 17, conversations: 1 },
  { day: 'Sun', spend: 0, conversations: 0 },
]

function SpendCapRing({ used, total }) {
  const pct = (used / total) * 100
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (pct / 100) * circumference
  const color = pct > 80 ? '#f97316' : '#22c55e'

  return (
    <div className="spend-ring-wrap">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(34,197,94,0.1)" strokeWidth="8"/>
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="spend-ring-inner">
        <span className="ring-pct">{Math.round(pct)}%</span>
        <span className="ring-label">used</span>
      </div>
    </div>
  )
}

function WeeklyChart({ data }) {
  const maxSpend = Math.max(...data.map(d => d.spend))
  return (
    <div className="weekly-chart">
      {data.map((d, i) => (
        <div key={i} className="chart-col">
          <div className="chart-bar-wrap">
            <div className="chart-conv-dots">
              {Array.from({ length: d.conversations }).map((_, j) => (
                <div key={j} className="conv-dot" title={`${d.conversations} conversations`} />
              ))}
            </div>
            <div
              className="chart-bar"
              style={{ height: `${maxSpend > 0 ? (d.spend / maxSpend) * 100 : 0}%` }}
              title={`₹${d.spend} spent`}
            />
          </div>
          <div className="chart-day">{d.day}</div>
          {d.spend > 0 && <div className="chart-spend">₹{d.spend}</div>}
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [approvedSuggestions, setApprovedSuggestions] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  // Merge session user with prototype defaults
  const displayUser = {
    name: user?.businessName || user?.name || "Priya's Boutique",
    firstName: (user?.name || 'Priya').split(' ')[0],
    city: user?.city || 'Pune',
    plan: user?.plan || 'Starter',
    credit: user?.credit ?? 500,
    spendCap: SPEND_CAP,
    weekSpent: WEEK_SPENT,
  }

  const handleApprove = (id) => {
    setApprovedSuggestions(prev => [...prev, id])
  }

  const statusColor = { active: '#22c55e', pending: '#f97316', draft: '#6b7280' }
  const statusLabel = { active: '● Live', pending: '⟳ Pending', draft: '✏️ Draft' }

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-user">
            <div className="user-avatar">
              {displayUser.name.charAt(0)}
            </div>
            <div>
              <div className="user-name">{displayUser.name}</div>
              <div className="user-city">📍 {displayUser.city}</div>
            </div>
          </div>

          <div className="sidebar-credit">
            <div className="credit-header">
              <span className="credit-tag">🎁 Free Credit</span>
              <span className="credit-val">₹{displayUser.credit}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '100%' }} />
            </div>
            <div className="credit-note">Expires in 30 days</div>
          </div>

          <nav className="sidebar-nav">
            {[
              { id: 'overview', icon: '📊', label: 'Overview' },
              { id: 'campaigns', icon: '🚀', label: 'Campaigns' },
              { id: 'messages', icon: '💬', label: 'Messages', badge: 2 },
              { id: 'ai', icon: '🤖', label: 'AI Suggestions', badge: 3 },
            ].map(item => (
              <button
                key={item.id}
                id={`sidebar-${item.id}`}
                className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>

          <div className="sidebar-wa-btn">
            <button className="btn btn-wa" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/report')}>
              <span>💬</span> Open WhatsApp
            </button>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', textAlign: 'center', marginTop: '8px' }}>
              Manage via WhatsApp
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Top Bar */}
          <div className="dashboard-topbar">
            <div>
              <h1 className="dashboard-title">
                {activeTab === 'overview' && `Good evening, ${displayUser.firstName}! 🌙`}
                {activeTab === 'campaigns' && 'Your Campaigns'}
                {activeTab === 'messages' && 'Customer Messages'}
                {activeTab === 'ai' && 'AI Suggestions'}
              </h1>
              <p className="dashboard-subtitle">
                {activeTab === 'overview' && "Here's how your marketing is performing today."}
                {activeTab === 'campaigns' && 'Review and manage your active campaigns.'}
                {activeTab === 'messages' && 'Customers who messaged you from your ads.'}
                {activeTab === 'ai' && 'One-tap approvals to improve your campaigns.'}
              </p>
            </div>
            <div className="topbar-actions">
              <button id="view-report" className="btn btn-ghost btn-sm" onClick={() => navigate('/report')}>
                📊 Daily Report
              </button>
              <button id="new-campaign" className="btn btn-primary btn-sm">
                + New Campaign
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-content">
              {/* Summary Cards */}
              <div className="summary-grid">
                <div className="summary-card card">
                  <div className="summary-icon" style={{ background: 'rgba(34,197,94,0.1)' }}>💰</div>
                  <div>
                    <div className="summary-value">₹347</div>
                    <div className="summary-label">Spent this week</div>
                    <div className="summary-sub" style={{ color: 'var(--accent)' }}>₹653 remaining from cap</div>
                  </div>
                </div>
                <div className="summary-card card">
                  <div className="summary-icon" style={{ background: 'rgba(99,102,241,0.1)' }}>👁️</div>
                  <div>
                    <div className="summary-value">4,231</div>
                    <div className="summary-label">People reached</div>
                    <div className="summary-sub">In Pune this week</div>
                  </div>
                </div>
                <div className="summary-card card">
                  <div className="summary-icon" style={{ background: 'rgba(249,115,22,0.1)' }}>💬</div>
                  <div>
                    <div className="summary-value">8</div>
                    <div className="summary-label">Conversations started</div>
                    <div className="summary-sub" style={{ color: 'var(--accent)' }}>↑ 2 more than last week</div>
                  </div>
                </div>
                <div className="summary-card card">
                  <div className="summary-icon" style={{ background: 'rgba(34,197,94,0.1)' }}>📈</div>
                  <div>
                    <div className="summary-value">₹43</div>
                    <div className="summary-label">Per conversation</div>
                    <div className="summary-sub" style={{ color: 'var(--accent)' }}>vs ₹300 industry avg</div>
                  </div>
                </div>
              </div>

              {/* Plain Language insights */}
              <div className="plain-insight-card card">
                <div className="plain-insight-header">
                  <span className="plain-insight-icon">🤖</span>
                  <div>
                    <div className="plain-insight-title">This week in plain language</div>
                    <div className="plain-insight-sub">SMBMate AI · Updated just now</div>
                  </div>
                </div>
                <div className="plain-insight-text">
                  You spent <strong style={{color:'var(--accent)'}}>₹347</strong> this week. 
                  <strong style={{color:'var(--text-primary)'}}> 4,231 people</strong> in Pune saw your ad. 
                  <strong style={{color:'var(--accent)'}}> 8 people</strong> messaged you. 
                  That's <strong style={{color:'var(--accent)'}}>₹43 per conversation</strong> — 
                  7x better than the industry average of ₹300.
                </div>
                <div className="plain-insight-suggestion">
                  <span>💡</span>
                  <span>Post your "New Arrivals" story <strong>today at 7 PM</strong> to catch peak engagement.</span>
                  <button id="approve-suggestion" className="btn btn-outline btn-sm">Approve in 1 tap →</button>
                </div>
              </div>

              {/* Chart + Spend Cap */}
              <div className="chart-spend-row">
                <div className="chart-card card">
                  <div className="chart-header">
                    <div>
                      <div className="chart-title">Weekly Performance</div>
                      <div className="chart-sub">Spend & conversations per day</div>
                    </div>
                    <div className="chart-legend">
                      <span className="legend-item"><span className="legend-bar green"></span> Spend</span>
                      <span className="legend-item"><span className="legend-dot green"></span> Conversations</span>
                    </div>
                  </div>
                  <WeeklyChart data={WEEKLY_CHART} />
                </div>

                <div className="spend-cap-card card">
                  <div className="cap-title">Weekly Spend Cap</div>
                  <SpendCapRing used={displayUser.weekSpent} total={displayUser.spendCap} />
                  <div className="cap-details">
                    <div className="cap-used">
                      <span className="cap-val">₹{displayUser.weekSpent}</span>
                      <span className="cap-lbl">used</span>
                    </div>
                    <div className="cap-divider" />
                    <div className="cap-remaining">
                      <span className="cap-val" style={{color:'var(--accent)'}}>₹{displayUser.spendCap - displayUser.weekSpent}</span>
                      <span className="cap-lbl">remaining</span>
                    </div>
                  </div>
                  <div className="cap-guarantee-badge">
                    <span>🔒</span> Spend cap guarantee active
                  </div>
                </div>
              </div>

              {/* Quick AI Suggestions Preview */}
              <div className="ai-preview card">
                <div className="ai-preview-header">
                  <span>🤖 AI says</span>
                  <button id="view-all-ai" className="btn btn-ghost btn-sm" onClick={() => setActiveTab('ai')}>
                    View all →
                  </button>
                </div>
                <div className="ai-suggestion-quick">
                  <span className="ai-sug-icon">💡</span>
                  <span className="ai-sug-text">Post at 7 PM today for 40% more reach</span>
                  <button id="quick-approve" className="btn btn-primary btn-sm" onClick={() => handleApprove(0)}>
                    {approvedSuggestions.includes(0) ? '✓ Done!' : 'Approve'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="campaigns-content">
              {CAMPAIGNS.map((c, i) => (
                <div key={c.id} className={`campaign-card card campaign-${c.status}`}>
                  <div className="campaign-icon">{c.image}</div>
                  <div className="campaign-info">
                    <div className="campaign-name-row">
                      <span className="campaign-name">{c.name}</span>
                      <span className="campaign-status-badge" style={{ color: statusColor[c.status] }}>
                        {statusLabel[c.status]}
                      </span>
                    </div>
                    <div className="campaign-platform">{c.platform} · Started {c.started}</div>
                    <div className="campaign-ai-tip">🤖 {c.ai_tip}</div>
                  </div>
                  <div className="campaign-metrics">
                    <div className="metric-item">
                      <span className="metric-val">{c.spend}</span>
                      <span className="metric-lbl">Spent</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-val">{c.reach}</span>
                      <span className="metric-lbl">Reach</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-val">{c.conversations}</span>
                      <span className="metric-lbl">Chats</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-val">{c.cpc}</span>
                      <span className="metric-lbl">Per chat</span>
                    </div>
                  </div>
                  <div className="campaign-actions">
                    {c.status === 'pending' && (
                      <button id={`approve-campaign-${c.id}`} className="btn btn-primary btn-sm">
                        ✓ Approve
                      </button>
                    )}
                    {c.status === 'draft' && (
                      <button id={`review-campaign-${c.id}`} className="btn btn-outline btn-sm">
                        Review
                      </button>
                    )}
                    {c.status === 'active' && (
                      <button id={`pause-campaign-${c.id}`} className="btn btn-ghost btn-sm">
                        ⏸ Pause
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="messages-content">
              <div className="messages-info card" style={{padding:'16px 20px', marginBottom:'16px'}}>
                <span style={{fontSize:'14px', color:'#9ca3af'}}>
                  💡 These customers messaged you <strong style={{color:'var(--text-primary)'}}>directly because of your ads</strong>. Each one is a potential sale.
                </span>
              </div>
              {MESSAGES.map((m) => (
                <div key={m.id} className={`message-card card ${m.unread ? 'unread' : ''}`}>
                  <div className="msg-avatar" style={{ background: m.avatarColor }}>{m.avatar}</div>
                  <div className="msg-info">
                    <div className="msg-name-row">
                      <span className="msg-name">{m.sender}</span>
                      {m.unread && <span className="msg-unread-dot" />}
                      <span className="msg-time">{m.time}</span>
                    </div>
                    <div className="msg-preview">{m.preview}</div>
                  </div>
                  <button id={`reply-${m.id}`} className="btn btn-primary btn-sm">
                    💬 Reply
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* AI Tab */}
          {activeTab === 'ai' && (
            <div className="ai-content">
              <div className="ai-intro card" style={{ padding: '20px 24px', marginBottom: '20px', background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }}>
                <p style={{ fontSize: '14px', color: '#d1d5db', lineHeight: '1.6' }}>
                  🤖 Your AI has been monitoring your campaigns 24/7. Here are this week's top recommendations — 
                  each one approved with a single tap. <strong style={{ color: 'var(--accent)' }}>3 suggestions ready.</strong>
                </p>
              </div>
              {AI_SUGGESTIONS.map((s, i) => (
                <div key={s.id} className={`ai-suggestion-card card priority-${s.priority}`}>
                  <div className="ai-sug-header">
                    <span className="ai-sug-big-icon">{s.icon}</span>
                    <div className="ai-sug-header-text">
                      <div className="ai-sug-title">{s.title}</div>
                      <div className="ai-sug-priority badge badge-green">{s.priority} priority</div>
                    </div>
                  </div>
                  <p className="ai-sug-desc">{s.desc}</p>
                  <div className="ai-sug-actions">
                    {approvedSuggestions.includes(s.id) ? (
                      <div className="ai-approved-badge">✓ Approved! Will be applied automatically.</div>
                    ) : (
                      <>
                        <button id={`approve-ai-${s.id}`} className="btn btn-primary" onClick={() => handleApprove(s.id)}>
                          ✓ {s.action}
                        </button>
                        <button id={`skip-ai-${s.id}`} className="btn btn-ghost">Skip for now</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="mobile-tab-bar">
        <div className="mobile-tab-bar-inner">
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'campaigns', icon: '🚀', label: 'Campaigns' },
            { id: 'messages', icon: '💬', label: 'Messages', badge: 2 },
            { id: 'ai', icon: '🤖', label: 'AI', badge: 3 },
          ].map(item => (
            <button
              key={item.id}
              id={`mobile-tab-${item.id}`}
              className={`mobile-tab-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.badge && <span className="mobile-tab-badge">{item.badge}</span>}
              <span className="tab-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
