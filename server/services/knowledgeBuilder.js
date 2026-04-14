/**
 * knowledgeBuilder.js
 *
 * Automatically generates and updates evolving knowledge topics from stored cases.
 * Called on server startup and after every new analysis.
 *
 * Output: server/data/knowledge.json
 * Content is educational pattern-summary content generated from user inputs —
 * it is NOT medical advice.
 */

import { readCases, writeKnowledge } from './storage.js'

// Base topic definitions — these seed the knowledge base and are enriched by real case data
const BASE_TOPICS = [
  {
    id: 'dehydration',
    title: 'Dehydration',
    summary:
      'Dehydration occurs when the body loses more fluid than it takes in. ' +
      'Common signals include dark or concentrated urine, dry mouth, fatigue, dizziness, and infrequent urination. ' +
      'Increasing water intake and electrolyte balance are the first steps.',
    relatedTags: ['dehydration'],
    commonSymptoms: ['dark urine', 'dry mouth', 'dizziness', 'fatigue', 'headache', 'not urinating']
  },
  {
    id: 'uti',
    title: 'Urinary Tract Infection (UTI)',
    summary:
      'UTIs are among the most common bacterial infections. ' +
      'Key signals include cloudy or foul-smelling urine, burning or painful urination, and increased urgency. ' +
      'When fever or back pain are also present, the infection may have reached the kidneys.',
    relatedTags: ['uti'],
    commonSymptoms: ['cloudy urine', 'burning urination', 'frequent urination', 'urgency', 'odor']
  },
  {
    id: 'kidney_stress',
    title: 'Kidney Stress',
    summary:
      'The kidneys filter waste from the blood. Early stress signals include persistent back or flank pain, ' +
      'foamy urine (protein leakage), reduced urine output, and ankle or leg swelling. ' +
      'Early detection through blood and urine tests can prevent progression to chronic kidney disease.',
    relatedTags: ['kidney_stress'],
    commonSymptoms: ['flank pain', 'foamy urine', 'swelling', 'reduced urination', 'back pain']
  },
  {
    id: 'diabetes_warning',
    title: 'Diabetes Warning Signals',
    summary:
      'Unmanaged blood sugar can produce recognisable signals including excessive thirst, frequent urination, ' +
      'unexplained weight loss, blurred vision, and slow wound healing. ' +
      'A fasting glucose test or HbA1c blood test provides a definitive answer.',
    relatedTags: ['diabetes_warning'],
    commonSymptoms: ['frequent urination', 'excessive thirst', 'blurred vision', 'fatigue', 'slow healing']
  },
  {
    id: 'respiratory',
    title: 'Respiratory Concern',
    summary:
      'Respiratory signals range from mild congestion to severe breathing difficulty. ' +
      'Persistent shortness of breath, wheezing, or chest tightness — especially with fever — ' +
      'warrant prompt medical evaluation.',
    relatedTags: ['respiratory'],
    commonSymptoms: ['shortness of breath', 'coughing', 'wheezing', 'chest tightness', 'phlegm']
  },
  {
    id: 'general',
    title: 'General Health Monitoring',
    summary:
      'Not every symptom maps to a specific condition immediately. ' +
      'General fatigue, low energy, mild discomfort, and sleep disruption are worth tracking over time. ' +
      'Pattern detection across multiple inputs can surface emerging health trends.',
    relatedTags: ['general', 'high_risk'],
    commonSymptoms: ['fatigue', 'general discomfort', 'mild pain', 'low energy', 'sleep issues']
  }
]

/**
 * Rebuild the knowledge base from all stored cases.
 * Saves result to knowledge.json and returns the entries.
 */
export async function rebuildKnowledge() {
  const cases = await readCases()

  // Aggregate tag counts and collect recent symptom texts per tag
  const tagCounts = {}
  const tagRecentSymptoms = {}

  for (const c of cases) {
    const tags = c.tags || []
    for (const tag of tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
      if (!tagRecentSymptoms[tag]) tagRecentSymptoms[tag] = []
      const symptomText =
        c.rawInput?.symptom ||
        c.structuredInput?.symptomText ||
        ''
      if (symptomText) tagRecentSymptoms[tag].push(symptomText.slice(0, 120))
    }
  }

  // Build trend summary (most common tags)
  const trendSummary = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }))

  // Enrich base topics with live case data
  const entries = BASE_TOPICS.map(topic => {
    const caseCount = topic.relatedTags.reduce(
      (sum, tag) => sum + (tagCounts[tag] || 0),
      0
    )
    // Collect a few recent example snippets (deduplicated)
    const recentExamples = [
      ...new Set(
        topic.relatedTags.flatMap(tag => tagRecentSymptoms[tag] || [])
      )
    ].slice(0, 3)

    return {
      id: topic.id,
      title: topic.title,
      summary: topic.summary,
      relatedTags: topic.relatedTags,
      commonSymptoms: topic.commonSymptoms,
      caseCount,
      recentExamples,
      lastUpdated: new Date().toISOString()
    }
  })

  await writeKnowledge({ entries, trendSummary, lastRebuilt: new Date().toISOString() })
  return { entries, trendSummary }
}
