/**
 * signalEngine.js
 *
 * Core analysis service. Accepts symptom text and optional structured fields,
 * applies riskRules scoring, and returns a structured analysis result.
 * Designed so AI/ML logic can replace the rule engine without changing callers.
 */

import { scoreRules, HIGH_RISK_KEYWORDS, RULES } from './riskRules.js'

const DISCLAIMER =
  'This is not medical advice. Seek professional care for serious or worsening symptoms. ' +
  'If you are experiencing an emergency, call 911 or your local emergency number immediately.'

/**
 * @param {string} symptomText   - Free-text symptom description
 * @param {object} opts          - Optional structured fields from the intake form
 *   @param {string} [opts.duration]        - e.g. "2 days"
 *   @param {string} [opts.ageGroup]        - e.g. "adult"
 *   @param {string} [opts.hydrationLevel]  - "high" | "normal" | "low" | "very_low"
 *   @param {boolean} [opts.hasPain]
 *   @param {boolean} [opts.hasFever]
 */
export function analyzeSignal(symptomText, opts = {}) {
  const normalized = symptomText.toLowerCase().trim()

  const scored = scoreRules(normalized, opts)

  // Check for emergency first
  const emergencyRule = scored.find(s => s.rule.id === 'emergency' && s.score > 0)
  const isEmergency = Boolean(emergencyRule)

  // Build emergency flags list
  const emergencyFlags = isEmergency
    ? emergencyRule.matchedKeywords.slice(0, 5)
    : []

  // High-risk keyword count (independent of rules)
  const highRiskHits = HIGH_RISK_KEYWORDS.filter(kw => normalized.includes(kw)).length
  const feverBoost = opts.hasFever ? 1 : 0
  const totalHighRisk = highRiskHits + feverBoost

  // Determine risk level
  let riskLevel
  if (isEmergency) {
    riskLevel = 'emergency'
  } else if (totalHighRisk >= 2) {
    riskLevel = 'high'
  } else if (totalHighRisk >= 1 || scored.filter(s => s.score >= 2).length >= 2) {
    riskLevel = 'medium'
  } else {
    riskLevel = 'low'
  }

  // Build possible causes (exclude emergency rule from confidence list when others exist)
  const causes = scored
    .filter(s => s.score > 0 && (s.rule.id !== 'emergency' || scored.filter(x => x.score > 0).length === 1))
    .map(s => {
      const maxPossible = s.rule.keywords.length * s.rule.weight
      const confidence = Math.min(99, Math.round((s.score / maxPossible) * 100))
      return {
        id: s.rule.id,
        name: s.rule.outputCause,
        confidence,
        matchedKeywords: s.matchedKeywords
      }
    })
    .sort((a, b) => b.confidence - a.confidence)

  if (causes.length === 0) {
    causes.push({ id: 'general', name: 'General Health Concern', confidence: 20, matchedKeywords: [] })
  }

  // Build recommended actions (from top causes + escalation)
  const actionSet = new Set()
  if (isEmergency) {
    RULES.find(r => r.id === 'emergency').actionSuggestions.forEach(a => actionSet.add(a))
  }
  causes.slice(0, 3).forEach(cause => {
    const rule = RULES.find(r => r.id === cause.id)
    if (rule) rule.actionSuggestions.forEach(a => actionSet.add(a))
  })
  if (actionSet.size === 0) {
    actionSet.add('Monitor symptoms over the next 24–48 hours')
    actionSet.add('Stay hydrated and rest adequately')
    actionSet.add('Consult a healthcare provider if symptoms worsen or persist')
  }
  const recommendedActions = Array.from(actionSet)

  // Build tags
  const tags = []
  if (isEmergency) tags.push('emergency')
  scored.filter(s => s.score > 0 && s.rule.id !== 'emergency').forEach(s => tags.push(s.rule.id))
  if (totalHighRisk > 0) tags.push('high_risk')
  if (tags.length === 0) tags.push('general')

  // Build a brief summary sentence
  const topCause = causes[0]?.name || 'General Health Concern'
  const summary =
    isEmergency
      ? `Emergency signals detected. Immediate medical attention required.`
      : `Based on the signals provided, the most likely concern is ${topCause} (${riskLevel} risk).`

  return {
    summary,
    possibleCauses: causes,
    riskLevel,
    recommendedActions,
    emergencyFlags,
    tags,
    isEmergency,
    disclaimer: DISCLAIMER,
    // metadata for future AI replacement
    engineVersion: '1.0.0-rules',
    processedAt: new Date().toISOString()
  }
}
