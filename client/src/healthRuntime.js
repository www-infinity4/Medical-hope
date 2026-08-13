const CASES_KEY = 'medical_hope_cases_v2'

const patterns = [
  { id:'urgent', label:'Urgent warning pattern', terms:['chest pain','cannot breathe',"can't breathe",'face drooping','unconscious','seizure','severe bleeding'], level:'urgent' },
  { id:'hydration', label:'Hydration-related pattern', terms:['dizzy','dizziness','dry mouth','dark urine','not drinking','thirsty','headache'], level:'attention' },
  { id:'respiratory', label:'Respiratory pattern', terms:['cough','wheezing','shortness of breath','congestion'], level:'attention' },
  { id:'urinary', label:'Urinary pattern', terms:['burning urination','cloudy urine','frequent urination','flank pain'], level:'attention' },
  { id:'general', label:'General symptom record', terms:[], level:'observe' }
]

export function analyzeLocally(input) {
  const text = String(input.symptom || '').toLowerCase()
  const matches = patterns.filter(p => p.terms.some(term => text.includes(term)))
  const selected = matches.length ? matches : [patterns.at(-1)]
  const urgent = selected.some(p => p.level === 'urgent')
  const level = urgent ? 'urgent' : selected.some(p => p.level === 'attention') || input.hasFever || input.hasPain ? 'attention' : 'observe'
  return {
    id: `case-${Date.now()}`,
    timestamp: new Date().toISOString(),
    source:'on-device-pattern-engine',
    rawInput: input,
    level,
    matches:selected.map(p=>({id:p.id,label:p.label,matched:p.terms.filter(term=>text.includes(term))})),
    summary: urgent ? 'The words entered include an urgent warning pattern.' : 'Your entry was organized into informational patterns for review.',
    actions: urgent
      ? ['Call 911 or your local emergency number now.','Do not use this app to delay emergency care.']
      : ['Review the recorded details for accuracy.','Contact a qualified healthcare professional for diagnosis or treatment.','Seek urgent care if symptoms are severe, rapidly worsening, or feel dangerous.'],
    disclaimer:'Informational pattern organization only. This is not a diagnosis or medical advice.'
  }
}

export function loadCases(storage = globalThis.localStorage) {
  try { return JSON.parse(storage?.getItem(CASES_KEY) || '[]') } catch { return [] }
}

export function saveCase(record, storage = globalThis.localStorage) {
  const next = [record, ...loadCases(storage)].slice(0, 50)
  storage?.setItem(CASES_KEY, JSON.stringify(next))
  return next
}

export async function analyzeSignal(input, fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl === 'function') {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 2500)
      const response = await fetchImpl('/api/analyze', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input),signal:controller.signal})
      clearTimeout(timeout)
      if (response.ok) return { ...(await response.json()), source:'connected-api' }
    } catch { /* GitHub Pages intentionally falls back on-device. */ }
  }
  return analyzeLocally(input)
}

export { CASES_KEY }
