import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';

const SLIDES = [
  {
    id: 'md5',
    category: 'VULNERABILITY MILESTONE • RFC 1321',
    heading: 'In 2004, Prof. Xiaoyun Wang and her research team proved MD5 was cryptographically broken by computing full practical hash collisions in under',
    number: '1 Hour',
    numberClass: 'red',
    numberColor: '#fc411f',
    citation: 'Shandong University proof — Breaking 128-bit collision resistance and rendering MD5 obsolete for digital certificates.',
    link: '/experiments/md5',
    buttonText: 'Test MD5 Collision in Simulator →',
    bubblesLeft: '/images/654e4f02ef67fa545d283b55_bubbles-left-red.svg',
    bubblesRight: '/images/654e4f0a9f58a763dc47254c_bubbles-right-red.svg',
  },
  {
    id: 'sha1',
    category: 'CRYPTOGRAPHIC BREAKTHROUGH • FIPS 180-4',
    heading: 'In 2017, CWI Amsterdam and Google announced "SHAttered", producing the first practical collision for SHA-1 after computing over',
    number: '9 Quintillion',
    numberClass: 'blue',
    numberColor: '#3c8aff',
    citation: 'C. Stevens, E. Bursztein, P. Karpman — Equivalent to 6,500 years of single-CPU processing.',
    link: '/experiments/sha1',
    buttonText: 'Inspect SHA-1 Compression →',
    bubblesLeft: '/images/654e5383867e93ef4ab6a8c0_bubbles-left-blue.svg',
    bubblesRight: '/images/654e53836269e3c4243f1648_bubbles-right-blue.svg',
  },
  {
    id: 'tls',
    category: 'TRANSPORT LAYER SECURITY • RFC 8446',
    heading: 'IETF RFC 8446 deprecated legacy static RSA ciphers and cut the secure cryptographic handshake latency down to',
    number: '0-RTT',
    numberClass: 'purple',
    numberColor: '#8b5cf6',
    citation: 'Zero Round-Trip Time session resumption with forward secrecy through ephemeral Diffie-Hellman (ECDHE).',
    link: '/experiments/ssl-tls',
    buttonText: 'Simulate TLS 1.3 Handshake →',
    bubblesLeft: '/images/654e4aef048446b9c461ce88_purple-bubbles-left.svg',
    bubblesRight: '/images/654e4af92e3fc9ec6ab1836d_purple-bubbles-right.svg',
  },
  {
    id: 'hmac',
    category: 'KEYED-HASH INTEGRITY • RFC 2104',
    heading: 'HMAC protects token-based authorization, JSON Web Tokens (JWT), and payment webhooks across',
    number: '95%+',
    numberClass: 'green',
    numberColor: '#299e00',
    citation: 'FIPS PUB 198-1 — Nested inner & outer hash compression immune to length-extension attacks.',
    link: '/experiments/hmac',
    buttonText: 'Explore HMAC Verification →',
    bubblesLeft: '/images/654e4d52d051f671cb49c438_bubbles-left-green.svg',
    bubblesRight: '/images/654e4d5c3da587486b5af203_bubbles-right-green.svg',
  },
  {
    id: 'mac',
    category: 'DATA AUTHENTICATION • ISO/IEC 9797',
    heading: 'Message Authentication Codes guarantee message authenticity and detect any in-transit packet alteration across',
    number: '100%',
    numberClass: 'yellow',
    numberColor: '#d97706',
    citation: 'Strict Avalanche Criterion (SAC) guarantees every bit alteration is caught by the receiver.',
    link: '/experiments/mac',
    buttonText: 'Test MAC Tamper Detection →',
    bubblesLeft: '/images/654e52a43157975a58d972f1_bubbles-left-yellow.svg',
    bubblesRight: '/images/654e529b552a81e3e88b73aa_bubbles-right-yellow.svg',
  },
];

export default function Section04() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, 5500);
    return () => clearInterval(timerRef.current);
  }, [isPaused, current]);

  const slide = SLIDES[current];

  return (
    <div
      className="case-studies-slider w-slider"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#ffffff',
        borderBottom: '2px solid #000000',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="slider-mask w-slider-mask" style={{ position: 'relative', minHeight: '520px' }}>
        <section className="section slider-section" style={{ minHeight: '520px', display: 'flex', alignItems: 'center' }}>
          {/* Decorative side bubble shapes matching the slide accent color */}
          <div className="w-layout-hflex case-study-shapes" style={{ pointerEvents: 'none' }}>
            <img src={slide.bubblesLeft} loading="eager" alt="" className="case-studies-shape" key={`bl-${slide.id}`} />
            <img src={slide.bubblesRight} loading="eager" alt="" className="case-studies-shape" key={`br-${slide.id}`} />
          </div>

          <div className="container margin-bottom-64 w-container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="case-studies-interior" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
              {/* Category Pill Tag */}
              <div style={{ marginBottom: '16px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    background: '#18181b',
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
                  }}
                >
                  {slide.category}
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="heading-2 text-center" style={{ fontSize: 'clamp(22px, 3vw, 32px)', lineHeight: 1.35, marginBottom: '20px' }}>
                {slide.heading}
              </h2>

              {/* Big Editorial Number / Stat */}
              <h2
                className={`heading-2 case-studies-number ${slide.numberClass}`}
                style={{
                  fontSize: 'clamp(52px, 8vw, 84px)',
                  lineHeight: 1,
                  margin: '12px 0 20px',
                  color: slide.numberColor,
                }}
              >
                {slide.number}
              </h2>

              {/* Academic Source / Citation */}
              <p
                className="paragraph text-center"
                style={{
                  fontFamily: "'Editorial New', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: '16px',
                  color: '#444444',
                  maxWidth: '680px',
                  margin: '0 auto 24px',
                }}
              >
                {slide.citation}
              </p>

              {/* Interactive Module Callout Button */}
              <div>
                <Link
                  to={slide.link}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    color: '#000000',
                    border: '2px solid #000000',
                    boxShadow: '3px 3px 0 #000000',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = '5px 5px 0 #000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translate(0, 0)';
                    e.currentTarget.style.boxShadow = '3px 3px 0 #000000';
                  }}
                >
                  <span>{slide.buttonText}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Left Arrow Button */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous milestone"
        className="case-study-arrow left w-slider-arrow-left"
        style={{
          cursor: 'pointer',
          background: '#ffffff',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0 #000000',
          borderRadius: '50%',
          width: '52px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          outline: 'none',
        }}
      >
        <img src="/images/654e45d5f2f019fd20a30335_cs-arrow-left.svg" loading="lazy" alt="Previous" style={{ width: '20px', height: '20px' }} />
      </button>

      {/* Right Arrow Button */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next milestone"
        className="case-study-arrow right w-slider-arrow-right"
        style={{
          cursor: 'pointer',
          background: '#ffffff',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0 #000000',
          borderRadius: '50%',
          width: '52px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          outline: 'none',
        }}
      >
        <img src="/images/654e45d6842022a368a21f3a_cs-arrow-right.svg" loading="lazy" alt="Next" style={{ width: '20px', height: '20px' }} />
      </button>

      {/* Navigation Dot Indicators */}
      <div
        className="slide-nav-2 w-slider-nav w-round"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          zIndex: 10,
        }}
      >
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}: ${s.id}`}
            style={{
              width: current === idx ? '28px' : '12px',
              height: '12px',
              borderRadius: '999px',
              border: '1.5px solid #000000',
              background: current === idx ? s.numberColor : '#ffffff',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.25s ease',
              outline: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
