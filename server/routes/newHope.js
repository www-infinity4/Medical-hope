import { Router } from 'express'
import { evaluateSupportRequest, NEW_HOPE_RESERVE_UNITS } from '../services/newHopePolicy.js'

const router = Router()

router.get('/policy', (_req, res) => {
  res.json({
    name: 'New Hope Worldwide Social Security',
    reservePolicyUnits: NEW_HOPE_RESERVE_UNITS.toString(),
    unit: 'Infinity',
    status: 'architecture-and-policy',
    liveCustodyOrLegalEntitlement: false,
    aiAuthority: 'advisory-only',
    canonicalWallet: 'www-infinity4/Mint-For-Infinity'
  })
})

router.post('/evaluate', (req, res) => {
  try {
    res.json(evaluateSupportRequest(req.body))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router

