// Keyword sets for symptom analysis
const EMERGENCY_KEYWORDS = [
  'blood in urine', 'severe pain', 'chest pain', "can't breathe",
  'cannot breathe', 'unconscious', 'seizure', 'stroke', 'heart attack',
  'loss of consciousness', 'difficulty breathing'
];

const HIGH_RISK_KEYWORDS = [
  'fever', 'back pain', 'flank pain', 'vomiting', 'confusion',
  'burning urination', 'pus', 'high temperature', 'chills', 'shaking'
];

const INFECTION_SIGNALS = [
  'cloudy', 'smell', 'odor', 'burning', 'frequent urination', 'uti',
  'discharge', 'murky', 'foul', 'itching', 'painful urination'
];

const DEHYDRATION_SIGNALS = [
  'not drinking', 'dark urine', 'dry mouth', 'headache', 'dizzy',
  'fatigue', 'concentrated', 'thirsty', 'no energy', 'tired', 'dizziness',
  'lightheaded', 'not urinating'
];

const KIDNEY_SIGNALS = [
  'back pain', 'flank pain', 'swelling', 'foamy urine', 'kidney',
  'reduced urination', 'lower back', 'side pain', 'swollen ankles',
  'swollen feet', 'protein urine'
];

const URINARY_SIGNALS = [
  'urination', 'urine', 'bladder', 'uti', 'peeing', 'urinate',
  'frequent', 'urgency', 'incontinence', 'leaking'
];

function normalize(text) {
  return text.toLowerCase().trim();
}

function countMatches(text, keywords) {
  return keywords.filter(kw => text.includes(normalize(kw))).length;
}

function getMatchedKeywords(text, keywords) {
  return keywords.filter(kw => text.includes(normalize(kw)));
}

export function analyzeSymptoms(symptom) {
  const text = normalize(symptom);

  const emergencyMatches = getMatchedKeywords(text, EMERGENCY_KEYWORDS);
  const highRiskMatches = getMatchedKeywords(text, HIGH_RISK_KEYWORDS);
  const infectionMatches = countMatches(text, INFECTION_SIGNALS);
  const dehydrationMatches = countMatches(text, DEHYDRATION_SIGNALS);
  const kidneyMatches = countMatches(text, KIDNEY_SIGNALS);
  const urinaryMatches = countMatches(text, URINARY_SIGNALS);

  // Determine risk level
  let riskLevel;
  const isEmergency = emergencyMatches.length > 0;

  if (isEmergency) {
    riskLevel = 'emergency';
  } else if (highRiskMatches.length >= 2) {
    riskLevel = 'high';
  } else if (
    highRiskMatches.length >= 1 ||
    infectionMatches + dehydrationMatches + kidneyMatches >= 3
  ) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  // Build possible causes with confidence scores
  const causes = [];

  if (infectionMatches > 0) {
    const confidence = Math.min(100, infectionMatches * 25 + (highRiskMatches.length > 0 ? 20 : 0));
    causes.push({ name: 'Urinary Tract Infection (UTI)', confidence });
  }
  if (dehydrationMatches > 0) {
    const confidence = Math.min(100, dehydrationMatches * 20);
    causes.push({ name: 'Dehydration', confidence });
  }
  if (kidneyMatches > 0) {
    const confidence = Math.min(100, kidneyMatches * 25 + (highRiskMatches.length > 0 ? 15 : 0));
    causes.push({ name: 'Kidney Stress / Kidney Issue', confidence });
  }
  if (urinaryMatches > 0 && infectionMatches === 0) {
    const confidence = Math.min(100, urinaryMatches * 20);
    causes.push({ name: 'Urinary Irritation', confidence });
  }
  if (isEmergency) {
    causes.push({ name: 'Acute Medical Emergency', confidence: 95 });
  }
  if (highRiskMatches.length > 0 && causes.length === 0) {
    causes.push({ name: 'Systemic Infection or Inflammation', confidence: 60 });
  }
  if (causes.length === 0) {
    causes.push({ name: 'General Health Concern', confidence: 30 });
  }

  // Sort by confidence descending
  causes.sort((a, b) => b.confidence - a.confidence);

  // Build suggested actions
  const actions = [];
  if (isEmergency) {
    actions.push('⚠️ CALL 911 OR GO TO EMERGENCY IMMEDIATELY');
    actions.push('Do not drive yourself — call for emergency assistance');
  }
  if (riskLevel === 'high' || riskLevel === 'emergency') {
    actions.push('Seek immediate medical attention within 24 hours');
  }
  if (infectionMatches > 0) {
    actions.push('Consult a doctor for possible antibiotic treatment');
    actions.push('Increase fluid intake (water, cranberry juice)');
    actions.push('Avoid caffeine and alcohol until symptoms resolve');
  }
  if (dehydrationMatches > 0) {
    actions.push('Increase water intake to at least 8 glasses per day');
    actions.push('Consider electrolyte drinks if sweating heavily');
  }
  if (kidneyMatches > 0) {
    actions.push('Schedule a kidney function test (blood and urine panels)');
    actions.push('Monitor urine color and output daily');
    actions.push('Reduce sodium intake and avoid NSAIDs');
  }
  if (actions.length === 0 || riskLevel === 'low') {
    actions.push('Monitor symptoms over the next 24–48 hours');
    actions.push('Stay hydrated and rest adequately');
    actions.push('Consult a healthcare provider if symptoms worsen');
  }

  // Build tags
  const tags = [];
  if (infectionMatches > 0) tags.push('infection');
  if (dehydrationMatches > 0) tags.push('dehydration');
  if (kidneyMatches > 0) tags.push('kidney_risk');
  if (urinaryMatches > 0) tags.push('urinary');
  if (isEmergency) tags.push('emergency');
  if (highRiskMatches.length > 0) tags.push('high_risk');
  if (tags.length === 0) tags.push('general');

  return {
    possibleCauses: causes,
    riskLevel,
    suggestedActions: actions,
    isEmergency,
    tags,
    disclaimer:
      'This analysis is for informational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.'
  };
}
