import { Link } from 'react-router';
import Process from '../../components/Process.jsx';
import FinalCta from '../../components/FinalCta.jsx';

export default function About() {
  const pillars = [
    {
      title: 'Interactive Cryptanalysis',
      color: '#ffd166',
      icon: '⚡',
      desc: 'Moving beyond static equations. Students interact with living bitwise state machines, generate live collisions, simulate MitM attackers, and visually observe the Strict Avalanche Criterion (SAC).',
    },
    {
      title: '100% Client-Side Privacy',
      color: '#caffbf',
      icon: '🛡️',
      desc: 'All cryptographic hashing, message authentication, and TLS handshake operations execute exclusively in the client browser using the standard Web Crypto API and RFC bitwise logic.',
    },
    {
      title: 'Unified Retro Design System',
      color: '#9bf6ff',
      icon: '📐',
      desc: 'Engineered with high-contrast brutalist aesthetics, 2px ink borders, offset shadows, and responsive layouts to maintain strict visual and pedagogical uniformity across all modules.',
    },
    {
      title: 'Strict RFC Standards',
      color: '#ffadad',
      icon: '📜',
      desc: 'Every module is calibrated against formal international standards including RFC 1321 (MD5), RFC 3174 (SHA-1), RFC 2104 (HMAC), and RFC 8446 (TLS 1.3), verifying vectors on-demand.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6' }}>
      {/* Header Banner */}
      <div className="section padding-none" style={{ borderBottom: '2px solid #000', background: '#fff' }}>
        <div
          className="container"
          style={{
            padding: '56px 20px',
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
              display: 'inline-block',
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
            Academic Overview • Fr. CRCE
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
            About Fr. CRCE Crypto Lab
          </h1>
          <p
            className="paragraph text-center"
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              fontSize: '17px',
              color: '#333',
              lineHeight: 1.6,
              textAlign: 'center',
            }}
          >
            Built by students of the <strong>Department of Computer Engineering (TE Comp C, July 2026)</strong> at Fr. Conceicao Rodrigues College of Engineering as an interactive platform for learning modern cryptography concepts through real simulation, vulnerability testing, and code validation.
          </p>
        </div>
      </div>

      {/* Mission & Overview */}
      <div className="section" style={{ padding: '56px 20px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              background: '#fff',
              border: '3px solid #000',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '6px 6px 0px #000',
              marginBottom: '48px',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: '#e0aaff',
                border: '1.5px solid #000',
                borderRadius: '6px',
                padding: '4px 12px',
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              Academic Mission
            </div>
            <h2 style={{ margin: '0 0 16px', fontSize: '28px', fontWeight: 800 }}>
              Bridging Cryptographic Theory with Tangible Code
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#333', margin: '0 0 16px' }}>
              Cryptographic Security Systems (CSS) is often taught as an abstract sequence of mathematical proofs, modular arithmetic, and block diagrams. The <strong>Fr. CRCE Virtual Cryptography Laboratory</strong> transforms theoretical study into dynamic, exploratory practice.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#333', margin: 0 }}>
              Students observe the inner mechanics of algorithms: stepping through the 64 operations of MD5, watching the 80 rounds of SHA-1 compress data, manipulating secret keys in HMAC to observe the avalanche effect, and tracing the cryptographic handshakes of TLS 1.3 packet-by-packet.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 className="heading-2 text-center" style={{ margin: '0 0 10px', fontSize: '30px' }}>
              Four Engineering Pillars
            </h2>
            <p className="paragraph text-center" style={{ maxWidth: '640px', margin: '0 auto', color: '#555' }}>
              The architectural principles driving the virtual laboratory platform.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              marginBottom: '56px',
            }}
          >
            {pillars.map((p, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
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
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    background: p.color,
                    border: '2px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    marginBottom: '16px',
                    boxShadow: '2px 2px 0px #000',
                  }}
                >
                  {p.icon}
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 800 }}>
                  {p.title}
                </h3>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#555' }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Webflow Process & FinalCta Components */}
      <Process />
      <FinalCta />
    </div>
  );
}
