import { useState } from 'react';
import { Link } from 'react-router';

export default function Instructions() {
  const [activeTab, setActiveTab] = useState<'guidelines' | 'rubrics' | 'template' | 'team'>('guidelines');

  const guidelines = [
    {
      id: '01',
      title: 'Group Formation',
      tag: 'Team Structure',
      color: '#ffd166',
      desc: 'Students shall work in collaborative groups of 2 to 3 members each. Group composition is verified across git commit author signatures and the official laboratory roster.',
    },
    {
      id: '02',
      title: 'Meaningful Contribution',
      tag: 'Individual Accountability',
      color: '#ffadad',
      desc: 'All members of the group are expected to contribute meaningfully to the architecture, frontend implementation, simulation logic, and documentation of the virtual lab.',
    },
    {
      id: '03',
      title: 'Faculty Experiment Allotment',
      tag: 'Academic Allocation',
      color: '#caffbf',
      desc: 'Laboratory experiments are formally allotted to groups by the faculty. Each team works strictly on their assigned cryptographic primitive or security protocol specification.',
    },
    {
      id: '04',
      title: 'Complete Module Development',
      tag: 'End-to-End Scope',
      color: '#9bf6ff',
      desc: 'Each group shall develop the complete virtual lab for their assigned experiment, including pedagogical theory, mathematical computation, interactive visualizers, and assessment quizzes.',
    },
    {
      id: '05',
      title: 'Unified Front-End Tooling',
      tag: 'Technology Stack',
      color: '#fdffb6',
      desc: 'All groups shall use the same front-end software and toolchain for developing the virtual labs (Vanilla HTML5, CSS3, modern Web APIs, and client-side JavaScript) to ensure seamless compilation.',
    },
    {
      id: '06',
      title: 'Uniform Design System & Theme',
      tag: 'Design Contract',
      color: '#e0aaff',
      desc: 'A common user interface, layout, colour scheme, and retro-academic brutalist theme must be strictly followed by all groups to maintain visual and functional uniformity across the virtual laboratory.',
    },
    {
      id: '07',
      title: '7 Mandatory Module Sections',
      tag: 'Content Architecture',
      color: '#ffd166',
      desc: 'Each virtual lab module must, as applicable, include: (a) Aim and objectives, (b) Relevant theoretical concepts, (c) Step-by-step procedure, (d) Interactive simulation/implementation, (e) Assessment/quiz, (f) References, (g) Feedback.',
    },
    {
      id: '08',
      title: 'Intuitive & User-Friendly UX',
      tag: 'Interaction Design',
      color: '#caffbf',
      desc: 'The interface should be simple, intuitive, interactive, and user-friendly. Visual cues, step-by-step guides, and clear typography must guide students effortlessly through complex cryptographic mechanics.',
    },
    {
      id: '09',
      title: 'Consistent Navigation & Terminology',
      tag: 'Standardization',
      color: '#9bf6ff',
      desc: 'Navigation structure, naming conventions, and cryptographic terminology must be consistent across all experiments. Modules coordinate with the master navigation bar via standard messaging protocols.',
    },
    {
      id: '10',
      title: 'Dynamic Interactive Simulation',
      tag: 'Active Learning',
      color: '#ffadad',
      desc: 'The virtual lab must incorporate dynamic interactive elements and live computation. Modules must not merely display static text or pre-rendered images; calculations must respond to student input.',
    },
    {
      id: '11',
      title: 'Pre-Submission Verification',
      tag: 'Quality Assurance',
      color: '#ffd166',
      desc: 'Students should rigorously test and verify the mathematical and operational correctness of the virtual experiment against official RFC test vectors and test cases before submission.',
    },
    {
      id: '12',
      title: 'Faculty Demonstration',
      tag: 'Evaluation Milestones',
      color: '#caffbf',
      desc: 'Groups shall demonstrate their working virtual lab to the faculty as per the official schedule communicated by the department. All members must be prepared to defend technical implementation decisions.',
    },
    {
      id: '13',
      title: 'Comprehensive Documentation',
      tag: 'Deliverables',
      color: '#e0aaff',
      desc: 'Each group shall submit complete technical documentation, including algorithm flowcharts, RFC specifications, test vectors, expected outputs, quiz keys, and an integration README along with the code.',
    },
  ];

  const rubrics = [
    {
      criterion: '1. Experiment Content & Accuracy',
      weight: 'Content Structure & Rigor',
      t4: 'Content is complete, accurate, well-structured, and comprehensively covers objective, theory, procedure, observations, and results. Zero significant errors.',
      t3: 'Content is mostly complete and accurate with minor omissions or slight cosmetic errors.',
      t2: 'Basic content is provided but has noticeable gaps, missing sections, or minor theoretical inaccuracies.',
      t1: 'Content is incomplete, poorly organized, lacks essential sections, or contains significant technical errors.',
    },
    {
      criterion: '2. Functionality & Working',
      weight: 'Engine & Algorithm Logic',
      t4: 'Virtual lab works flawlessly; all inputs, cryptographic processes, outputs, controls, and experimental steps execute with mathematical precision.',
      t3: 'Virtual lab works correctly with minor functional issues or edge cases that do not significantly affect the experiment.',
      t2: 'Basic functionality is available, but some features, calculation steps, or interactive controls fail or freeze.',
      t1: 'Major functionality is missing, calculations produce incorrect output, or the virtual lab fails to execute.',
    },
    {
      criterion: '3. Interactivity & Simulation',
      weight: 'Engagement & Dynamic Visuals',
      t4: 'Highly interactive and provides realistic simulation; user inputs produce appropriate dynamic responses, meaningful visual feedback, and real-time state mutation.',
      t3: 'Good level of interaction and simulation with appropriate responses and clear state transitions for most user inputs.',
      t2: 'Limited interaction; simulation represents only superficial aspects of the experiment with restricted user control.',
      t1: 'Minimal or no interaction; largely static content with little or no meaningful real-time simulation.',
    },
    {
      criterion: '4. Presentation & Demonstration',
      weight: 'Technical Defense & Viva',
      t4: 'Demonstration is clear, systematic, confident, and technically sound. Students explain mathematical working effectively and answer faculty questions accurately.',
      t3: 'Demonstration is clear and well-organized; students explain most aspects correctly and answer core technical questions.',
      t2: 'Demonstration covers basic working but lacks technical depth or clarity; answers to viva questions are partially correct.',
      t1: 'Demonstration is unclear or incomplete; students have limited understanding and are unable to explain their codebase.',
    },
    {
      criterion: '5. Individual Contribution',
      weight: 'Teamwork & Code Ownership',
      t4: 'Student demonstrates excellent mastery of their assigned component, makes significant code contributions, and independently handles technical queries.',
      t3: 'Student has good understanding and identifiable contributions; can explain most of their assigned codebase.',
      t2: 'Student has limited understanding or superficial contribution; requires teammates’ assistance to explain work.',
      t1: 'Student demonstrates little or no understanding, negligible contribution, or cannot explain any aspect of the project.',
    },
  ];

  const compilationMembers = [
    { roll: '10714', name: 'Ulric Ivan Collaco' },
    { roll: '10707', name: 'Sai Dipak Balkawade', tag: 'Lead / @WillyEverGreen' },
    { roll: '10739', name: 'Abhishek Roy Jose' },
    { roll: '10728', name: 'Soah Alexio Fernandes' },
    { roll: '10748', name: 'Manthan Mahendra Pagaria' },
    { roll: '10755', name: 'Dev Dinesh Saroj' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div className="section padding-none" style={{ borderBottom: '2px solid #000', background: '#fff' }}>
        <div
          className="container"
          style={{
            padding: '48px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffd166',
              border: '2px solid #000',
              borderRadius: '999px',
              padding: '6px 18px',
              fontWeight: 700,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px',
            }}
          >
            TE Comp C • CSS TH ISE • July 2026
          </div>
          <h1
            className="heading-2 text-center"
            style={{
              margin: '0 0 16px',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: 1.15,
            }}
          >
            Virtual Lab Development Instructions
          </h1>
          <p
            className="paragraph text-center"
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              fontSize: '16px',
              color: '#333',
              lineHeight: 1.6,
              textAlign: 'center',
            }}
          >
            Official academic instructions, development guidelines, evaluation rubrics, and integration standards for the <strong>Cryptographic Security Systems (CSS)</strong> Theory In-Semester Evaluation at Fr. Conceicao Rodrigues College of Engineering.
          </p>

          {/* Quick tab switcher */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '32px',
            }}
          >
            {[
              { id: 'guidelines', label: '1. Guidelines (1-13)', color: '#ffd166' },
              { id: 'rubrics', label: '2. Evaluation Rubrics', color: '#ffadad' },
              { id: 'template', label: '3. Module Template', color: '#caffbf' },
              { id: 'team', label: '4. Integration Team', color: '#9bf6ff' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    background: active ? tab.color : '#fff',
                    border: '2px solid #000',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: active ? '3px 3px 0px #000' : 'none',
                    transform: active ? 'translate(-1px, -1px)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 1: GUIDELINES */}
      {(activeTab === 'guidelines' || activeTab === 'all') && (
        <div className="section" style={{ padding: '48px 20px' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: '#fdffb6',
                  border: '2px solid #000',
                  borderRadius: '999px',
                  padding: '4px 14px',
                  fontWeight: 700,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Statutory Code of Conduct
              </div>
              <h2 className="heading-2 text-center" style={{ margin: '0 0 12px', fontSize: '32px' }}>
                13 Official Development Guidelines
              </h2>
              <p className="paragraph text-center" style={{ maxWidth: '680px', margin: '0 auto', color: '#555' }}>
                Every student group must comply with all 13 specifications laid down by the faculty for the July 2026 ISE.
              </p>
            </div>

            {/* 13 guidelines in grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '20px',
              }}
            >
              {guidelines.map((g) => (
                <div
                  key={g.id}
                  style={{
                    background: '#fff',
                    border: '2px solid #000',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '4px 4px 0px #000',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: g.color,
                        border: '2px solid #000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '16px',
                        boxShadow: '2px 2px 0px #000',
                      }}
                    >
                      {g.id}
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        background: '#f1f5f9',
                        border: '1.5px solid #000',
                        borderRadius: '6px',
                        padding: '2px 8px',
                      }}
                    >
                      {g.tag}
                    </span>
                  </div>
                  <h3
                    style={{
                      margin: '0 0 10px',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#000',
                    }}
                  >
                    {g.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      lineHeight: 1.55,
                      color: '#444',
                    }}
                  >
                    {g.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: RUBRICS */}
      {(activeTab === 'rubrics' || activeTab === 'all') && (
        <div className="section" style={{ padding: '48px 20px', background: '#fff', borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: '#ffadad',
                  border: '2px solid #000',
                  borderRadius: '999px',
                  padding: '4px 14px',
                  fontWeight: 700,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Grading Criteria
              </div>
              <h2 className="heading-2 text-center" style={{ margin: '0 0 12px', fontSize: '32px' }}>
                Rubrics for Evaluation
              </h2>
              <p className="paragraph text-center" style={{ maxWidth: '700px', margin: '0 auto', color: '#555' }}>
                Projects are rigorously evaluated on a 4-tier scale (4: Excellent, 3: Good, 2: Satisfactory, 1: Needs Improvement) across 5 core dimensions.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {rubrics.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: '#faf9f6',
                    border: '2px solid #000',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '4px 4px 0px #000',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      marginBottom: '18px',
                      borderBottom: '2px solid #000',
                      paddingBottom: '12px',
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>
                      {r.criterion}
                    </h3>
                    <span
                      style={{
                        background: '#ffd166',
                        border: '1.5px solid #000',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {r.weight}
                    </span>
                  </div>

                  {/* 4 tiers grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {/* Tier 4 */}
                    <div
                      style={{
                        background: '#dcfce7',
                        border: '1.5px solid #16a34a',
                        borderRadius: '8px',
                        padding: '14px',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: '13px',
                          color: '#166534',
                          textTransform: 'uppercase',
                          marginBottom: '6px',
                        }}
                      >
                        4 — Excellent
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: '#14532d' }}>
                        {r.t4}
                      </p>
                    </div>

                    {/* Tier 3 */}
                    <div
                      style={{
                        background: '#e0f2fe',
                        border: '1.5px solid #0284c7',
                        borderRadius: '8px',
                        padding: '14px',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: '13px',
                          color: '#075985',
                          textTransform: 'uppercase',
                          marginBottom: '6px',
                        }}
                      >
                        3 — Good
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: '#0c4a6e' }}>
                        {r.t3}
                      </p>
                    </div>

                    {/* Tier 2 */}
                    <div
                      style={{
                        background: '#fef3c7',
                        border: '1.5px solid #d97706',
                        borderRadius: '8px',
                        padding: '14px',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: '13px',
                          color: '#92400e',
                          textTransform: 'uppercase',
                          marginBottom: '6px',
                        }}
                      >
                        2 — Satisfactory
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: '#78350f' }}>
                        {r.t2}
                      </p>
                    </div>

                    {/* Tier 1 */}
                    <div
                      style={{
                        background: '#fee2e2',
                        border: '1.5px solid #dc2626',
                        borderRadius: '8px',
                        padding: '14px',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: '13px',
                          color: '#991b1b',
                          textTransform: 'uppercase',
                          marginBottom: '6px',
                        }}
                      >
                        1 — Needs Improvement
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: '#7f1d1d' }}>
                        {r.t1}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: MODULE TEMPLATE & ARCHITECTURE */}
      {(activeTab === 'template' || activeTab === 'all') && (
        <div className="section" style={{ padding: '48px 20px' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: '#caffbf',
                  border: '2px solid #000',
                  borderRadius: '999px',
                  padding: '4px 14px',
                  fontWeight: 700,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Standard Architecture
              </div>
              <h2 className="heading-2 text-center" style={{ margin: '0 0 12px', fontSize: '32px' }}>
                Module Repository &amp; File Specifications
              </h2>
              <p className="paragraph text-center" style={{ maxWidth: '720px', margin: '0 auto', color: '#555' }}>
                Each group develops its assigned cryptography experiment as an independent, self-contained web module using the uniform folder structure.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Card 1: Tree */}
              <div
                style={{
                  background: '#fff',
                  border: '2px solid #000',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '4px 4px 0px #000',
                }}
              >
                <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800 }}>
                  📁 Group Repository Structure
                </h3>
                <pre
                  style={{
                    background: '#18181b',
                    color: '#f4f4f5',
                    padding: '18px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    lineHeight: 1.6,
                    overflowX: 'auto',
                    border: '1.5px solid #000',
                  }}
                >
{`experiment-template/
├── index.html       # Module markup & visual layout
├── style.css        # Retro-academic brutalist CSS
├── script.js        # Dynamic computation & simulator
└── README.md        # Technical specification & authors`}
                </pre>
                <div style={{ marginTop: '16px', fontSize: '13px', lineHeight: 1.5, color: '#555' }}>
                  <strong>Key Rule:</strong> The module must be completely self-contained. It must not modify the parent shell or other experiments, and should run cleanly inside an isolated iframe.
                </div>
              </div>

              {/* Card 2: Integration README spec */}
              <div
                style={{
                  background: '#fff',
                  border: '2px solid #000',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '4px 4px 0px #000',
                }}
              >
                <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800 }}>
                  📝 Integration README Spec (Sample)
                </h3>
                <div
                  style={{
                    background: '#faf9f6',
                    border: '1.5px solid #000',
                    borderRadius: '8px',
                    padding: '16px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                  }}
                >
                  <div><strong>Group:</strong> MD5</div>
                  <div><strong>Experiment ID:</strong> EXP01</div>
                  <div><strong>Experiment Name:</strong> MD5 Hash Algorithm</div>
                  <div><strong>Folder:</strong> <code>/experiments/md5/</code></div>
                  <div><strong>Entry File:</strong> <code>index.html</code></div>
                  <div><strong>Navigation Title:</strong> MD5 Hash Algorithm</div>
                  <div><strong>Required Libraries:</strong> None (Web Crypto / Native JS)</div>
                  <div><strong>Input:</strong> Plaintext Message</div>
                  <div><strong>Output:</strong> 128-bit MD5 Digest &amp; SAC Avalanche Diff</div>
                  <div><strong>Navigation Link:</strong> <code>/experiments/md5/</code></div>
                </div>
              </div>

              {/* Card 3: Git Branching */}
              <div
                style={{
                  background: '#fff',
                  border: '2px solid #000',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '4px 4px 0px #000',
                }}
              >
                <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800 }}>
                  🌿 Git Branching &amp; Submission
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#444', margin: '0 0 12px' }}>
                  Use GitHub from day one. Each group submits their completed module through dedicated branches and pull requests into <code>main</code>:
                </p>
                <pre
                  style={{
                    background: '#18181b',
                    color: '#f4f4f5',
                    padding: '14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    lineHeight: 1.5,
                    overflowX: 'auto',
                    border: '1.5px solid #000',
                  }}
                >
{`main (Integration Shell)
├── group-md5
├── group-sha1
├── group-mac
├── group-hmac
└── group-ssl-tls`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: INTEGRATION TEAM & COMPILATION ROSTER */}
      {(activeTab === 'team' || activeTab === 'all') && (
        <div className="section" style={{ padding: '48px 20px', background: '#fff', borderTop: '2px solid #000' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: '#9bf6ff',
                  border: '2px solid #000',
                  borderRadius: '999px',
                  padding: '4px 14px',
                  fontWeight: 700,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Compilation &amp; Integration
              </div>
              <h2 className="heading-2 text-center" style={{ margin: '0 0 12px', fontSize: '32px' }}>
                Division of Responsibilities
              </h2>
              <p className="paragraph text-center" style={{ maxWidth: '720px', margin: '0 auto', color: '#555' }}>
                Clear operational boundary between the Integration Team and individual Student Experiment Groups.
              </p>
            </div>

            {/* Split cards: Integration vs Groups */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
                marginBottom: '48px',
              }}
            >
              {/* Integration Team WILL */}
              <div
                style={{
                  background: '#f0fdf4',
                  border: '2px solid #16a34a',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '4px 4px 0px #16a34a',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#16a34a',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                    }}
                  >
                    ✓
                  </div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#166534' }}>
                    Integration Team WILL Develop:
                  </h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.7, color: '#14532d' }}>
                  <li>Home page &amp; interactive portal</li>
                  <li>Experiment catalog &amp; card showcase</li>
                  <li>Master Navigation bar with dead-center branding</li>
                  <li>Common retro-academic brutalist CSS design tokens</li>
                  <li>Routing &amp; seamless iframe container communication</li>
                  <li>About Virtual Lab &amp; Instructions pages</li>
                  <li>Common assessment/evaluation framework</li>
                  <li>Linking and testing all independent experiment modules</li>
                </ul>
              </div>

              {/* Integration Team WILL NOT */}
              <div
                style={{
                  background: '#fef2f2',
                  border: '2px solid #dc2626',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '4px 4px 0px #dc2626',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#dc2626',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                    }}
                  >
                    ✗
                  </div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#991b1b' }}>
                    Integration Team WILL NOT Develop:
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: '#7f1d1d', margin: '0 0 12px' }}>
                  Core cryptographic primitives belong strictly to the respective student research groups:
                </p>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.7, color: '#7f1d1d' }}>
                  <li>MD5 message digest algorithm &amp; round functions</li>
                  <li>SHA-1 80-round state machine &amp; compression logic</li>
                  <li>MAC generation &amp; in-transit tampering simulator</li>
                  <li>HMAC key-pad hashing &amp; avalanche evaluator</li>
                  <li>SSL/TLS 1.2 vs 1.3 handshake state machines</li>
                  <li>Kerberos &amp; Needham-Schroeder protocol models</li>
                  <li>RSA digital signature mathematics</li>
                </ul>
              </div>
            </div>

            {/* Official Compilation Team Members */}
            <div
              style={{
                background: '#faf9f6',
                border: '2px solid #000',
                borderRadius: '14px',
                padding: '28px',
                boxShadow: '4px 4px 0px #000',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800 }}>
                  🏛️ Fr. CRCE Compilation Team (TE Comp C)
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
                  The 6 appointed student engineers responsible for repository architecture, integration, and platform deployment:
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                }}
              >
                {compilationMembers.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#fff',
                      border: '2px solid #000',
                      borderRadius: '8px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      boxShadow: '2px 2px 0px #000',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '8px',
                        background: '#ffd166',
                        border: '1.5px solid #000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '15px',
                      }}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: '#000' }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                        Roll No: <strong>{m.roll}</strong>
                      </div>
                      {m.tag && (
                        <div
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            background: '#dcfce7',
                            color: '#166534',
                            border: '1px solid #16a34a',
                            borderRadius: '4px',
                            padding: '1px 6px',
                            display: 'inline-block',
                            marginTop: '4px',
                          }}
                        >
                          {m.tag}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links to Dash or Experiments */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link
                to="/#experiments"
                style={{
                  display: 'inline-block',
                  background: '#000',
                  color: '#fff',
                  border: '2px solid #000',
                  borderRadius: '8px',
                  padding: '12px 28px',
                  fontWeight: 700,
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '4px 4px 0px #ffd166',
                  marginRight: '12px',
                }}
              >
                Explore Active Experiments →
              </Link>
              <Link
                to="/team"
                style={{
                  display: 'inline-block',
                  background: '#fff',
                  color: '#000',
                  border: '2px solid #000',
                  borderRadius: '8px',
                  padding: '12px 28px',
                  fontWeight: 700,
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '4px 4px 0px #000',
                }}
              >
                View Full Team Roster
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
