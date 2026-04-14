/**
 * index.js — Infinity Signal Health API server
 *
 * On startup:
 *  1. Rebuilds knowledge.json from stored cases (continuous improvement loop)
 *  2. Mounts routes
 *  3. Listens on port 3001
 */

import express from 'express'
import cors from 'cors'
import { rebuildKnowledge } from './services/knowledgeBuilder.js'
import analyzeRouter from './routes/analyze.js'
import historyRouter from './routes/history.js'
import knowledgeRouter from './routes/knowledge.js'

const app = express()
app.use(cors())
app.use(express.json())

// ── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/analyze', analyzeRouter)
app.use('/api/history', historyRouter)
app.use('/api/knowledge', knowledgeRouter)

// Legacy aliases kept for backwards compatibility
app.get('/api/cases', (_req, res) => res.redirect('/api/history'))

app.get('/api/health', (_req, res) =>
  res.json({
    status: 'ok',
    service: 'Infinity Signal Health API',
    timestamp: new Date().toISOString()
  })
)

// ── Startup ──────────────────────────────────────────────────────────────────

const PORT = 3001

async function start() {
  // Continuous improvement: rebuild knowledge from every stored case at startup
  try {
    const { entries, trendSummary } = await rebuildKnowledge()
    const totalCases = entries.reduce((s, e) => s + e.caseCount, 0)
    console.log(
      `[knowledgeBuilder] Knowledge base rebuilt — ` +
      `${entries.length} topics, ${totalCases} case references, ` +
      `top trend: ${trendSummary[0]?.tag || 'none'}`
    )
  } catch (err) {
    console.error('[knowledgeBuilder] Startup rebuild failed:', err.message)
  }

  app.listen(PORT, () => {
    console.log(`Infinity Signal Health server running on http://localhost:${PORT}`)
  })
}

start()
