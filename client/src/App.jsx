import { useMemo, useState } from 'react'
import { analyzeSignal, loadCases, saveCase } from './healthRuntime.js'

const systems = [
  {id:'signals',short:'Signal',title:'Health Signal Workspace',copy:'Turn observations into a private, structured record that can help prepare a conversation with qualified care.',status:'OPERATING'},
  {id:'research',short:'Research',title:'Evidence Refinery',copy:'Separate proposed ideas, sourced evidence, simulations, experiments, and reproduced results before public claims are advanced.',status:'BUILD QUEUE'},
  {id:'bio',short:'Bio Lab',title:'Bio-Humanoid Prototype Lab',copy:'Route material, sensing, movement, safety, and body-system concepts through simulation and low-energy prototypes first.',status:'PROTOTYPE'},
  {id:'robot',short:'Robots',title:'Robot Production Studio',copy:'Readers, writers, designers, error memory, and production robots refine each project and prepare reviewable builds.',status:'SCANNING'}
]

const cards = [
  ['Pattern Reader','Find signals, numbers, contradictions, missing data, and recurring conditions.'],
  ['Evidence Auditor','Keep a theory from being presented as an established medical or scientific result.'],
  ['3D Systems Artist','Turn verified system relationships into dimensional models and interactive displays.'],
  ['Production Robot','Convert approved research into specifications, tests, prototypes, and draft pull requests.']
]

function LivingCore({active}) {
  return <div className={`core core-${active}`} aria-label="Interactive living systems model">
    <div className="core-halo halo-a"/><div className="core-halo halo-b"/>
    <div className="core-orbit orbit-a"><i/><i/><i/></div>
    <div className="core-orbit orbit-b"><i/><i/></div>
    <div className="core-center"><span>MH</span><small>{active.toUpperCase()}</small></div>
    <div className="core-grid"/>
  </div>
}

function SignalLab({onSaved}) {
  const [symptom,setSymptom]=useState('')
  const [hasPain,setPain]=useState(false)
  const [hasFever,setFever]=useState(false)
  const [busy,setBusy]=useState(false)
  const [result,setResult]=useState(null)
  async function run(){
    if(!symptom.trim()) return
    setBusy(true)
    const record=await analyzeSignal({symptom,hasPain,hasFever})
    const normalized=record.rawInput ? record : {...record,id:`case-${Date.now()}`,timestamp:new Date().toISOString(),rawInput:{symptom,hasPain,hasFever},level:record.riskLevel==='emergency'?'urgent':record.riskLevel==='high'?'attention':'observe',matches:(record.possibleCauses||[]).map(c=>({id:c.id,label:c.name,matched:c.matchedKeywords||[]})),actions:record.recommendedActions||[],source:record.source}
    setResult(normalized); saveCase(normalized); onSaved(); setBusy(false)
  }
  return <section className="signal-lab" id="signal-lab">
    <div className="section-kicker">WORKING MODULE 01</div><h2>Record a health signal.</h2>
    <p className="section-copy">Runs on the phone even when the optional server is unavailable. Entries remain on this device.</p>
    <textarea aria-label="Health observations" value={symptom} onChange={e=>setSymptom(e.target.value)} placeholder="Describe what you observed, when it started, and what changed…"/>
    <div className="check-row"><label><input type="checkbox" checked={hasPain} onChange={e=>setPain(e.target.checked)}/> Pain reported</label><label><input type="checkbox" checked={hasFever} onChange={e=>setFever(e.target.checked)}/> Fever reported</label></div>
    <button className="primary" disabled={!symptom.trim()||busy} onClick={run}>{busy?'Organizing…':'Organize signal'}</button>
    {result&&<article className={`result result-${result.level}`}><div className="result-top"><strong>{result.level==='urgent'?'Urgent warning pattern':'Informational pattern result'}</strong><span>{result.source==='connected-api'?'CONNECTED ENGINE':'ON-DEVICE ENGINE'}</span></div><p>{result.summary}</p><div className="match-list">{result.matches?.map(m=><span key={m.id}>{m.label}</span>)}</div><ol>{result.actions?.slice(0,4).map(a=><li key={a}>{a}</li>)}</ol><small>{result.disclaimer}</small></article>}
  </section>
}

function History({version}){
  const cases=useMemo(()=>loadCases(),[version])
  return <section className="history"><div><div className="section-kicker">PRIVATE DEVICE HISTORY</div><h2>{cases.length} recorded signal{cases.length===1?'':'s'}</h2></div>{cases.length===0?<p className="empty">No endless loading screen. Your first saved signal will appear here.</p>:<div className="history-grid">{cases.slice(0,6).map(c=><article key={c.id}><span>{c.level}</span><p>{c.rawInput?.symptom}</p><small>{new Date(c.timestamp).toLocaleString()}</small></article>)}</div>}</section>
}

export default function App(){
  const [active,setActive]=useState('signals'); const [historyVersion,setHistoryVersion]=useState(0); const current=systems.find(s=>s.id===active)
  return <div className="app">
    <div className="safety">INFORMATIONAL RESEARCH APP · NOT A DIAGNOSIS · CALL 911 FOR AN EMERGENCY</div>
    <header><a className="brand" href="#top"><b className="brand-mark">MH</b><span><strong>Medical Hope</strong><small>Living systems research app</small></span></a><nav><a href="#lab">Living Lab</a><a href="#signal-lab">Signal Workspace</a><a href="#robots">Robots</a></nav><a className="open" href="#signal-lab">Open app</a></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow">INFINITY-POWERED · APP-FIRST</div><h1>Medical research should feel <em>alive.</em></h1><p>A growing workspace where conversations become research robots, errors become reusable knowledge, and ideas move toward evidence, interactive models, and responsible prototypes.</p><div className="hero-actions"><a className="primary" href="#signal-lab">Use the working module</a><a className="secondary" href="#lab">Enter the living lab</a></div><div className="status-row"><span>Phone-ready</span><span>On-device fallback</span><span>Evidence states</span></div></div><LivingCore active={active}/></section>
      <section className="lab" id="lab"><div className="lab-nav">{systems.map(s=><button className={active===s.id?'active':''} onClick={()=>setActive(s.id)} key={s.id}>{s.short}</button>)}</div><div className="lab-display"><div><span className="lab-status">{current.status}</span><h2>{current.title}</h2><p>{current.copy}</p></div><div className="telemetry"><span>Reader sweep <b>100 minds</b></span><span>Repository reach <b>176 found</b></span><span>Claim state <b>guarded</b></span></div></div></section>
      <section className="robot-section" id="robots"><div className="section-kicker">ROBOT WORKFORCE</div><h2>Every pass makes the next build stronger.</h2><div className="robot-grid">{cards.map(([t,c],i)=><article key={t}><b>0{i+1}</b><h3>{t}</h3><p>{c}</p><span>READY FOR ROUTING</span></article>)}</div></section>
      <div className="workspace"><SignalLab onSaved={()=>setHistoryVersion(v=>v+1)}/><History version={historyVersion}/></div>
      <section className="proof"><div><div className="section-kicker">RESEARCH DISCIPLINE</div><h2>Build boldly. Label honestly.</h2></div><div className="proof-steps">{['Proposed idea','Evidence found','Simulated','Experimentally tested','Independently reproduced'].map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></section>
    </main>
    <footer><b>Medical Hope</b><span>Powered by Infinity architecture · development and informational software</span></footer>
    <nav className="mobile-dock"><a href="#top">Home</a><a href="#lab">Lab</a><a href="#signal-lab">Signal</a><a href="#robots">Robots</a></nav>
  </div>
}
