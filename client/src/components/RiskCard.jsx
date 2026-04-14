/**
 * RiskCard.jsx
 *
 * Displays the structured analysis result returned by the signal engine.
 * Visually separates low / medium / high / emergency risk levels.
 * Always includes a safety disclaimer footer.
 */

const RISK_META = {
  low:       { color: '#22c55e', bg: '#14532d22', label: 'LOW RISK' },
  medium:    { color: '#eab308', bg: '#71380022', label: 'MEDIUM RISK' },
  high:      { color: '#f97316', bg: '#7c2d1222', label: 'HIGH RISK' },
  emergency: { color: '#ef4444', bg: '#7f1d1d44', label: '🚨 EMERGENCY' }
}

function RiskBadge({ level }) {
  const meta = RISK_META[level] || RISK_META.low
  return (
    <span className="risk-badge" style={{ backgroundColor: meta.color, color: level === 'medium' ? '#1a1a2e' : '#fff' }}>
      {meta.label}
    </span>
  )
}

function ConfidenceBar({ confidence }) {
  const color = confidence > 70 ? '#7c3aed' : confidence > 40 ? '#a78bfa' : '#c4b5fd'
  return (
    <div className="confidence-track">
      <div className="confidence-fill" style={{ width: `${confidence}%`, backgroundColor: color }} />
    </div>
  )
}

export default function RiskCard({ analysis }) {
  if (!analysis) return null

  const { summary, possibleCauses, riskLevel, recommendedActions, emergencyFlags, tags, disclaimer } = analysis
  const meta = RISK_META[riskLevel] || RISK_META.low

  return (
    <div className="risk-card" style={{ borderColor: meta.color, boxShadow: `0 0 0 1px ${meta.color}33` }}>
      {/* Emergency banner */}
      {riskLevel === 'emergency' && (
        <div className="emergency-banner">
          <span className="emergency-icon">🚨</span>
          <div>
            <strong>EMERGENCY — Seek urgent medical care now</strong>
            {emergencyFlags?.length > 0 && (
              <p className="emergency-flags">
                Detected signals: {emergencyFlags.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* High-risk alert */}
      {riskLevel === 'high' && (
        <div className="high-alert">
          ⚠ High-risk signals detected. Seek medical attention within 24 hours.
        </div>
      )}

      {/* Header */}
      <div className="risk-header">
        <h3 className="risk-title">Analysis Results</h3>
        <RiskBadge level={riskLevel} />
      </div>

      {/* Summary */}
      <p className="risk-summary">{summary}</p>

      {/* Two-column grid */}
      <div className="risk-grid">
        {/* Possible Causes */}
        <div className="risk-section">
          <h4 className="risk-section-title">Possible Causes</h4>
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
            {recommendedActions?.map((action, i) => <li key={i}>{action}</li>)}
          </ul>
        </div>
      </div>

      {/* Tags */}
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
