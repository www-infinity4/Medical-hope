import { useState } from 'react'
import SignalInput from './components/SignalInput.jsx'
import RiskCard from './components/RiskCard.jsx'
import HistoryPanel from './components/HistoryPanel.jsx'
import KnowledgePanel from './components/KnowledgePanel.jsx'
import './styles.css'
import './new-hope.css'

const services = [
  {
    title: 'Safe Path',
    description: 'Private safety planning, protected referrals, transportation coordination, and a clear route toward stable housing.',
    status: 'Protection module',
  },
  {
    title: 'Health Access',
    description: 'Health navigation, appointment preparation, pattern tracking, and connections to qualified medical professionals.',
    status: 'Health module',
  },
  {
    title: 'Children & Family',
    description: 'Childcare coordination, school continuity, family records, routines, and tools that reduce disruption during transition.',
    status: 'Family module',
  },
  {
    title: 'Housing & Stability',
    description: 'A structured path from immediate shelter needs to transitional housing, income planning, and long-term independence.',
    status: 'Stability module',
  },
  {
    title: 'Learning & Work',
    description: 'Education, skills, employment, business-building, and practical AI assistance designed around each woman’s goals.',
    status: 'Opportunity module',
  },
  {
    title: 'Infinity Benefits',
    description: 'An accountable benefits ledger for approved services, assistance credits, sponsor funding, and transparent disbursement.',
    status: 'Economic module',
  },
]

const flow = [
  ['Listen', 'A woman defines what support she needs and what information may be shared.'],
  ['Protect', 'The system separates sensitive records, location data, and access permissions.'],
  ['Coordinate', 'New Hope connects housing, health, family, transportation, education, and work services.'],
  ['Stabilize', 'Progress is tracked around the woman’s own plan rather than an institution’s convenience.'],
]

