/**
 * New Hope + Infinity Signal Health API server.
 */

import express from 'express'
import cors from 'cors'
import { rebuildKnowledge } from './services/knowledgeBuilder.js'
import analyzeRouter from './routes/analyze.js'
import historyRouter from './routes/history.js'
import knowledgeRouter from './routes/knowledge.js'
import newHopeRouter from './routes/newHope.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/analyze', analyzeRouter)
app.use('/api/history', historyRouter)
app.use('/api/knowledge', knowledgeRouter)
app.use('/api/new-hope', newHopeRouter)

app.get('/api/cases', (_req, res) => res.redirect('/api/history'))

app.get('/api/health', (_req, res) =>
  res.json({
    status: 'ok',
    service: 'New Hope and Infinity Signal Health API',
    timestamp: new Date().toISOString()
  })
)

const PORT = 3001

async function start() {
  try {
    const { entries, trendSummary } = await rebuildKnowledge()
    const totalCases = entries.reduce((sum, entry) => sum + entry.caseCount, 0)
    console.log(
      `[knowledgeBuilder] Knowledge base rebuilt — ` +
      `${entries.length} topics, ${totalCases} case references, ` +
      `top trend: ${trendSummary[0]?.tag || 'none'}`
    )
  } catch (error) {
    console.error('[knowledgeBuilder] Startup rebuild failed:', error.message)
  }

  app.listen(PORT, () => {
    console.log(`New Hope server running on http://localhost:${PORT}`)
  })
}

start()

