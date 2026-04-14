import express from 'express';
import cors from 'cors';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { analyzeSymptoms } from './symptomInterpreter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CASES_FILE = join(__dirname, 'data', 'cases.json');
const DATA_DIR = join(__dirname, 'data');

const app = express();
app.use(cors());
app.use(express.json());

async function readCases() {
  try {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
    if (!existsSync(CASES_FILE)) {
      await writeFile(CASES_FILE, '[]', 'utf8');
      return [];
    }
    const raw = await readFile(CASES_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveCases(cases) {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  await writeFile(CASES_FILE, JSON.stringify(cases, null, 2), 'utf8');
}

// POST /api/analyze
app.post('/api/analyze', async (req, res) => {
  const { symptom } = req.body;
  if (!symptom || typeof symptom !== 'string' || symptom.trim().length === 0) {
    return res.status(400).json({ error: 'A symptom description is required.' });
  }

  const result = analyzeSymptoms(symptom.trim());

  const newCase = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    symptom: symptom.trim(),
    ...result
  };

  const cases = await readCases();
  cases.push(newCase);
  await saveCases(cases);

  res.json(newCase);
});

// GET /api/cases
app.get('/api/cases', async (_req, res) => {
  const cases = await readCases();
  res.json([...cases].reverse());
});

// GET /api/knowledge
app.get('/api/knowledge', async (_req, res) => {
  const cases = await readCases();

  const topics = {
    kidney: {
      title: 'Kidney Health',
      description:
        'Kidney-related signals including flank pain, foamy urine, swelling, and reduced urination. Early detection is key to preventing chronic kidney disease.',
      symptoms: ['Back/flank pain', 'Foamy urine', 'Swollen ankles', 'Reduced urination', 'Side pain'],
      actions: ['Schedule kidney function tests', 'Monitor urine output', 'Reduce sodium', 'Stay hydrated'],
      tag: 'kidney_risk',
      caseCount: 0
    },
    hydration: {
      title: 'Hydration & Dehydration',
      description:
        'Dehydration is a common and often overlooked health signal. Dark urine, dry mouth, and dizziness are early warning signs.',
      symptoms: ['Dark urine', 'Dry mouth', 'Dizziness', 'Fatigue', 'Headache'],
      actions: ['Drink 8+ glasses of water daily', 'Use electrolyte drinks', 'Avoid excess caffeine'],
      tag: 'dehydration',
      caseCount: 0
    },
    urinary: {
      title: 'Urinary Health',
      description:
        'Urinary tract signals including frequency, urgency, and discomfort may indicate infections or bladder issues.',
      symptoms: ['Frequent urination', 'Urgency', 'Bladder discomfort', 'Incontinence', 'Cloudy urine'],
      actions: ['Stay hydrated', 'Consult a doctor if persistent', 'Avoid irritants like alcohol'],
      tag: 'urinary',
      caseCount: 0
    },
    infection: {
      title: 'Infection Signals',
      description:
        'Bacterial and viral infections manifest through fever, cloudy urine, discharge, and painful urination. Prompt treatment prevents complications.',
      symptoms: ['Fever', 'Cloudy urine', 'Burning sensation', 'Foul odor', 'Pus or discharge'],
      actions: ['Seek antibiotic treatment if bacterial', 'Rest and hydrate', 'Follow up with labs'],
      tag: 'infection',
      caseCount: 0
    },
    general: {
      title: 'General Health Signals',
      description:
        'General health concerns that do not fit a specific category. Monitoring trends over time can reveal patterns.',
      symptoms: ['Fatigue', 'General discomfort', 'Mild pain', 'Low energy', 'Sleep issues'],
      actions: ['Monitor symptoms', 'Consult a provider if persistent', 'Maintain healthy lifestyle'],
      tag: 'general',
      caseCount: 0
    }
  };


  const tagToTopic = {
    kidney_risk: 'kidney',
    dehydration: 'hydration',
    urinary: 'urinary',
    infection: 'infection',
    general: 'general',
    high_risk: 'general',
    emergency: 'general'
  };

  for (const c of cases) {
    for (const tag of (c.tags || [])) {
      const topicKey = tagToTopic[tag] || tag;
      if (topics[topicKey]) topics[topicKey].caseCount++;
    }
  }

  res.json(Object.values(topics));
});

// GET /api/health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Infinity Signal Health API', timestamp: new Date().toISOString() });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Infinity Signal Health server running on http://localhost:${PORT}`);
});
