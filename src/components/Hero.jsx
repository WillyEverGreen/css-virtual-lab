export default function Hero() {
  return (
    <section
      className="section hero"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 130px)',
        padding: 'clamp(36px, 6vh, 80px) 24px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        textAlign: 'center',
        backgroundColor: '#fffdfa',
      }}
    >
      {/* Mobile wave accents */}
      <div className="contact-top hero-top-mobile" style={{ pointerEvents: 'none' }}>
        <img
          src="/images/62d6caa2de257e672850a2dc_hero-mobile-top.svg"
          loading="lazy"
          alt=""
          className="contact-top-bg-bubbles hero-mobile-waves"
        />
      </div>
      <div className="contact-bottom hero-bottom-mobile" style={{ pointerEvents: 'none' }}>
        <img
          src="/images/62d6cab36a8d3d8dc475b243_hero-mobile-bottom.svg"
          loading="lazy"
          alt=""
          className="contact-bottom-bg-bubbles hero-mobile-waves"
        />
      </div>

      {/* Decorative spark blobs on left & right */}
      <div
        className="hero-blobs"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <div
          className="hero-blob-left"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            maxWidth: '36vw',
            opacity: 0.95,
          }}
        >
          <img
            src="/images/650b2638cb1f90806f5004f5_spark-bottom-left-blue.svg"
            loading="eager"
            alt=""
            className="slide-in-left"
            style={{ width: '100%', maxHeight: '420px', objectFit: 'contain' }}
          />
        </div>
        <div
          className="hero-blob-right"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            maxWidth: '36vw',
            opacity: 0.95,
          }}
        >
          <img
            src="/images/650b260d6a9e891820e21fa1_spark-top-right-red.svg"
            loading="eager"
            alt=""
            className="slide-in-right"
            style={{ width: '100%', maxHeight: '420px', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Hero content strictly centered */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '860px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginBottom: '28px',
          }}
        >
          <h1
            className="hero-title"
            style={{
              fontFamily: "'Editorial New', Georgia, serif",
              fontWeight: 200,
              fontSize: 'clamp(40px, 6.4vw, 86px)',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              color: '#000000',
              textAlign: 'center',
              margin: '0 0 20px 0',
              width: '100%',
              textWrap: 'balance',
            }}
          >
            Learn cryptography by breaking it.
          </h1>

          <p
            className="paragraph"
            style={{
              fontSize: 'clamp(16px, 1.8vw, 21px)',
              lineHeight: 1.55,
              color: '#485b60',
              textAlign: 'center',
              maxWidth: '620px',
              margin: '0 auto',
            }}
          >
            Explore the math, validate the algorithms,
            <br />
            and secure the web.
          </p>
        </div>

        <a
          href="#experiments"
          className="button-icon emoji w-inline-block"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            textDecoration: 'none',
          }}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <div className="emoji">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ display: 'inline-block', verticalAlign: 'middle' }}
            >
              <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
              <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
              <path d="M14 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            </svg>
          </div>
          <div className="button-text">Start exploring</div>
        </a>
      </div>
    </section>
  );
}

