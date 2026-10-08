import { Link } from 'react-router';
import { EXPERIMENTS_CONFIG } from '../shared/config/experiments';
import { DEFAULT_ROSTER, UNASSIGNED_MEMBERS } from '../shared/config/roster';

export default function Team() {
  const teams = DEFAULT_ROSTER.teams;

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#faf9f6' }}>
      {/* Header section */}
      <div className="section padding-none" style={{ borderBottom: '2px solid #000', background: '#fff' }}>
        <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#ffd166', border: '2px solid #000', borderRadius: '999px', padding: '6px 18px', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Academic Year 2026 • Fr. CRCE
          </div>
          <h1 className="heading-2" style={{ margin: '0 0 16px', fontSize: '42px', fontWeight: 800 }}>
            Lab Teams &amp; Working Groups
          </h1>
          <p className="paragraph" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '17px', color: '#333' }}>
            Assigned student teams implementing interactive cryptographic simulations, vulnerability proofs, and validation suites.
          </p>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="section" style={{ padding: '60px 24px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '28px',
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
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
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
                      <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>
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
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '2px solid #000',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Module &rarr;
                    </Link>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', marginBottom: '14px' }}>
                      Assigned Members ({t.members.length})
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                      {t.members.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            background: '#f8f9fa',
                            border: '2px solid #000',
                            borderRadius: '10px',
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

          {/* Unassigned Pool Section */}
          <div
            style={{
              marginTop: '60px',
              background: '#fff',
              border: '3px solid #000',
              borderRadius: '16px',
              boxShadow: '6px 6px 0px #000',
              padding: '32px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>
                  Collaborators Pool (Pending Group Assignment)
                </h3>
                <p style={{ margin: '6px 0 0', color: '#666', fontSize: '14px' }}>
                  Students with GitHub accounts configured who can be allocated to project teams or future modules.
                </p>
              </div>
              <span
                style={{
                  background: '#a0c4ff',
                  border: '2px solid #000',
                  borderRadius: '8px',
                  padding: '4px 12px',
                  fontWeight: 800,
                  fontSize: '13px',
                }}
              >
                {UNASSIGNED_MEMBERS.length} Students
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '12px',
              }}
            >
              {UNASSIGNED_MEMBERS.map((u, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    background: '#f8f9fa',
                    border: '2px solid #000',
                    borderRadius: '10px',
                  }}
                >
                  <img
                    src={`https://avatars.githubusercontent.com/${u.githubLogin}?s=64`}
                    alt={u.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1.5px solid #000',
                    }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {u.name}
                    </div>
                    <a
                      href={`https://github.com/${u.githubLogin}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '12px', color: '#0969da', textDecoration: 'none', fontWeight: 600 }}
                    >
                      @{u.githubLogin}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
