export const NEW_HOPE_RESERVE_UNITS = 50_000_000_000_000n

export const ESSENTIAL_CATEGORIES = new Set([
  'food',
  'housing',
  'health',
  'transportation',
  'childcare',
  'education',
  'safety'
])

function units(value, field) {
  const normalized = typeof value === 'bigint' ? value : BigInt(value)
  if (normalized < 0n) throw new Error(`${field} cannot be negative`)
  return normalized
}

export function validateRightsAllocations(allocations = []) {
  const seen = new Set()
  let totalBasisPoints = 0

  for (const allocation of allocations) {
    if (!allocation?.rightsHolderId || seen.has(allocation.rightsHolderId)) {
      return { valid: false, reason: 'Rights-holder IDs must be present and unique.' }
    }
    seen.add(allocation.rightsHolderId)

    if (!Number.isInteger(allocation.basisPoints) || allocation.basisPoints < 0) {
      return { valid: false, reason: 'Royalty shares must be non-negative whole basis points.' }
    }
    totalBasisPoints += allocation.basisPoints
  }

  if (totalBasisPoints > 10_000) {
    return { valid: false, reason: 'Royalty shares cannot exceed 100%.' }
  }

  return { valid: true, totalBasisPoints }
}

export function evaluateSupportRequest(request, policy = {}) {
  const amount = units(request.amountUnits, 'amountUnits')
  const available = units(request.availableUnits, 'availableUnits')
  const dailyRemaining = units(request.dailyRemainingUnits ?? available, 'dailyRemainingUnits')
  const essential = ESSENTIAL_CATEGORIES.has(request.category)
  const reasons = []

  if (!request.claimantConsent) reasons.push('Claimant consent is required.')
  if (!request.productOrService?.verified) reasons.push('Product or service verification is required.')
  if (!request.productOrService?.legalAndSafe) reasons.push('Product or service must pass legal and safety review.')
  if (amount > available) reasons.push('Claim ledger has insufficient available units.')
  if (amount > dailyRemaining) reasons.push('The configured daily spending limit would be exceeded.')

  const royaltyCheck = validateRightsAllocations(request.rightsAllocations)
  if (!royaltyCheck.valid) reasons.push(royaltyCheck.reason)

  const blocked = reasons.length > 0
  return {
    recommendation: blocked ? 'human-review-required' : 'eligible-for-authorized-signing',
    essential,
    amountUnits: amount.toString(),
    reservePolicyUnits: NEW_HOPE_RESERVE_UNITS.toString(),
    reasons,
    safeguards: {
      aiMayMoveFunds: false,
      humanAuthorizationRequired: true,
      appealAvailable: true,
      essentialSupportCannotBeDeniedSolelyByAi: essential,
      identityDataPublic: false
    },
    policyVersion: policy.version || '2026-08-14'
  }
}

