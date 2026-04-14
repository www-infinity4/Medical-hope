/**
 * KnowledgePanel.jsx
 *
 * Living knowledge board — auto-generated from accumulated case patterns.
 * Topics are enriched with real case counts and recent examples.
 */

import { useState, useEffect } from 'react'

const TAG_COLORS = {
  dehydration:      '#38bdf8',
  uti:              '#a78bfa',
  kidney_stress:    '#fb923c',
  diabetes_warning: '#facc15',
  respiratory:      '#34d399',
  general:          '#94a3b8',
  high_risk:        '#f87171',
  emergency:        '#ef4444'
}

const TOPIC_ICONS = {
  dehydration:      '💧',
  uti:              '🧫',
  kidney_stress:    '🫘',
  diabetes_warning: '📊',
  respiratory:      '🫁',
  general:          '📡',
  emergency:        '🚨'
}

function TagChip({ tag }) {
  const color = TAG_COLORS[tag] || '#6b7280'
  return (
    <span
      className="tag"
      style={{
        background: `${color}14`,
        color,
        borderColor: `${color}30`
      }}
    >
      {tag.replace(/_/g, ' ')}
    </span>
  )
}

function TopicCard({ topic }) {
  const icon = TOPIC_ICONS[topic.id] || '📡'
  const hasRealCases = topic.caseCount > 0

  return (
    <div className="knowledge-card">
      <div className="knowledge-card-accent" />

      <div className="knowledge-card-header">
        <div className="knowledge-title-row">
          <span className="knowledge-icon" aria-hidden="true">{icon}</span>
          <h3 className="knowledge-title">{topic.title}</h3>
        </div>
        <span className={`case-badge ${hasRealCases ? 'has-cases' : ''}`}>
          {topic.caseCount} {topic.caseCount === 1 ? 'case' : 'cases'}
        </span>
      </div>

      <p className="knowledge-summary">{topic.summary}</p>

      {topic.commonSymptoms?.length > 0 && (
        <div className="knowledge-section">
          <span className="knowledge-section-label">Common Signals</span>
          <div className="symptom-chips">
            {topic.commonSymptoms.map((s, i) => (
              <span key={i} className="symptom-chip">{s}</span>
            ))}
          </div>
        </div>
      )}

      {topic.relatedTags?.length > 0 && (
        <div className="knowledge-tags">
          {topic.relatedTags.map(t => <TagChip key={t} tag={t} />)}
        </div>
      )}

      {topic.recentExamples?.length > 0 && (
        <div className="knowledge-section recent-examples">
          <span className="knowledge-section-label">Recent Patterns</span>
          {topic.recentExamples.map((ex, i) => (
            <p key={i} className="example-snippet">{ex}</p>
          ))}
        </div>
      )}

      <p className="knowledge-updated">
        Updated {new Date(topic.lastUpdated).toLocaleString()}
      </p>
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
          <p className="panel-sub">Continuously evolving from analyzed case patterns</p>
        </div>
      </div>

      {knowledge?.trendSummary?.length > 0 && (
        <div className="trend-bar">
          <span className="trend-label">Trending</span>
          {knowledge.trendSummary.map(({ tag, count }) => (
            <span key={tag} className="trend-chip">
              {tag.replace(/_/g, ' ')} <strong>{count}</strong>
            </span>
          ))}
        </div>
      )}

      {loading && <p className="loading-text">Building knowledge base…</p>}
      {error && <p className="error-msg">⚠ {error}</p>}

      {!loading && !error && (
        <div className="knowledge-grid">
          {knowledge?.entries?.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}

      {knowledge?.lastRebuilt && (
        <p className="knowledge-footer">
          Base rebuilt: {new Date(knowledge.lastRebuilt).toLocaleString()}
        </p>
      )}
    </div>
  )
}
