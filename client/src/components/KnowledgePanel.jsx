/**
 * KnowledgePanel.jsx
 *
 * Fetches /api/knowledge and renders a living knowledge board.
 * Topics are auto-generated from stored case patterns.
 */

import { useState, useEffect } from 'react'

const TAG_COLORS = {
  dehydration:     '#38bdf8',
  uti:             '#a78bfa',
  kidney_stress:   '#fb923c',
  diabetes_warning:'#facc15',
  respiratory:     '#34d399',
  general:         '#94a3b8',
  high_risk:       '#f87171',
  emergency:       '#ef4444'
}

function TagChip({ tag }) {
  return (
    <span
      className="tag"
      style={{ backgroundColor: `${TAG_COLORS[tag] || '#6b7280'}22`, color: TAG_COLORS[tag] || '#94a3b8', borderColor: `${TAG_COLORS[tag] || '#6b7280'}44` }}
    >
      {tag.replace(/_/g, ' ')}
    </span>
  )
}

function TopicCard({ topic }) {
  return (
    <div className="knowledge-card">
      <div className="knowledge-card-header">
        <h3 className="knowledge-title">{topic.title}</h3>
        <span className="case-badge">{topic.caseCount} {topic.caseCount === 1 ? 'case' : 'cases'}</span>
      </div>

      <p className="knowledge-summary">{topic.summary}</p>

      <div className="knowledge-section">
        <strong>Common Signals</strong>
        <div className="symptom-chips">
          {topic.commonSymptoms?.map((s, i) => (
            <span key={i} className="symptom-chip">{s}</span>
          ))}
        </div>
      </div>

      <div className="knowledge-tags">
        {topic.relatedTags?.map(t => <TagChip key={t} tag={t} />)}
      </div>

      {topic.recentExamples?.length > 0 && (
        <div className="knowledge-section recent-examples">
          <strong>Recent patterns</strong>
          {topic.recentExamples.map((ex, i) => (
            <p key={i} className="example-snippet">&ldquo;{ex}&rdquo;</p>
          ))}
        </div>
      )}

      <p className="knowledge-updated">Last updated: {new Date(topic.lastUpdated).toLocaleString()}</p>
    </div>
  )
}

export default function KnowledgePanel() {
  const [knowledge, setKnowledge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/knowledge')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load knowledge base')
        return r.json()
      })
      .then(data => { setKnowledge(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Knowledge Base</h2>
          <p className="panel-sub">Auto-generated from analyzed case patterns — continuously evolving</p>
        </div>
      </div>

      {knowledge?.trendSummary?.length > 0 && (
        <div className="trend-bar">
          <span className="trend-label">Trending signals: </span>
          {knowledge.trendSummary.map(({ tag, count }) => (
            <span key={tag} className="trend-chip">
              {tag.replace(/_/g, ' ')} <strong>{count}</strong>
            </span>
          ))}
        </div>
      )}

      {loading && <p className="loading-text">Building knowledge base…</p>}
      {error && <p className="error-msg">⚠ {error}</p>}

      <div className="knowledge-grid">
        {knowledge?.entries?.map(topic => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>

      {knowledge?.lastRebuilt && (
        <p className="knowledge-footer">
          Knowledge base last rebuilt: {new Date(knowledge.lastRebuilt).toLocaleString()}
        </p>
      )}
    </div>
  )
}
