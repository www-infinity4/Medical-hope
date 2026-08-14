# New Hope Worldwide Social Security

New Hope defines a worldwide support and claims network inside the Infinity ecosystem. Its reserve policy is **50,000,000,000,000 Infinity units**. The reserve is long-term backing for authorized social-support claims; it is not an ordinary wallet balance, a speculative asset, or proof that external funds are presently held.

## System boundaries

| Layer | Responsibility |
|---|---|
| New Hope reserve | Policy-level backing, allocation accounting, solvency reports, and public aggregate audits |
| Claim ledger | Private append-only history for one claimant: evidence references, awards, disbursements, corrections, and appeals |
| Unified wallet | Receives authorized Infinity disbursements and interoperable product/service coins across Infinity sites |
| Verification registry | Confirms that a product or service exists and passes identity, legality, safety, and rights checks |
| Royalty engine | Splits eligible transaction value among declared rights holders and records the calculation |
| AI assistance | Explains choices, compares verified offers, detects conflicts or fraud signals, and recommends review |

The canonical cross-site wallet and royalty implementation remains `www-infinity4/Mint-For-Infinity`. New Hope issues signed ledger instructions to that layer; it does not create a second competing wallet.

## Claim lifecycle

1. A person creates or recovers a private claimant identity.
2. The person consents to a specific claim and supplies only the evidence needed for it.
3. Rules and AI produce an explainable recommendation.
4. A qualified human reviewer authorizes, rejects, or requests more information.
5. An approved award is appended to the claimant ledger.
6. A signed disbursement instruction moves authorized units to the unified wallet.
7. Spending is checked against consent, available balance, limits, vendor verification, safety, and rights allocations.
8. The person receives a receipt and can correct data or appeal the decision.

## AI rules

- AI is advisory. It cannot sign a transfer, silently reduce an award, or be the sole reason essential support is denied.
- Recommendations must show the policy version, inputs used, missing information, and reasons.
- A person can request human review and appeal without being penalized.
- The system optimizes for the person's stated needs among verified choices; it does not rank human worth.
- Sensitive identity, health, child-safety, shelter, and location information stays out of public ledgers.

## Product and service coins

A builder may propose a coin for a real product or service. Activation requires:

- verified issuer identity and control of the listed offering;
- a precise product/service description, delivery terms, jurisdiction, price, and refund process;
- legality and safety review appropriate to the category and location;
- provenance for media, trademarks, patents, licenses, and other rights;
- declared rights holders and royalty shares totaling no more than 10,000 basis points;
- signed versioning, complaint handling, suspension, recall, and audit history;
- no promise that an internal Infinity unit is government currency or externally redeemable unless lawfully established.

Unsafe, fraudulent, exploitative, prohibited, recalled, or unverifiable offerings are quarantined and cannot receive New Hope claim funds.

## Ledger integrity

Each claimant has a separate pseudonymous ledger. Events are hash chained and append-only. Corrections create a new reversing or superseding event; history is never silently rewritten. Public reporting contains aggregate totals only. Signing keys, identity evidence, and private addresses are never stored in the repository.

Required event types include `claim-opened`, `evidence-attested`, `award`, `disbursement`, `royalty-allocation`, `refund`, `correction`, `appeal-opened`, `appeal-decided`, and `account-recovery`.

## Production gates

This repository now supplies the policy engine, ledger-integrity primitives, API evaluation route, tests, and public specification. Before real custody or benefits can launch, the system still requires audited cryptography, authenticated identities, role separation, multisignature authorization, privacy review, jurisdiction-specific legal review, independent financial audits, disaster recovery, and a connected Mint-for-Infinity wallet API.

