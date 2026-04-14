/**
 * storage.js
 *
 * Handles all reads/writes to the persistent JSON data files.
 * Handles missing files and malformed JSON gracefully.
 */

import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')
const CASES_FILE = join(DATA_DIR, 'cases.json')
const KNOWLEDGE_FILE = join(DATA_DIR, 'knowledge.json')

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

async function readJSON(filePath, fallback = []) {
  try {
    await ensureDataDir()
    if (!existsSync(filePath)) return fallback
    const raw = await readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

async function writeJSON(filePath, data) {
  await ensureDataDir()
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

// ── Cases ────────────────────────────────────────────────────────────────────

export async function readCases() {
  return readJSON(CASES_FILE, [])
}

/**
 * Save a new case.
 * @param {object} rawInput      - Original request body from the client
 * @param {object} structuredInput - Parsed / normalised fields
 * @param {object} analysisResult  - Output from signalEngine
 * @returns {object} The saved case record
 */
export async function saveCase(rawInput, structuredInput, analysisResult) {
  const cases = await readCases()

  const record = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    rawInput,
    structuredInput,
    analysisResult,
    tags: analysisResult.tags || []
  }

  cases.push(record)
  await writeJSON(CASES_FILE, cases)
  return record
}

// ── Knowledge ────────────────────────────────────────────────────────────────

export async function readKnowledge() {
  return readJSON(KNOWLEDGE_FILE, [])
}

export async function writeKnowledge(entries) {
  await writeJSON(KNOWLEDGE_FILE, entries)
}
