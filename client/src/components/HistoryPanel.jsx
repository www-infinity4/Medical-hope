/**
 * HistoryPanel.jsx
 *
 * Fetches /api/history and displays a scrollable list of past analyzed cases.
 * Clicking a case card expands it to show full details.
 */

import { useState, useEffect, useCallback } from 'react'

const RISK_COLORS = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  emergency: '#ef4444'
}

const RISK_LABELS = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  emergency: 'EMERGENCY'
}

function RiskPill({ level }) {
  return (
    <span
      className="risk-pill"
      style={{ backgroundColor: RISK_COLORS[level] || '#6b7280', color: level === 'medium' ? '#1a1a2e' : '#fff' }}
    >
      {RISK_LABELS[level] || level?.toUpperCase()}
    </span>
  )
}

function HistoryItem({ record }) {
  const [expanded, setExpanded] = useState(false)

  const { timestamp, rawInput, analysisResult, tags } = record
  const symptomText = rawInput?.symptom || record.symptom || '(no text)'
  const result = analysisResult || record
  const riskLevel = result?.riskLevel || 'low'
  const topCause = result?.possibleCauses?.[0]

  const date = new Date(timestamp)
  const formattedDate = isNaN(date) ? timestamp : date.toLocaleString()

  return (
    <div
      className={`history-item ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded(e => !e)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setExpanded(v => !v) }}
      aria-expanded={expanded}
    >
      <div className="history-item-header">
        <div className="history-item-meta">
          <RiskPill level={riskLevel} />
          <span className="history-time">{formattedDate}</span>
        </div>
        <span className="expand-toggle">{expanded ? '▲' : '▼'}</span>
      </div>

      <p className="history-symptom">
        &ldquo;{symptomText.length > 140 ? symptomText.slice(0, 140) + '…' : symptomText}&rdquo;
      </p>

      {topCause && (
        <p className="history-top-cause">
          Top signal: <strong>{topCause.name}</strong>
          {topCause.confidence ? ` (${topCause.confidence}%)` : ''}
        </p>
      )}

      {tags?.length > 0 && (
        <div className="tags-row small-tags">
          {tags.map(t => <span key={t} className="tag">{t.replace(/_/g, ' ')}</span>)}
        </div>
      )}

      {expanded && (
        <div className="history-expanded" onClick={e => e.stopPropagation()}>
          {result?.summary && <p className="expanded-summary">{result.summary}</p>}

          {result?.recommendedActions?.length > 0 && (
            <div className="expanded-section">
              <strong>Actions:</strong>
              <ul className="actions-list small">
                {result.recommendedActions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}

          {record.structuredInput && (
            <div className="expanded-section structured-inputs">
              <strong>Input details:</strong>
              <div className="struct-grid">
                {record.structuredInput.duration && <span>Duration: {record.structuredInput.duration}</span>}
                {record.structuredInput.ageGroup && <span>Age: {record.structuredInput.ageGroup}</span>}
                {record.structuredInput.hydrationLevel && <span>Hydration: {record.structuredInput.hydrationLevel}</span>}
                {record.structuredInput.hasFever && <span>🌡 Fever reported</span>}
                {record.structuredInput.hasPain && <span>⚡ Pain reported</span>}
              </div>
            </div>
          )}

          {result?.disclaimer && (
            <p className="disclaimer-text small">⚕ <em>{result.disclaimer}</em></p>
          )}
        </div>
      )}
    </div>
  )
}

export default function HistoryPanel() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/history')
      if (!res.ok) throw new Error('Failed to load history')
      const data = await res.json()
      setCases(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadHistory() }, [loadHistory])

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Analysis History</h2>
          <p className="panel-sub">{cases.length} case{cases.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button className="btn-refresh" onClick={loadHistory} title="Refresh history">↻</button>
      </div>

      {loading && <p className="loading-text">Loading history…</p>}
      {error && <p className="error-msg">⚠ {error}</p>}

      {!loading && cases.length === 0 && (
        <div className="empty-state">
          <p>No cases yet. Analyze your first symptom to begin tracking.</p>
        </div>
      )}

      <div className="history-list">
        {cases.map(c => <HistoryItem key={c.id} record={c} />)}
      </div>
    </div>
  )
}
