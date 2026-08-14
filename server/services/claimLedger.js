import { createHash, randomUUID } from 'crypto'

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

function hashEvent(event) {
  return createHash('sha256').update(canonical(event)).digest('hex')
}

export function appendClaimEvent(existingEvents, input) {
  if (!input.claimantId || !input.type || !input.amountUnits) {
    throw new Error('claimantId, type, and amountUnits are required')
  }

  const amount = BigInt(input.amountUnits)
  if (amount <= 0n) throw new Error('amountUnits must be greater than zero')

  const previous = existingEvents.at(-1)
  if (previous && previous.claimantId !== input.claimantId) {
    throw new Error('A claim ledger may contain only one claimant ID')
  }

  const unsigned = {
    eventId: input.eventId || randomUUID(),
    claimantId: input.claimantId,
    type: input.type,
    amountUnits: amount.toString(),
    timestamp: input.timestamp || new Date().toISOString(),
    evidenceRefs: input.evidenceRefs || [],
    authorizationRefs: input.authorizationRefs || [],
    previousHash: previous?.hash || null,
    policyVersion: input.policyVersion || '2026-08-14'
  }

  return [...existingEvents, { ...unsigned, hash: hashEvent(unsigned) }]
}

export function verifyClaimLedger(events) {
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index]
    const { hash, ...unsigned } = event
    const expectedPrevious = index === 0 ? null : events[index - 1].hash

    if (event.previousHash !== expectedPrevious || hash !== hashEvent(unsigned)) {
      return { valid: false, brokenAt: index }
    }
  }
  return { valid: true, brokenAt: null }
}

