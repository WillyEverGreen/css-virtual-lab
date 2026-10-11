import Process from '../../components/Process.jsx';
import Pricing from '../../components/Pricing.jsx';
import FinalCta from '../../components/FinalCta.jsx';

export default function Instructions() {
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

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6' }}>
      {/* Header Banner */}
      <div className="section padding-none" style={{ borderBottom: '2px solid #000', background: '#fff' }}>
        <div
          className="container"
          style={{
            padding: '52px 20px',
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
            Academic ISE Guidelines : July 2026
          </div>
          <h1
            className="heading-2 text-center"
            style={{
              margin: '0 0 16px',
              fontSize: 'clamp(30px, 4.2vw, 46px)',
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
            Official academic guidelines, development lifecycle, and technical specifications for the <strong>Cryptographic Security Systems (CSS)</strong> Theory In-Semester Evaluation at Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE, TE Comp C).
          </p>
        </div>
      </div>

      {/* Webflow Process Component: 3-Stage Lifecycle */}
      <Process />

      {/* 13 Guidelines Section */}
      <div className="section" style={{ padding: '48px 20px', background: '#fff', borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
              Statutory Guidelines
            </div>
            <h2 className="heading-2 text-center" style={{ margin: '0 0 10px', fontSize: '32px' }}>
              13 Official ISE Guidelines
            </h2>
            <p className="paragraph text-center" style={{ maxWidth: '680px', margin: '0 auto', color: '#555' }}>
              Every student group must comply with all 13 specifications laid down by the faculty for the July 2026 evaluation.
            </p>
          </div>

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
                  background: '#faf9f6',
                  border: '2px solid #000',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '4px 4px 0px #000',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
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
                      fontSize: '15px',
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
                      background: '#fff',
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
                    margin: '0 0 8px',
                    fontSize: '17px',
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

      {/* Webflow Pricing & Contract Component */}
      <Pricing />

      {/* Webflow Final CTA */}
      <FinalCta />
    </div>
  );
}
