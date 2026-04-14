/**
 * routes/history.js
 *
 * GET /api/history
 * Returns all stored cases, newest first.
 */

import { Router } from 'express'
import { readCases } from '../services/storage.js'

const router = Router()

router.get('/', async (_req, res) => {
  const cases = await readCases()
  res.json([...cases].reverse())
})

export default router
