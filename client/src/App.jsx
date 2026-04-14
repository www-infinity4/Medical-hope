/**
 * App.jsx — Infinity Signal Health
 *
 * Two-column layout:
 *   Left:  SignalInput + latest RiskCard result
 *   Right: HistoryPanel + KnowledgePanel (tab-switched)
 *
 * Safety disclaimer is always visible at the top.
 */

import { useState } from 'react'
import SignalInput from './components/SignalInput.jsx'
import RiskCard from './components/RiskCard.jsx'
import HistoryPanel from './components/HistoryPanel.jsx'
import KnowledgePanel from './components/KnowledgePanel.jsx'
import './styles.css'

export default function App() {
  const [analysis, setAnalysis] = useState(null)
  const [rightTab, setRightTab] = useState('history')
  const [historyKey, setHistoryKey] = useState(0)

  const handleResult = (data) => {
    setAnalysis(data)
    setRightTab('history')
    setHistoryKey(k => k + 1)
  }

  return (
    <div className="app">
      {/* Always-visible safety disclaimer */}
      <div className="disclaimer-banner">
        <strong>Medical Disclaimer:</strong>&nbsp;
        This platform provides informational pattern analysis only — it is <em>not</em> medical advice.
        Always consult a qualified healthcare professional. In an emergency, call 911.
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="logo-mark" aria-hidden="true">∞</div>
            <div className="logo-text">
              <span className="logo-title">Infinity Signal Health</span>
              <span className="logo-sub">Early-warning health signal intelligence</span>
            </div>
          </div>
          <div className="header-status" role="status" aria-label="System online">
            <span className="status-dot" />
            LIVE
          </div>
        </div>
      </header>

      {/* Main two-column layout */}
      <main className="main-layout">
        {/* ── Left column: input + results ── */}
        <section className="left-col">
          <SignalInput
            onResult={handleResult}
            onError={() => {}}
            onLoading={() => {}}
          />
          {analysis && <RiskCard analysis={analysis} />}
        </section>

        {/* ── Right column: history + knowledge ── */}
        <section className="right-col">
          <div className="right-tabs">
            <button
              className={`tab-btn ${rightTab === 'history' ? 'active' : ''}`}
              onClick={() => setRightTab('history')}
            >
              Signal History
            </button>
            <button
              className={`tab-btn ${rightTab === 'knowledge' ? 'active' : ''}`}
              onClick={() => setRightTab('knowledge')}
            >
              Knowledge Base
            </button>
          </div>

          {rightTab === 'history' && <HistoryPanel key={historyKey} />}
          {rightTab === 'knowledge' && <KnowledgePanel />}
        </section>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Infinity Signal Health — Pattern aggregation & decision-support scaffolding. Not a diagnostic tool.</p>
      </footer>
    </div>
  )
}
