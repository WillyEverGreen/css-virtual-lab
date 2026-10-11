import { useState, useEffect } from 'react';

// Cryptographic outline icons embedded directly as inline SVGs (zero network dependency)
const ICONS = [
  // 1. Lock
  <svg key="lock" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <circle cx="12" cy="16" r="1" />
    <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
  </svg>,
  // 2. Key
  <svg key="key" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="15" r="4" />
    <line x1="10.85" y1="12.15" x2="19" y2="4" />
    <line x1="18" y1="5" x2="20" y2="7" />
    <line x1="15" y1="8" x2="17" y2="10" />
  </svg>,
  // 3. Shield Lock
  <svg key="shield" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="11" r="1" />
    <path d="M12 12v3" />
  </svg>,
  // 4. Hash
  <svg key="hash" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>,
  // 5. Terminal Code
  <svg key="terminal" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>,
  // 6. Science Flask
  <svg key="flask" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2v7.31L4.15 19.4A2 2 0 0 0 5.86 22h12.28a2 2 0 0 0 1.71-2.6L14 9.31V2" />
    <line x1="8.5" y1="2" x2="15.5" y2="2" />
    <line x1="14" y1="9.31" x2="10" y2="9.31" />
  </svg>,
];

export default function LabLogo() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ICONS.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        userSelect: 'none',
        textDecoration: 'none',
        lineHeight: 1,
      }}
    >
      {/* First word: Virtual */}
      <span
        style={{
          fontFamily: "'Editorial New', Georgia, serif",
          fontSize: 'clamp(26px, 2.5vw, 34px)',
          fontWeight: 200,
          color: '#000',
          letterSpacing: '-0.02em',
        }}
      >
        Virtual
      </span>

      {/* Rotating crypto icon */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '26px',
          height: '26px',
          color: '#000',
          animation: 'fadeInPop 0.35s ease',
        }}
        key={index}
      >
        {ICONS[index]}
      </span>

      {/* Second word: Lab */}
      <span
        style={{
          fontFamily: "'Editorial New', Georgia, serif",
          fontSize: 'clamp(26px, 2.5vw, 34px)',
          fontWeight: 200,
          color: '#000',
          letterSpacing: '-0.02em',
        }}
      >
        Lab
      </span>

      <style>{`
        @keyframes fadeInPop {
          0% { transform: scale(0.7) rotate(-10deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
