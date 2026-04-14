import { useState, useEffect, useCallback } from 'react'

const RISK_COLORS = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  emergency: '#ef4444'
}

const RISK_LABELS = {
  low: 'LOW RISK',
  medium: 'MEDIUM RISK',
  high: 'HIGH RISK',
  emergency: '🚨 EMERGENCY'
}

function RiskBadge({ level }) {
  return (
    <span
      className="risk-badge"
      style={{ backgroundColor: RISK_COLORS[level] || '#6b7280', color: level === 'medium' ? '#1a1a2e' : '#fff' }}
    >
      {RISK_LABELS[level] || level.toUpperCase()}
    </span>
  )
}

function ConfidenceBar({ confidence }) {
  return (
    <div className="confidence-track">
      <div
        className="confidence-fill"
        style={{ width: `${confidence}%`, backgroundColor: confidence > 70 ? '#7c3aed' : confidence > 40 ? '#a78bfa' : '#c4b5fd' }}
      />
    </div>
  )
}

function Dashboard() {
  const [symptom, setSymptom] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = async () => {
    if (!symptom.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom })
      })
      if (!res.ok) throw new Error('Analysis failed. Please try again.')
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter' && e.ctrlKey) analyze() }

  return (
    <div className="tab-content">
      <div className="card">
        <h2 className="section-title">Symptom Analyzer</h2>
        <p className="section-sub">Describe your symptoms in detail for the best analysis.</p>
        <textarea
          className="symptom-input"
          placeholder="Describe your symptoms… (e.g. I have dark urine, a burning feeling when urinating, and feel dizzy)"
          value={symptom}
          onChange={e => setSymptom(e.target.value)}
          onKeyDown={handleKey}
          rows={5}
        />
        <p className="hint">Tip: Press Ctrl+Enter to analyze</p>
        <button className="btn-analyze" onClick={analyze} disabled={loading || !symptom.trim()}>
          {loading ? <span className="spinner" /> : null}
          {loading ? 'Analyzing…' : 'Analyze Symptoms'}
        </button>
        {error && <p className="error-msg">{error}</p>}
      </div>

      {result && (
        <div className="results-container">
          {result.isEmergency && (
            <div className="emergency-banner">
              <span>🚨</span>
              <div>
                <strong>EMERGENCY DETECTED</strong>
                <p>Call 911 or go to the nearest emergency room immediately. Do not delay.</p>
              </div>
            </div>
          )}

          <div className="card results-grid">
            <div className="result-header">
              <h3>Analysis Results</h3>
              <RiskBadge level={result.riskLevel} />
            </div>

            <div className="results-sections">
              <div className="result-section">
                <h4>Possible Causes</h4>
                {result.possibleCauses.map((cause, i) => (
                  <div key={i} className="cause-item">
                    <div className="cause-row">
                      <span className="cause-name">{cause.name}</span>
                      <span className="cause-pct">{cause.confidence}%</span>
                    </div>
                    <ConfidenceBar confidence={cause.confidence} />
                  </div>
                ))}
              </div>

              <div className="result-section">
                <h4>Suggested Actions</h4>
                <ul className="actions-list">
                  {result.suggestedActions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {result.tags?.length > 0 && (
              <div className="tags-row">
                {result.tags.map(t => (
                  <span key={t} className="tag">{t.replace(/_/g, ' ')}</span>
                ))}
              </div>
            )}

            <p className="disclaimer-text">{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Knowledge() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/knowledge')
      .then(r => r.json())
      .then(data => { setTopics(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-state">Loading knowledge base…</div>

  return (
    <div className="tab-content">
      <h2 className="section-title">AI Knowledge Base</h2>
      <p className="section-sub">Auto-generated topics from analyzed cases. Case counts grow with each analysis.</p>
      <div className="knowledge-grid">
        {topics.map((topic, i) => (
          <div key={i} className="card knowledge-card">
            <div className="knowledge-header">
              <h3>{topic.title}</h3>
              <span className="case-badge">{topic.caseCount} cases</span>
            </div>
            <p className="knowledge-desc">{topic.description}</p>
            <div className="knowledge-section">
              <strong>Common Symptoms</strong>
              <ul className="knowledge-list">
                {topic.symptoms.map((s, j) => <li key={j}>{s}</li>)}
              </ul>
            </div>
            <div className="knowledge-section">
              <strong>Recommended Actions</strong>
              <ul className="knowledge-list">
                {topic.actions.map((a, j) => <li key={j}>{a}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function History() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  const loadCases = useCallback(() => {
    setLoading(true)
    fetch('/api/cases')
      .then(r => r.json())
      .then(data => { setCases(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { loadCases() }, [loadCases])

  if (loading) return <div className="loading-state">Loading history…</div>

  return (
    <div className="tab-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>Analysis History</h2>
          <p className="section-sub" style={{ marginBottom: 0 }}>{cases.length} case{cases.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button className="btn-refresh" onClick={loadCases}>↻ Refresh</button>
      </div>
      {cases.length === 0 ? (
        <div className="card empty-state">
          <p>No cases yet. Analyze your first symptom from the Dashboard tab.</p>
        </div>
      ) : (
        <div className="history-list">
          {cases.map(c => (
            <div key={c.id} className="card history-card">
              <div className="history-header">
                <div className="history-meta">
                  <RiskBadge level={c.riskLevel} />
                  <span className="history-time">{new Date(c.timestamp).toLocaleString()}</span>
                </div>
                <div className="tags-row" style={{ marginTop: '0.5rem' }}>
                  {(c.tags || []).map(t => (
                    <span key={t} className="tag">{t.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              </div>
              <p className="history-symptom">"{c.symptom.length > 180 ? c.symptom.slice(0, 180) + '…' : c.symptom}"</p>
              {c.possibleCauses?.length > 0 && (
                <p className="history-cause">Top cause: <strong>{c.possibleCauses[0].name}</strong> ({c.possibleCauses[0].confidence}% confidence)</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: '⚕ Dashboard' },
    { id: 'knowledge', label: '📚 Knowledge' },
    { id: 'history', label: '🕑 History' }
  ]

  return (
    <div className="app">
      <div className="disclaimer-banner">
        ⚠️ <strong>Medical Disclaimer:</strong> This platform is for informational purposes only. It does not provide medical advice. Always consult a qualified healthcare professional.
      </div>
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">∞</span>
            <div>
              <h1>Infinity Signal Health</h1>
              <p>AI-powered health signal detection</p>
            </div>
          </div>
        </div>
      </header>
      <nav className="tab-nav">
        <div className="tab-nav-inner">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'knowledge' && <Knowledge />}
        {activeTab === 'history' && <History />}
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Infinity Signal Health — Self-evolving AI health signal platform</p>
      </footer>
    </div>
  )
}
