/**
 * routes/knowledge.js
 *
 * GET /api/knowledge
 * Returns the auto-generated knowledge base.
 * If knowledge.json is missing or stale, rebuilds on the fly.
 */

import { Router } from 'express'
import { readKnowledge } from '../services/storage.js'
import { rebuildKnowledge } from '../services/knowledgeBuilder.js'

const router = Router()

router.get('/', async (_req, res) => {
  let knowledge = await readKnowledge()

  if (!knowledge || !knowledge.entries) {
    // Seed the knowledge base if not yet built
    knowledge = await rebuildKnowledge()
  }

  res.json(knowledge)
})

export default router
