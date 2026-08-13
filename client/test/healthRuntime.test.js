import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzeLocally, analyzeSignal, loadCases, saveCase } from '../src/healthRuntime.js'

function memory(){let value=null;return{getItem:()=>value,setItem:(_k,v)=>{value=v}}}
test('urgent phrases receive an emergency-care action without claiming a diagnosis',()=>{const r=analyzeLocally({symptom:'sudden chest pain'});assert.equal(r.level,'urgent');assert.match(r.actions[0],/911/);assert.match(r.disclaimer,/not a diagnosis/i)})
test('GitHub Pages failure falls back to the on-device engine',async()=>{const r=await analyzeSignal({symptom:'dry mouth and dizzy'},async()=>{throw new Error('no api')});assert.equal(r.source,'on-device-pattern-engine');assert.equal(r.matches[0].id,'hydration')})
test('device history persists and reloads',()=>{const s=memory();saveCase({id:'1'},s);assert.equal(loadCases(s)[0].id,'1')})
