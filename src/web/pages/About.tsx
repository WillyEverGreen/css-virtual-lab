import { Link } from 'react-router';

export default function About() {
  const compilationMembers = [
    { roll: '10714', name: 'Ulric Ivan Collaco' },
    { roll: '10707', name: 'Sai Dipak Balkawade', tag: 'Lead / @WillyEverGreen' },
    { roll: '10739', name: 'Abhishek Roy Jose' },
    { roll: '10728', name: 'Soah Alexio Fernandes' },
    { roll: '10748', name: 'Manthan Mahendra Pagaria' },
    { roll: '10755', name: 'Dev Dinesh Saroj' },
  ];

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
    <div style={{ minHeight: '100vh', background: '#faf9f6', paddingBottom: '80px' }}>
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

          {/* Compilation Team Section */}
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
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: '#caffbf',
                  border: '1.5px solid #000',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontWeight: 700,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Platform Compilation
              </div>
              <h2 style={{ margin: '0 0 10px', fontSize: '28px', fontWeight: 800 }}>
                Integration &amp; Architecture Team
              </h2>
              <p style={{ margin: '0 auto', maxWidth: '680px', fontSize: '15px', color: '#555', lineHeight: 1.6 }}>
                Appointed student engineers from TE Comp C responsible for the core application shell, navigation coordination, responsive brutalist theme, and experiment integration.
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
                    background: '#faf9f6',
                    border: '2px solid #000',
                    borderRadius: '10px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    boxShadow: '3px 3px 0px #000',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
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

          {/* Action Callout */}
          <div
            style={{
              background: '#18181b',
              color: '#fff',
              border: '3px solid #000',
              borderRadius: '16px',
              padding: '40px 24px',
              textAlign: 'center',
              boxShadow: '6px 6px 0px #ffd166',
            }}
          >
            <h2 style={{ margin: '0 0 12px', fontSize: '28px', fontWeight: 800, color: '#fff' }}>
              Ready to explore cryptographic algorithms?
            </h2>
            <p style={{ maxWidth: '620px', margin: '0 auto 28px', fontSize: '16px', color: '#d4d4d8', lineHeight: 1.6 }}>
              Test your knowledge across MD5, SHA-1, MAC, HMAC, and SSL/TLS with interactive simulations and live packet analyzers.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
              <Link
                to="/#experiments"
                style={{
                  background: '#ffd166',
                  color: '#000',
                  border: '2px solid #000',
                  borderRadius: '8px',
                  padding: '12px 28px',
                  fontWeight: 800,
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0px #fff',
                }}
              >
                Launch Experiments →
              </Link>
              <Link
                to="/instructions"
                style={{
                  background: '#fff',
                  color: '#000',
                  border: '2px solid #000',
                  borderRadius: '8px',
                  padding: '12px 28px',
                  fontWeight: 800,
                  fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0px #ffd166',
                }}
              >
                Read ISE Guidelines
              </Link>
              <Link
                to="/team"
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: '8px',
                  padding: '12px 28px',
                  fontWeight: 800,
                  fontSize: '15px',
                  textDecoration: 'none',
                }}
              >
                View Student Roster
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
