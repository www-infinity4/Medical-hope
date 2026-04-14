/**
 * RiskCard.jsx
 *
 * Premium result card — displays structured analysis output.
 * Visually distinct for low / medium / high / emergency.
 * Always includes a safety disclaimer.
 */

const RISK_META = {
  low:       { color: 'var(--low)',       bg: 'var(--low-bg)',       border: 'var(--low-border)',       label: 'Low Risk',    dot: '●' },
  medium:    { color: 'var(--medium)',     bg: 'var(--medium-bg)',     border: 'var(--medium-border)',     label: 'Medium Risk', dot: '●' },
  high:      { color: 'var(--high)',       bg: 'var(--high-bg)',       border: 'var(--high-border)',       label: 'High Risk',   dot: '●' },
  emergency: { color: 'var(--emergency)',  bg: 'var(--emergency-bg)',  border: 'var(--emergency-border)',  label: 'Emergency',   dot: '🚨' }
}

function RiskBadge({ level }) {
  const meta = RISK_META[level] || RISK_META.low
  return (
    <span
      className="risk-badge"
      style={{
        background: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.border}`,
        boxShadow: `0 0 12px ${meta.bg}`
      }}
    >
      <span style={{ fontSize: level === 'emergency' ? '0.75rem' : '0.5rem' }}>{meta.dot}</span>
      {meta.label}
    </span>
  )
}

function ConfidenceBar({ confidence }) {
  const pct = Math.min(100, Math.max(0, confidence))
  const color = pct > 70 ? 'var(--accent)' : pct > 40 ? 'var(--accent-lite)' : 'var(--text-muted)'
  return (
    <div className="confidence-track">
      <div
        className="confidence-fill"
        style={{ width: `${pct}%`, background: `linear-gradient(90deg, var(--accent-dark), ${color})` }}
      />
    </div>
  )
}

export default function RiskCard({ analysis }) {
  if (!analysis) return null

  const { summary, possibleCauses, riskLevel, recommendedActions, emergencyFlags, tags, disclaimer } = analysis
  const meta = RISK_META[riskLevel] || RISK_META.low
  const isEmergency = riskLevel === 'emergency'
  const isHigh = riskLevel === 'high'

  return (
    <div
      className="risk-card"
      style={{ borderColor: meta.border }}
    >
      {/* Emergency banner */}
      {isEmergency && (
        <div className="emergency-banner">
          <span className="emergency-icon">🚨</span>
          <div>
            <strong>EMERGENCY — Seek urgent medical care now</strong>
            {emergencyFlags?.length > 0 && (
              <p className="emergency-flags">
                Detected: {emergencyFlags.join(' · ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* High-risk alert */}
      {isHigh && (
        <div className="high-alert">
          <span>⚠</span>
          <span>High-risk signals detected — seek medical attention within 24 hours.</span>
        </div>
      )}

      {/* Header row */}
      <div className="risk-header">
        <h3 className="risk-title">Signal Analysis</h3>
        <RiskBadge level={riskLevel} />
      </div>

      {/* Summary */}
      <p className="risk-summary">{summary}</p>

      <div className="risk-divider" />

      {/* Two-column detail grid */}
      <div className="risk-grid">
        {/* Possible Causes */}
        <div className="risk-section">
          <h4 className="risk-section-title">Pattern Match</h4>
          {possibleCauses?.map((cause, i) => (
            <div key={i} className="cause-item">
              <div className="cause-row">
                <span className="cause-name">{cause.name}</span>
                <span className="cause-pct">{cause.confidence}%</span>
              </div>
              <ConfidenceBar confidence={cause.confidence} />
            </div>
          ))}
        </div>

        {/* Recommended Actions */}
        <div className="risk-section">
          <h4 className="risk-section-title">Recommended Actions</h4>
          <ul className="actions-list">
            {recommendedActions?.map((action, i) => (
              <li key={i}>
                <span className="action-num">{i + 1}</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Signal tags */}
      {tags?.length > 0 && (
        <div className="tags-row">
          {tags.map(t => (
            <span key={t} className="tag">{t.replace(/_/g, ' ')}</span>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="disclaimer-text">
        ⚕ <em>{disclaimer}</em>
      </p>
    </div>
  )
}
