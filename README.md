# ∞ Infinity Signal Health

> **Self-evolving AI-powered health signal detection platform.**
> Pattern aggregation & rule-improvement scaffolding — *not a diagnostic tool.*

---

## ⚠️ Safety Disclaimer

**This platform is for informational and educational purposes only.**
It does **not** provide medical advice, diagnosis, or treatment.
All outputs describe *possible patterns and risk signals* based on keyword matching — they are not clinical assessments.

> If you are experiencing a medical emergency, call **911** or your local emergency number immediately.
> Always consult a qualified healthcare professional for any medical concern.

---

## What It Does

Infinity Signal Health is a **pre-diagnosis intelligence layer** that:

1. **Accepts health signal inputs** — symptom text plus optional structured fields (duration, age group, hydration level, pain, fever)
2. **Classifies signals** using a weighted rules engine (replaceable by ML later) into possible causes with confidence scores
3. **Assigns a risk level** — `low`, `medium`, `high`, or `emergency`
4. **Recommends actions** — drink water, see a doctor, call 911, etc.
5. **Stores every case** and builds a continuously-evolving knowledge base from accumulated patterns
6. **Surfaces trends** — most common symptoms, recurring tags, highest-risk recent patterns

---

## Current Features

| Layer | Feature |
|---|---|
| Intake | Free-text symptom input + optional structured fields |
| Analysis | Weighted rules engine (riskRules.js) |
| Risk levels | low / medium / high / emergency |
| Causes | UTI, Dehydration, Kidney Stress, Diabetes Warning, Respiratory, Emergency |
| Actions | Ranked, actionable suggestions per cause |
| Safety | Always-visible disclaimer; emergency escalation alert |
| Storage | Every case persisted to `server/data/cases.json` |
| Knowledge | Auto-generated evolving topic cards from case patterns |
| History | Clickable, expandable case history newest-first |
| Improvement loop | Knowledge rebuilt from all cases on every server start |

---

## Architecture

```
infinity-signal-health/
├── client/                     # React + Vite frontend (port 5173)
│   └── src/
│       ├── App.jsx             # Two-column layout wiring
│       ├── styles.css          # Dark theme design system
│       ├── main.jsx
│       └── components/
│           ├── SignalInput.jsx     # Intake form (text + optional fields)
│           ├── RiskCard.jsx        # Analysis results display
│           ├── HistoryPanel.jsx    # Case history list (expandable)
│           └── KnowledgePanel.jsx  # Living knowledge board
│
├── server/                     # Node.js + Express API (port 3001)
│   ├── index.js                # App entry — starts improvement loop on boot
│   ├── routes/
│   │   ├── analyze.js          # POST /api/analyze
│   │   ├── history.js          # GET  /api/history
│   │   └── knowledge.js        # GET  /api/knowledge
│   ├── services/
│   │   ├── riskRules.js        # Rules with weighted keyword matching
│   │   ├── signalEngine.js     # Core analysis logic (AI-replaceable)
│   │   ├── knowledgeBuilder.js # Scans cases → generates knowledge.json
│   │   └── storage.js          # JSON file I/O (cases + knowledge)
│   └── data/
│       ├── cases.json          # Persisted case records
│       └── knowledge.json      # Auto-generated knowledge base
│
├── package.json                # Root workspace
└── README.md
```

---

## How to Run

### 1. Install dependencies

```bash
npm run install:all
# or manually:
cd server && npm install
cd ../client && npm install
```

### 2. Start the backend (Terminal 1)

```bash
cd server && npm run dev
# Server runs at http://localhost:3001
```

### 3. Start the frontend (Terminal 2)

```bash
cd client && npm run dev
# App runs at http://localhost:5173
```

### 4. Open the app

Navigate to **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analyze` | Analyze symptom text + optional fields |
| GET | `/api/history` | All stored cases, newest first |
| GET | `/api/knowledge` | Auto-generated knowledge base |
| GET | `/api/health` | Health check |

### POST `/api/analyze` — Request body

```json
{
  "symptom": "cloudy urine with bad smell, dizzy",
  "duration": "2 days",
  "ageGroup": "adult",
  "hydrationLevel": "low",
  "hasPain": false,
  "hasFever": false
}
```

### POST `/api/analyze` — Response

```json
{
  "id": "uuid",
  "timestamp": "ISO string",
  "summary": "Most likely concern is Dehydration (medium risk).",
  "possibleCauses": [
    { "id": "dehydration", "name": "Dehydration", "confidence": 60 },
    { "id": "uti", "name": "Urinary Tract Infection (UTI)", "confidence": 45 }
  ],
  "riskLevel": "medium",
  "recommendedActions": ["Drink at least 8 glasses of water daily", "..."],
  "emergencyFlags": [],
  "tags": ["dehydration", "uti"],
  "isEmergency": false,
  "disclaimer": "This is not medical advice..."
}
```

---

## Continuous Improvement Loop

On every server start, `knowledgeBuilder.js`:
1. Reads all stored cases
2. Counts tag/cause frequencies
3. Builds enriched topic entries with real case counts
4. Saves to `knowledge.json`

On every new analysis:
- Case is saved to `cases.json`
- Knowledge base is rebuilt asynchronously in the background

This means the platform **automatically improves its knowledge base** the more it is used — without any manual intervention.

---

## Planned Future Modules

The codebase is structured so these can be added cleanly:

- [ ] **Image analysis module** — urine colour detection from photos
- [ ] **Voice input** — Web Speech API integration
- [ ] **Hydration tracker** — daily fluid intake logging
- [ ] **Medication reminder** — scheduled reminders
- [ ] **Pattern clustering** — group similar cases for richer knowledge
- [ ] **AI model integration** — swap `signalEngine.js` for an LLM call

---

## License

Open source — educational use only. See disclaimer above.
