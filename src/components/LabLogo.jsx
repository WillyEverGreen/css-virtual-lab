import { useState, useEffect } from 'react';

// SVG icon filenames from Tabler / Simple Icons
const ASSET_ICONS = [
  'lock.svg',
  'shield-lock.svg',
  'key.svg',
  'fingerprint.svg',
  'hash.svg',
  'certificate.svg',
  'binary.svg',
  'terminal.svg',
];

export default function LabLogo() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ASSET_ICONS.length);
    }, 1200);
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
          fontSize: '34px',
          fontWeight: 200,
          color: '#000',
          letterSpacing: '-0.02em',
        }}
      >
        Virtual
      </span>

      {/* Rotating icon directly in between without any blob container */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '26px',
          height: '26px',
        }}
      >
        <img
          key={index}
          src={`/icons/${ASSET_ICONS[index]}`}
          alt="crypto-asset"
          style={{
            width: '22px',
            height: '22px',
            animation: 'fadeInPop 0.3s ease',
            filter: 'brightness(0)',
          }}
        />
      </span>

      {/* Second word: Lab */}
      <span
        style={{
          fontFamily: "'Editorial New', Georgia, serif",
          fontSize: '34px',
          fontWeight: 200,
          color: '#000',
          letterSpacing: '-0.02em',
        }}
      >
        Lab
      </span>

      <style>{`
        @keyframes fadeInPop {
          0% { transform: scale(0.6) rotate(-8deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
