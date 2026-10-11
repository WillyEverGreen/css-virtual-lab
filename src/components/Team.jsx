import { Link } from 'react-router';
import { EXPERIMENTS_CONFIG } from '../shared/config/experiments';
import { DEFAULT_ROSTER } from '../shared/config/roster';

export default function Team() {
  const teams = DEFAULT_ROSTER.teams;

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#faf9f6' }}>
      {/* Header section */}
      <div className="section padding-none" style={{ borderBottom: '2px solid #000', background: '#fff' }}>
        <div className="container" style={{ padding: '40px 16px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#ffd166', border: '2px solid #000', borderRadius: '999px', padding: '6px 18px', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Academic Year 2026 • Fr. CRCE
          </div>
          <h1 className="heading-2" style={{ margin: '0 0 16px', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800 }}>
            Lab Teams &amp; Working Groups
          </h1>
          <p className="paragraph" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '16px', color: '#333' }}>
            Assigned student teams implementing interactive cryptographic simulations, vulnerability proofs, and validation suites.
          </p>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="section" style={{ padding: '36px 16px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: '24px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {teams.map((t, idx) => {
              const expConfig = EXPERIMENTS_CONFIG[t.slug];
              const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff'];
              const accentColor = colors[idx % colors.length];

              return (
                <div
                  key={t.slug}
                  style={{
                    background: '#fff',
                    border: '3px solid #000',
                    borderRadius: '16px',
                    boxShadow: '6px 6px 0px #000',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card Header */}
                  <div
                    style={{
                      background: accentColor,
                      borderBottom: '3px solid #000',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          background: '#fff',
                          border: '2px solid #000',
                          borderRadius: '6px',
                          padding: '2px 8px',
                          display: 'inline-block',
                          marginBottom: '6px',
                        }}
                      >
                        {expConfig ? expConfig.groupLabel : `Group ${idx + 1}`}
                      </span>
                      <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, wordBreak: 'break-word' }}>
                        {expConfig ? expConfig.title : t.slug.toUpperCase()}
                      </h2>
                    </div>
                    <Link
                      to={`/experiments/${t.slug}`}
                      style={{
                        background: '#000',
                        color: '#fff',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '2px solid #000',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexShrink: 0,
                      }}
                    >
                      Module &rarr;
                    </Link>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', marginBottom: '14px' }}>
                      Assigned Members ({t.members.length})
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                      {t.members.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            background: '#f8f9fa',
                            border: '2px solid #000',
                            borderRadius: '10px',
                            flexWrap: 'wrap',
                            gap: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {m.githubLogin ? (
                              <img
                                src={`https://avatars.githubusercontent.com/${m.githubLogin}?s=64`}
                                alt={m.name}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  border: '1.5px solid #000',
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: '#e2e8f0',
                                  border: '1.5px solid #000',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '13px',
                                  fontWeight: 700,
                                }}
                              >
                                {m.name.charAt(0)}
                              </div>
                            )}

                            <div>
                              <div style={{ fontWeight: 700, fontSize: '14px', lineHeight: 1.2 }}>
                                {m.name}
                              </div>
                              {m.githubLogin ? (
                                <a
                                  href={`https://github.com/${m.githubLogin}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    fontSize: '12px',
                                    color: '#0969da',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                  }}
                                >
                                  @{m.githubLogin}
                                </a>
                              ) : (
                                <span style={{ fontSize: '11px', color: '#e056fd', fontWeight: 600 }}>
                                  Pending handle
                                </span>
                              )}
                            </div>
                          </div>

                          {m.githubLogin ? (
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                background: '#dcfce7',
                                color: '#166534',
                                border: '1.5px solid #16a34a',
                                borderRadius: '6px',
                                padding: '2px 8px',
                              }}
                            >
                              Allowlisted
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                background: '#fef3c7',
                                color: '#92400e',
                                border: '1.5px solid #d97706',
                                borderRadius: '6px',
                                padding: '2px 8px',
                              }}
                            >
                              Missing ID
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
