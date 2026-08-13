# New Hope — Powered by Infinity

New Hope is the mission-facing protection and support platform for women and children. Infinity is the reusable technology backbone beneath it: identity and consent, protected records, benefits, scheduling, service coordination, communications, and open module architecture.

This repository now contains the first New Hope website experience and the existing **Infinity Signal Health** prototype as its first working service module.

> **Current status:** development software and service architecture. It is not an operating emergency shelter, licensed healthcare provider, or replacement for professional medical, legal, or emergency services.

---

## Core Structure

```text
New Hope
├── Mission and public experience
│   ├── Safety and protected pathways
│   ├── Women-and-children service network
│   ├── Housing and stability
│   ├── Children and family continuity
│   ├── Learning, work, and economic support
│   └── Governance and accountability
│
└── Infinity backbone
    ├── Identity and consent
    ├── Privacy and role-based access
    ├── Benefits and accountable funding
    ├── Scheduling and referrals
    ├── Protected communications
    ├── Service records and audit history
    └── Open modules for approved builders
```

## Website Experience

The React frontend has been expanded from a single health dashboard into a complete New Hope landing experience with:

- A high-end responsive homepage and navigation system
- A clear New Hope / Infinity relationship
- Six connected service areas
- A visual support-flow explanation
- Funding and benefits architecture language
- Consent, privacy, governance, and accountability principles
- The original health-signal application preserved as **Working Module 01**

### Service Areas

| Service area | Purpose |
|---|---|
| Safe Path | Private safety planning, protected referrals, and transportation coordination |
| Health Access | Health navigation, appointment preparation, and pattern tracking |
| Children & Family | Childcare, school continuity, records, and routines |
| Housing & Stability | Shelter pathways, transitional housing, and long-term independence |
| Learning & Work | Education, employment, business-building, and AI assistance |
| Infinity Benefits | Accountable benefits, sponsor funding, approved credits, and disbursement records |

---

## Working Module 01: Infinity Signal Health

Infinity Signal Health is an informational pattern-tracking workspace. It accepts symptom text and optional structured fields, applies a weighted rules engine, assigns a risk category, records case history, and builds a knowledge board from stored patterns.

It is **not a diagnostic system**. Its purpose is to help organize information and prepare a person to seek qualified care.

### Current health-module features

| Layer | Feature |
|---|---|
| Intake | Free-text symptom input and optional structured fields |
| Analysis | Weighted rules engine in `riskRules.js` |
| Risk levels | low / medium / high / emergency |
| Causes | UTI, dehydration, kidney stress, diabetes warning, respiratory, emergency |
| Actions | Ranked informational suggestions per matched cause |
| Safety | Always-visible disclaimer and emergency escalation notice |
| Storage | Cases persisted to `server/data/cases.json` |
| Knowledge | Topic cards generated from accumulated case patterns |
| History | Expandable case history, newest first |

---

## Architecture

```text
Medical-hope/
├── client/                         # React + Vite frontend
│   └── src/
│       ├── App.jsx                 # New Hope site + embedded health workspace
│       ├── new-hope.css            # New Hope responsive visual system
│       ├── styles.css              # Existing health-module design system
│       ├── main.jsx
│       └── components/
│           ├── SignalInput.jsx
│           ├── RiskCard.jsx
│           ├── HistoryPanel.jsx
│           └── KnowledgePanel.jsx
│
├── server/                         # Node.js + Express API
│   ├── index.js
│   ├── routes/
│   │   ├── analyze.js
│   │   ├── history.js
│   │   └── knowledge.js
│   ├── services/
│   │   ├── riskRules.js
│   │   ├── signalEngine.js
│   │   ├── knowledgeBuilder.js
│   │   └── storage.js
│   └── data/
│       ├── cases.json
│       └── knowledge.json
│
├── package.json
└── README.md
```

---

## Run Locally

```bash
npm run install:all
npm run dev:server
npm run dev:client
```

The API runs on port `3001`. The Vite client runs on port `5173`.

Build the client with:

```bash
npm run build
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analyze` | Analyze supplied symptom information |
| GET | `/api/history` | Return stored cases, newest first |
| GET | `/api/knowledge` | Return the generated knowledge board |
| GET | `/api/health` | Server health check |

---

## Protection Rules

The New Hope architecture should continue to enforce these requirements as it grows:

1. Participation is voluntary and consent can be withdrawn.
2. Shelter locations and sensitive records are not exposed through public interfaces.
3. Access is role-based, logged, reviewable, and revocable.
4. AI does not secretly rank a person’s worthiness for safety.
5. Medical, legal, and child-safety decisions remain with qualified professionals.
6. Donations, sponsorship fees, product revenue, grants, and benefits are accounted for separately.
7. Complaints and appeals are handled outside the same person or system that made the disputed decision.

---

## Planned Modules

- Protected intake and consent manager
- Housing and referral navigator
- Transportation coordination
- Childcare and school-continuity workspace
- Benefits ledger and sponsor-funding dashboard
- Employment, education, and business-builder tools
- Secure document vault
- Provider and partner portal
- Women-led advisory and governance dashboard
- Voice input and accessibility tools
- Pattern clustering and carefully reviewed AI assistance

---

## Safety Notice

In an immediate emergency, call 911 or the appropriate local emergency number. Medical concerns should be reviewed by a qualified healthcare professional. This repository is open development software and does not establish that New Hope services are currently operating in any location.
