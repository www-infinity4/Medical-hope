/**
 * routes/analyze.js
 *
 * POST /api/analyze
 * Accepts symptom text + optional structured fields.
 * Runs the signal engine, saves the case, rebuilds knowledge.
 */

import { Router } from 'express'
import { analyzeSignal } from '../services/signalEngine.js'
import { saveCase } from '../services/storage.js'
import { rebuildKnowledge } from '../services/knowledgeBuilder.js'

const router = Router()

router.post('/', async (req, res) => {
  const {
    symptom,
    duration,
    ageGroup,
    hydrationLevel,
    hasPain,
    hasFever
  } = req.body

  if (!symptom || typeof symptom !== 'string' || symptom.trim().length === 0) {
    return res.status(400).json({ error: 'A symptom description is required.' })
  }

  const structuredInput = {
    symptomText: symptom.trim(),
    duration: duration || null,
    ageGroup: ageGroup || null,
    hydrationLevel: hydrationLevel || null,
    hasPain: Boolean(hasPain),
    hasFever: Boolean(hasFever)
  }

  const analysisResult = analyzeSignal(symptom.trim(), structuredInput)

  // Persist the case (fire-and-forget knowledge rebuild)
  const record = await saveCase(req.body, structuredInput, analysisResult)

  // Rebuild knowledge base asynchronously — don't block the response
  rebuildKnowledge().catch(err =>
    console.error('[knowledgeBuilder] Rebuild failed:', err.message)
  )

  res.json({
    id: record.id,
    timestamp: record.timestamp,
    ...analysisResult
  })
})

export default router
