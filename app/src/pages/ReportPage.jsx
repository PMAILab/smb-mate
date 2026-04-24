import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './ReportPage.css'

const REPORT_DATA = {
  date: 'Thursday, April 24, 2026',
  time: '9:00 PM',
  businessName: "Priya's Boutique",
  spend: 52,
  totalSpend: 347,
  reach: 892,
  conversations: 2,
  topPost: 'Summer Collection Reel',
  cpc: 26,
  industryAvg: 300,
  weeklyComparison: '+31% vs last week',
  spendCapRemaining: 653,
}

const WA_REPORT_MESSAGES = [
  {
    type: 'system',
    text: 'Today • 9:00 PM'
  },
  {
    type: 'out',
    text: `📊 *Daily Report — ${REPORT_DATA.date}*\n\nHere's how your marketing did today, Priya 👆`
  },
  {
    type: 'out',
    text: `💰 *Spent today:* ₹${REPORT_DATA.spend}\n👁️ *People reached:* ${REPORT_DATA.reach.toLocaleString()}\n💬 *Conversations:* ${REPORT_DATA.conversations}\n📈 *Cost per conversation:* ₹${REPORT_DATA.cpc}`
  },
  {
    type: 'out',
    text: `🏆 *Top performing:*\n${REPORT_DATA.topPost}\n\nYour cost per conversation (₹${REPORT_DATA.cpc}) is *10x better* than the industry average (₹${REPORT_DATA.industryAvg}).`
  },
  {
    type: 'out',
    text: `🤖 *AI tip for tomorrow:*\nPost a "behind the scenes" story between 7–8 PM. Similar boutiques got 3x more saves with this format.\n\nShall I schedule it?\n\n✅ *1 — Yes, schedule it*\n✏️ *2 — Edit first*\n⏭️ *3 — Skip today*`
  },
]

