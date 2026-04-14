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
  // Refresh key causes HistoryPanel to re-mount after a new analysis
  const [historyKey, setHistoryKey] = useState(0)

  const handleResult = (data) => {
    setAnalysis(data)
    // Switch to history tab and force a refresh so the new case appears
    setRightTab('history')
    setHistoryKey(k => k + 1)
  }

  return (
    <div className="app">
      {/* Always-visible safety disclaimer */}
      <div className="disclaimer-banner">
        ⚠️&nbsp;<strong>Medical Disclaimer:</strong>&nbsp;
        This platform provides informational pattern analysis only — it is <em>not</em> medical advice.
        Always consult a qualified healthcare professional. In an emergency, call 911.
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <span className="logo-icon">∞</span>
          <div>
            <h1 className="logo-title">Infinity Signal Health</h1>
            <p className="logo-sub">Self-evolving AI-powered health signal detection</p>
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
              🕑 History
            </button>
            <button
              className={`tab-btn ${rightTab === 'knowledge' ? 'active' : ''}`}
              onClick={() => setRightTab('knowledge')}
            >
              📚 Knowledge
            </button>
          </div>

          {rightTab === 'history' && <HistoryPanel key={historyKey} />}
          {rightTab === 'knowledge' && <KnowledgePanel />}
        </section>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Infinity Signal Health — Pattern aggregation & rule improvement scaffolding. Not a diagnostic tool.</p>
      </footer>
    </div>
  )
}
