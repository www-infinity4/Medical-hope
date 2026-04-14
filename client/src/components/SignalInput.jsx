/**
 * SignalInput.jsx
 *
 * Intake form component — captures symptom text and optional structured fields.
 * POSTs to /api/analyze and calls onResult / onError callbacks.
 */

import { useState } from 'react'

const HYDRATION_OPTIONS = [
  { value: '', label: 'Select hydration level' },
  { value: 'high', label: 'High — drinking plenty of fluids' },
  { value: 'normal', label: 'Normal — about 6–8 glasses/day' },
  { value: 'low', label: 'Low — less than 4 glasses/day' },
  { value: 'very_low', label: 'Very low — barely drinking anything' }
]

const AGE_GROUPS = [
  { value: '', label: 'Select age group' },
  { value: 'child', label: 'Child (0–12)' },
  { value: 'teen', label: 'Teen (13–17)' },
  { value: 'adult', label: 'Adult (18–64)' },
  { value: 'senior', label: 'Senior (65+)' }
]

export default function SignalInput({ onResult = () => {}, onError = () => {}, onLoading = () => {} }) {
  const [symptom, setSymptom] = useState('')
  const [duration, setDuration] = useState('')
  const [ageGroup, setAgeGroup] = useState('')
  const [hydrationLevel, setHydrationLevel] = useState('')
  const [hasPain, setHasPain] = useState(false)
  const [hasFever, setHasFever] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!symptom.trim()) return
    setLoading(true)
    setError(null)
    onLoading(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptom,
          duration: duration || undefined,
          ageGroup: ageGroup || undefined,
          hydrationLevel: hydrationLevel || undefined,
          hasPain,
          hasFever
        })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Analysis failed. Please try again.')
      }

      const data = await res.json()
      onResult(data)
    } catch (e) {
      const msg = e.message || 'An unexpected error occurred.'
      setError(msg)
      onError(msg)
    } finally {
      setLoading(false)
      onLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleSubmit()
  }

  return (
    <div className="signal-input-card">
      <h2 className="card-title">Analyze Signal</h2>
      <p className="card-sub">Describe your symptoms in as much detail as possible.</p>

      <label className="field-label">Symptoms *</label>
      <textarea
        className="symptom-textarea"
        placeholder="e.g. I have cloudy urine with a bad smell, I feel dizzy and haven't been drinking much water today…"
        value={symptom}
        onChange={e => setSymptom(e.target.value)}
        onKeyDown={handleKey}
        rows={5}
        disabled={loading}
      />
      <p className="field-hint">Tip: Press Ctrl+Enter to analyze</p>

      <details className="optional-fields">
        <summary className="optional-summary">Optional details (improves accuracy)</summary>
        <div className="optional-grid">
          <div className="field-group">
            <label className="field-label">Duration</label>
            <input
              type="text"
              className="field-input"
              placeholder="e.g. 2 days, since yesterday"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="field-group">
            <label className="field-label">Age Group</label>
            <select
              className="field-select"
              value={ageGroup}
              onChange={e => setAgeGroup(e.target.value)}
              disabled={loading}
            >
              {AGE_GROUPS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">Hydration Level</label>
            <select
              className="field-select"
              value={hydrationLevel}
              onChange={e => setHydrationLevel(e.target.value)}
              disabled={loading}
            >
              {HYDRATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="field-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hasPain}
                onChange={e => setHasPain(e.target.checked)}
                disabled={loading}
              />
              <span>Experiencing pain</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hasFever}
                onChange={e => setHasFever(e.target.checked)}
                disabled={loading}
              />
              <span>Have a fever</span>
            </label>
          </div>
        </div>
      </details>

      {error && <p className="error-msg">⚠ {error}</p>}

      <button
        className="btn-analyze"
        onClick={handleSubmit}
        disabled={loading || !symptom.trim()}
      >
        {loading ? <span className="spinner" /> : null}
        {loading ? 'Analyzing…' : 'Analyze Signal'}
      </button>
    </div>
  )
}