export default function ReportPage() {
  const navigate = useNavigate()
  const [replied, setReplied] = useState(null)
  const [showFollowup, setShowFollowup] = useState(false)
  const [messages, setMessages] = useState(WA_REPORT_MESSAGES)

  const handleReply = (choice) => {
    setReplied(choice)
    const userMsg = {
      type: 'in',
      text: choice === '1' ? '1' : choice === '2' ? '2' : '3'
    }
    const responses = {
      '1': {
        type: 'out',
        text: `✅ *Done!* I've scheduled your behind-the-scenes story for *tomorrow at 7:30 PM*.\n\nSee you at 9 PM tomorrow with your report! 🙌`
      },
      '2': {
        type: 'out',
        text: `✏️ *Editing mode:*\nSend me your changes, or reply with what you'd like to update about the post idea.`
      },
      '3': {
        type: 'out',
        text: `⏭️ Got it! I'll skip the story today and suggest something fresh tomorrow. Your current campaign continues running. 👍`
      }
    }
    setMessages(prev => [...prev, userMsg, responses[choice]])
    setShowFollowup(true)
  }

  return (
    <div className="report-page">
      <Navbar />

      <div className="report-layout container">
        {/* Left — Web View */}
        <div className="report-web fade-up">
          <div className="report-web-header">
            <div className="report-date-badge">
              <span>📅 {REPORT_DATA.date}</span>
              <span className="report-time-badge">9:00 PM Report</span>
            </div>
            <h1 className="report-title">Daily Performance Report</h1>
            <p className="report-sub">
              Here's everything that happened with <strong>{REPORT_DATA.businessName}</strong> today.
            </p>
          </div>

          {/* Today's Numbers */}
          <div className="report-section">
            <h2 className="report-section-title">📊 Today's Numbers</h2>
            <div className="report-metrics-grid">
              <div className="report-metric-card">
                <div className="rmc-icon">💰</div>
                <div className="rmc-value">₹{REPORT_DATA.spend}</div>
                <div className="rmc-label">Spent Today</div>
                <div className="rmc-sub">₹{REPORT_DATA.spendCapRemaining} cap remaining</div>
              </div>
              <div className="report-metric-card">
                <div className="rmc-icon">👁️</div>
                <div className="rmc-value">{REPORT_DATA.reach.toLocaleString()}</div>
                <div className="rmc-label">People Reached</div>
                <div className="rmc-sub">In Pune today</div>
              </div>
              <div className="report-metric-card featured">
                <div className="rmc-icon">💬</div>
                <div className="rmc-value" style={{color:'var(--accent)'}}>
                  {REPORT_DATA.conversations}
                  <span className="rmc-value-label"> new</span>
                </div>
                <div className="rmc-label">Conversations Started</div>
                <div className="rmc-sub">Potential customers</div>
              </div>
              <div className="report-metric-card">
                <div className="rmc-icon">📈</div>
                <div className="rmc-value">₹{REPORT_DATA.cpc}</div>
                <div className="rmc-label">Per Conversation</div>
                <div className="rmc-sub" style={{color:'var(--accent)'}}>vs ₹300 avg ✓</div>
              </div>
            </div>
          </div>

          {/* Plain Language Insight */}
          <div className="report-section">
            <h2 className="report-section-title">🧠 What This Means</h2>
            <div className="plain-language-box">
              <p>
                Today you spent <strong>₹{REPORT_DATA.spend}</strong>. 
                Your ad reached <strong>{REPORT_DATA.reach} people</strong> in Pune. 
                <strong> {REPORT_DATA.conversations} people</strong> messaged you directly.
              </p>
              <p style={{ marginTop: '12px' }}>
                That's <strong style={{color:'var(--accent)'}}>₹{REPORT_DATA.cpc} per conversation</strong>. 
                The industry average is ₹{REPORT_DATA.industryAvg}. 
                That means you're getting customers at <strong style={{color:'var(--accent)'}}>10x less cost</strong> than most businesses.
              </p>
              <div className="comparison-bar-wrap">
                <div className="comparison-bar-label">
                  <span>Your cost (₹{REPORT_DATA.cpc})</span>
                  <span>Industry average (₹{REPORT_DATA.industryAvg})</span>
                </div>
                <div className="comparison-bars">
                  <div className="cbar yours" style={{ width: `${(REPORT_DATA.cpc / REPORT_DATA.industryAvg) * 100}%` }}>
                    ₹{REPORT_DATA.cpc}
                  </div>
                  <div className="cbar industry" style={{ width: '100%' }}>₹{REPORT_DATA.industryAvg}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="report-section">
            <h2 className="report-section-title">📆 This Week So Far</h2>
            <div className="weekly-summary-card card">
              <div className="weekly-summary-grid">
                <div className="ws-item">
                  <span className="ws-val">₹{REPORT_DATA.totalSpend}</span>
                  <span className="ws-lbl">Total spent</span>
                </div>
                <div className="ws-item">
                  <span className="ws-val" style={{color:'var(--accent)'}}>8</span>
                  <span className="ws-lbl">Conversations</span>
                </div>
                <div className="ws-item">
                  <span className="ws-val">4,231</span>
                  <span className="ws-lbl">Total reach</span>
                </div>
                <div className="ws-item">
                  <span className="ws-val" style={{color:'var(--accent)'}}>↑ 31%</span>
                  <span className="ws-lbl">vs last week</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestion */}
          <div className="report-section">
            <h2 className="report-section-title">🤖 AI Tip for Tomorrow</h2>
            <div className="ai-tip-card card">
              <div className="ai-tip-header">
                <span className="ai-tip-icon">💡</span>
                <div>
                  <div className="ai-tip-title">Behind-the-Scenes Story</div>
                  <div className="ai-tip-sub">Best time: Tomorrow 7:30 PM</div>
                </div>
              </div>
              <p className="ai-tip-desc">
                Similar boutiques in Pune got 3x more saves with behind-the-scenes content. 
                I'll create the caption in Marathi + English automatically.
              </p>
              {!replied ? (
                <div className="ai-tip-actions">
                  <button id="approve-tip" className="btn btn-primary" onClick={() => handleReply('1')}>
                    ✅ Yes, Schedule It
                  </button>
                  <button id="edit-tip" className="btn btn-ghost" onClick={() => handleReply('2')}>
                    ✏️ Edit First
                  </button>
                  <button id="skip-tip" className="btn btn-ghost" onClick={() => handleReply('3')}>
                    ⏭️ Skip Today
                  </button>
                </div>
              ) : (
                <div className="ai-tip-approved">
                  {replied === '1' && <span style={{color:'var(--accent)'}}>✅ Scheduled for tomorrow at 7:30 PM!</span>}
                  {replied === '2' && <span style={{color:'var(--orange)'}}>✏️ Reply sent — you can edit via WhatsApp.</span>}
                  {replied === '3' && <span style={{color:'var(--text-dim)'}}>⏭️ Skipped. I'll suggest something fresh tomorrow.</span>}
                </div>
              )}
            </div>
          </div>

          <div className="report-back-btn">
            <button id="report-dashboard" className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Right — WhatsApp Preview */}
        <div className="report-wa-preview fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="wa-preview-label">
            <span>💬</span>
            <span>This is what arrives on WhatsApp at 9 PM</span>
          </div>
          <div className="wa-report-phone">
            <div className="wa-phone-header">
              <div className="wa-phone-header-left">
                <div className="wa-avatar-small">SM</div>
                <div>
                  <div className="wa-contact-name">SMBMate AI</div>
                  <div className="wa-contact-status">● Online</div>
                </div>
              </div>
            </div>
            <div className="wa-messages-area" style={{ height: '500px' }}>
              {messages.map((msg, i) => (
                msg.type === 'system' ? (
                  <div key={i} className="wa-system-msg">{msg.text}</div>
                ) : (
                  <div key={i} className={`wa-msg-row wa-msg-${msg.type}`}>
                    <div className={`wa-bubble-new wa-bubble-${msg.type}`}>
                      <div className="wa-msg-text" style={{ whiteSpace: 'pre-line' }}>
                        {msg.text.replace(/\*(.*?)\*/g, (_, t) => t)}
                      </div>
                      <div className="wa-msg-time">9:00 PM {msg.type === 'out' && '✓✓'}</div>
                    </div>
                  </div>
                )
              ))}
            </div>
            {!replied && (
              <div className="wa-quick-replies">
                <button id="wa-reply-1" className="wa-qr-btn" onClick={() => handleReply('1')}>1 ✅ Yes</button>
                <button id="wa-reply-2" className="wa-qr-btn" onClick={() => handleReply('2')}>2 ✏️ Edit</button>
                <button id="wa-reply-3" className="wa-qr-btn" onClick={() => handleReply('3')}>3 ⏭️ Skip</button>
              </div>
            )}
            {replied && !showFollowup && (
              <div className="wa-input-area">
                <div className="wa-type-box">Message sent ✓</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
