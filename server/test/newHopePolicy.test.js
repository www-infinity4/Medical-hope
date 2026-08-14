import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateSupportRequest, validateRightsAllocations } from '../services/newHopePolicy.js'
import { appendClaimEvent, verifyClaimLedger } from '../services/claimLedger.js'

test('eligible verified support request reaches authorized signing', () => {
  const result = evaluateSupportRequest({
    claimantConsent: true,
    category: 'food',
    amountUnits: '25',
    availableUnits: '100',
    dailyRemainingUnits: '50',
    productOrService: { verified: true, legalAndSafe: true },
    rightsAllocations: [{ rightsHolderId: 'producer-1', basisPoints: 1000 }]
  })
  assert.equal(result.recommendation, 'eligible-for-authorized-signing')
  assert.equal(result.safeguards.aiMayMoveFunds, false)
})

test('unverified product is sent to human review', () => {
  const result = evaluateSupportRequest({
    claimantConsent: true,
    category: 'housing',
    amountUnits: '25',
    availableUnits: '100',
    productOrService: { verified: false, legalAndSafe: true }
  })
  assert.equal(result.recommendation, 'human-review-required')
  assert.match(result.reasons.join(' '), /verification/i)
})

test('rights shares cannot exceed 100 percent', () => {
  assert.equal(validateRightsAllocations([
    { rightsHolderId: 'a', basisPoints: 6000 },
    { rightsHolderId: 'b', basisPoints: 5000 }
  ]).valid, false)
})

test('claim ledger detects tampering', () => {
  let ledger = appendClaimEvent([], {
    eventId: 'event-1', claimantId: 'claimant-demo', type: 'award', amountUnits: '100', timestamp: '2026-08-14T00:00:00.000Z'
  })
  ledger = appendClaimEvent(ledger, {
    eventId: 'event-2', claimantId: 'claimant-demo', type: 'disbursement', amountUnits: '20', timestamp: '2026-08-14T01:00:00.000Z'
  })
  assert.equal(verifyClaimLedger(ledger).valid, true)
  ledger[0].amountUnits = '999'
  assert.equal(verifyClaimLedger(ledger).valid, false)
})