export default function App() {
  const [analysis, setAnalysis] = useState(null)
  const [rightTab, setRightTab] = useState('history')
  const [historyKey, setHistoryKey] = useState(0)

  const handleResult = (data) => {
    setAnalysis(data)
    setRightTab('history')
    setHistoryKey((key) => key + 1)
  }

  return (
    <div className="app">
      <div className="disclaimer-banner">
        <strong>Development platform:</strong>&nbsp;
        New Hope is a service architecture and working software project, not an emergency shelter or licensed medical provider.
        In an immediate emergency, call 911.
      </div>

      <header className="hope-nav">
        <div className="hope-nav-inner">
          <a className="hope-brand" href="#top" aria-label="New Hope home">
            <span className="hope-brand-mark" aria-hidden="true">NH</span>
            <span className="hope-brand-copy">
              <strong>New Hope</strong>
              <small>Protected by the Infinity backbone</small>
            </span>
          </a>

          <nav className="hope-nav-links" aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#backbone">Infinity backbone</a>
            <a href="#health">Health workspace</a>
            <a href="#governance">Governance</a>
            <a className="hope-nav-cta" href="#health">Open workspace</a>
          </nav>
        </div>
      </header>

      <main id="top" className="hope-main">
        <section className="hope-hero">
          <div>
            <p className="hope-eyebrow">New Hope · Powered by Infinity</p>
            <h1>
              A protected path forward
              <span className="hope-gradient-text">for women and children.</span>
            </h1>
            <p className="hope-hero-lead">
              New Hope is the mission-facing service network. Infinity is the shared technology, benefits,
              privacy, and coordination backbone that helps every support module work together without making
              women repeat their story at every doorway.
            </p>
            <div className="hope-hero-actions">
              <a className="hope-primary-btn" href="#services">Explore the service network</a>
              <a className="hope-secondary-btn" href="#backbone">See how Infinity connects it</a>
            </div>
            <p className="hope-hero-note">
              Built as a consent-based, privacy-first platform blueprint. No forced placement, hidden scoring, or unrestricted record sharing.
            </p>
          </div>

          <div className="hope-orbit-card" aria-label="New Hope service system illustration">
            <div className="hope-orbit-center">
              <div>
                <strong>New Hope</strong>
                <span>Women and children first</span>
              </div>
            </div>
            <div className="hope-orbit-node">
              <strong>Safety</strong>
              <span>Private planning</span>
            </div>
            <div className="hope-orbit-node">
              <strong>Health</strong>
              <span>Navigation and records</span>
            </div>
            <div className="hope-orbit-node">
              <strong>Family</strong>
              <span>Children and stability</span>
            </div>
            <div className="hope-orbit-node">
              <strong>Opportunity</strong>
              <span>Learning and income</span>
            </div>
          </div>
        </section>

        <section className="hope-proof-strip" aria-label="Platform principles">
          <div className="hope-proof-grid">
            <div className="hope-proof-item">
              <strong>Consent first</strong>
              <span>Women control participation and information sharing.</span>
            </div>
            <div className="hope-proof-item">
              <strong>Privacy by design</strong>
              <span>Protected records and role-based access from the start.</span>
            </div>
            <div className="hope-proof-item">
              <strong>One connected plan</strong>
              <span>Housing, health, family, and work support coordinate together.</span>
            </div>
            <div className="hope-proof-item">
              <strong>Accountable benefits</strong>
              <span>Every approved credit, payment, and sponsor contribution is traceable.</span>
            </div>
          </div>
        </section>

        <section id="services" className="hope-section">
          <div className="hope-section-head">
            <p className="hope-eyebrow">The New Hope network</p>
            <h2>Support should work like one system.</h2>
            <p>
              Each module can operate independently, but the Infinity backbone allows authorized services to
              coordinate around one protected plan. The woman remains the decision-maker throughout the process.
            </p>
          </div>

          <div className="hope-service-grid">
            {services.map((service, index) => (
              <article className="hope-service-card" key={service.title}>
                <div className="hope-service-index">0{index + 1}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span>{service.status}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="backbone" className="hope-section">
          <div className="hope-section-head">
            <p className="hope-eyebrow">Infinity architecture</p>
            <h2>New Hope carries the mission. Infinity carries the system.</h2>
            <p>
              Infinity provides reusable infrastructure that other approved organizations and developers can build
              on: identity, permissions, benefits, scheduling, communications, records, analytics, and service routing.
            </p>
          </div>

          <div className="hope-backbone">
            <article className="hope-backbone-card">
              <h3>Shared platform layers</h3>
              <p>
                The backbone is modular so New Hope can grow without placing every responsibility inside one application.
              </p>
              <div className="hope-layer-list">
                <div className="hope-layer">
                  <strong>Identity and consent</strong>
                  <span>Verified access, permission history, and revocable sharing.</span>
                </div>
                <div className="hope-layer">
                  <strong>Benefits and funding</strong>
                  <span>Donations, grants, sponsorship fees, product revenue, and restricted assistance credits.</span>
                </div>
                <div className="hope-layer">
                  <strong>Service coordination</strong>
                  <span>Appointments, referrals, transportation, housing, education, and follow-through.</span>
                </div>
                <div className="hope-layer">
                  <strong>Open building architecture</strong>
                  <span>Documented modules and interfaces that approved teams can extend safely.</span>
                </div>
              </div>
            </article>

            <article className="hope-flow-card" aria-label="New Hope support flow">
              {flow.map(([title, description], index) => (
                <div className="hope-flow-step" key={title}>
                  <div className="hope-flow-number">{index + 1}</div>
                  <div>
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </div>
                  <span className="hope-flow-status">Protected flow</span>
                </div>
              ))}
            </article>
          </div>
        </section>

        <section id="health" className="hope-health-shell">
          <div className="hope-health-head">
            <div>
              <p className="hope-eyebrow">Working module 01</p>
              <h2>Health Signal Workspace</h2>
              <p>
                The existing Infinity Signal Health application remains intact inside New Hope as an informational
                pattern-tracking workspace. It does not diagnose conditions or replace professional care.
              </p>
            </div>
            <span className="hope-module-badge">Interactive prototype</span>
          </div>

          <div className="main-layout">
            <section className="left-col">
              <SignalInput
                onResult={handleResult}
                onError={() => {}}
                onLoading={() => {}}
              />
              {analysis && <RiskCard analysis={analysis} />}
            </section>

            <section className="right-col">
              <div className="right-tabs">
                <button
                  className={`tab-btn ${rightTab === 'history' ? 'active' : ''}`}
                  onClick={() => setRightTab('history')}
                >
                  Signal History
                </button>
                <button
                  className={`tab-btn ${rightTab === 'knowledge' ? 'active' : ''}`}
                  onClick={() => setRightTab('knowledge')}
                >
                  Knowledge Base
                </button>
              </div>

              {rightTab === 'history' && <HistoryPanel key={historyKey} />}
              {rightTab === 'knowledge' && <KnowledgePanel />}
            </section>
          </div>
        </section>

        <section id="governance" className="hope-section">
          <div className="hope-section-head">
            <p className="hope-eyebrow">Protection and accountability</p>
            <h2>The platform must protect people from the system itself.</h2>
          </div>

          <div className="hope-governance">
            <article className="hope-governance-card">
              <h3>New Hope governance</h3>
              <ul>
                <li>Women-led program and product oversight.</li>
                <li>Survivor and parent advisory participation.</li>
                <li>Clear admission, privacy, complaint, and appeal procedures.</li>
                <li>Qualified professionals for medical, legal, and child-safety decisions.</li>
              </ul>
            </article>
            <article className="hope-governance-card">
              <h3>Infinity platform controls</h3>
              <ul>
                <li>Role-based access with auditable permission changes.</li>
                <li>No secret eligibility score or automatic denial of safety.</li>
                <li>Separated shelter-location and public-service information.</li>
                <li>Financial records that distinguish donations, sponsorship, sales, and benefits.</li>
              </ul>
            </article>
          </div>
        </section>
      </main>

      <footer className="hope-footer">
        <div className="hope-footer-inner">
          <div>
            <strong>New Hope</strong><br />
            A women-and-children protection platform powered by Infinity architecture.
          </div>
          <div>
            © {new Date().getFullYear()} New Hope / Infinity. Development prototype; not an emergency service or licensed provider.
          </div>
        </div>
      </footer>
    </div>
  )
}
