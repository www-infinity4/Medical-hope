/**
 * riskRules.js
 *
 * Standalone rules engine for health signal classification.
 * Each rule has a weighted keyword list and escalation logic so the engine
 * can be swapped for an ML model later without touching signalEngine.js.
 */

export const RULES = [
  {
    id: 'uti',
    label: 'Urinary Tract Infection (UTI)',
    keywords: [
      'cloudy urine', 'murky urine', 'foul urine', 'smelly urine',
      'burning urination', 'painful urination', 'burning when urinating',
      'frequent urination', 'urgency', 'uti', 'discharge',
      'odor', 'smell', 'itching', 'pelvic pressure'
    ],
    weight: 1.2,
    outputCause: 'Urinary Tract Infection (UTI)',
    actionSuggestions: [
      'Consult a doctor for possible antibiotic treatment',
      'Increase fluid intake — water and unsweetened cranberry juice',
      'Avoid caffeine and alcohol until symptoms resolve',
      'Do not delay treatment; untreated UTIs can reach the kidneys'
    ],
    escalationConditions: ['fever', 'back pain', 'flank pain', 'chills', 'vomiting']
  },
  {
    id: 'dehydration',
    label: 'Dehydration',
    keywords: [
      'dark urine', 'concentrated urine', 'not drinking', 'not drinking water',
      'dry mouth', 'headache', 'dizzy', 'dizziness', 'lightheaded',
      'fatigue', 'thirsty', 'no energy', 'tired', 'not urinating',
      'infrequent urination', 'low urine output', 'dark yellow urine'
    ],
    weight: 1.0,
    outputCause: 'Dehydration',
    actionSuggestions: [
      'Drink at least 8 glasses (2 litres) of water daily',
      'Use electrolyte drinks if sweating or vomiting',
      'Avoid diuretics like caffeine during recovery',
      'Monitor urine colour — aim for pale straw yellow'
    ],
    escalationConditions: ['confusion', 'rapid heartbeat', 'fainting', 'no urination for hours']
  },
  {
    id: 'kidney_stress',
    label: 'Kidney Stress / Kidney Issue',
    keywords: [
      'back pain', 'flank pain', 'lower back', 'side pain',
      'foamy urine', 'frothy urine', 'protein urine',
      'swelling', 'swollen ankles', 'swollen feet', 'swollen legs',
      'reduced urination', 'kidney', 'kidney pain'
    ],
    weight: 1.3,
    outputCause: 'Kidney Stress / Kidney Issue',
    actionSuggestions: [
      'Schedule a kidney function test (blood creatinine + urine albumin)',
      'Monitor urine output and colour daily',
      'Reduce sodium and avoid NSAID pain relievers',
      'Stay well hydrated unless otherwise directed by your doctor'
    ],
    escalationConditions: ['fever', 'chills', 'vomiting', 'confusion', 'severe back pain']
  },
  {
    id: 'diabetes_warning',
    label: 'Possible Diabetes Signal',
    keywords: [
      'frequent urination', 'excessive thirst', 'always thirsty',
      'blurred vision', 'unexplained weight loss', 'slow healing',
      'sweet smelling urine', 'fruity breath', 'high sugar',
      'blood sugar', 'glucose'
    ],
    weight: 1.1,
    outputCause: 'Possible Diabetes Signal',
    actionSuggestions: [
      'Request a fasting blood glucose or HbA1c test from your doctor',
      'Track fluid intake and urination frequency',
      'Reduce sugary drinks and processed carbohydrates',
      'Seek evaluation if symptoms are persistent'
    ],
    escalationConditions: ['confusion', 'nausea', 'vomiting', 'rapid breathing', 'fruity breath']
  },
  {
    id: 'respiratory',
    label: 'Respiratory Concern',
    keywords: [
      'shortness of breath', 'difficulty breathing', 'trouble breathing',
      'coughing', 'wheezing', 'chest tightness',
      'phlegm', 'mucus', 'congestion', 'respiratory'
    ],
    weight: 1.0,
    outputCause: 'Respiratory Concern',
    actionSuggestions: [
      'Rest and avoid physical exertion',
      'Use a humidifier and stay hydrated',
      'Consult a doctor if breathing difficulty persists'
    ],
    escalationConditions: ["can't breathe", 'cannot breathe', 'turning blue', 'lips blue', 'oxygen']
  },
  {
    id: 'emergency',
    label: 'Acute Medical Emergency',
    keywords: [
      'blood in urine', 'severe pain', 'chest pain', "can't breathe",
      'cannot breathe', 'unconscious', 'seizure', 'stroke',
      'heart attack', 'loss of consciousness', 'difficulty breathing',
      'trouble breathing severely', 'signs of sepsis', 'high fever with confusion',
      'sudden severe headache', 'face drooping', 'arm weakness',
      'slurred speech', 'anaphylaxis', 'allergic reaction severe'
    ],
    weight: 3.0,
    outputCause: 'Acute Medical Emergency',
    actionSuggestions: [
      '🚨 CALL 911 OR YOUR LOCAL EMERGENCY NUMBER IMMEDIATELY',
      'Do not drive yourself — call for emergency assistance',
      'Stay calm and stay on the line with emergency services'
    ],
    escalationConditions: []
  }
]

// High-risk individual keywords (raise risk level regardless of category)
export const HIGH_RISK_KEYWORDS = [
  'fever', 'high temperature', 'chills', 'shaking',
  'vomiting', 'confusion', 'pus', 'back pain', 'flank pain'
]

/**
 * Score each rule against normalised input text.
 * Returns array of { rule, score, matchedKeywords, escalated }.
 */
export function scoreRules(normalizedText, structuredInput = {}) {
  return RULES.map(rule => {
    const matched = rule.keywords.filter(kw => normalizedText.includes(kw))
    const baseScore = matched.length * rule.weight

    // Check if escalation conditions are met
    const escalated = rule.escalationConditions.some(cond =>
      normalizedText.includes(cond)
    )
    const finalScore = escalated ? baseScore * 1.5 : baseScore

    // Apply structured-input boosts
    let boost = 0
    if (structuredInput.hasFever && (rule.id === 'uti' || rule.id === 'kidney_stress')) boost += 1.5
    if (structuredInput.hasPain && rule.id === 'kidney_stress') boost += 1.0
    if (structuredInput.hydrationLevel === 'low' && rule.id === 'dehydration') boost += 2.0
    if (structuredInput.hydrationLevel === 'very_low' && rule.id === 'dehydration') boost += 3.0

    return {
      rule,
      score: finalScore + boost,
      matchedKeywords: matched,
      escalated
    }
  })
}
