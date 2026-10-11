import { Link } from 'react-router';

export default function Services() {
  return (
    <>
      <section id="experiments" className="section padding-none">
        <div className="container fluid padding-none w-container">
          <div className="basic-header services-header">
            <div className="meet-the-team-hero-interior">
              <h2 className="heading-2 text-center">Interactive Modules</h2>
              <p className="paragraph text-center">
                Dive deep into cryptographic algorithms. Learn the math behind the ciphers, construct payloads, and understand network security through hands-on practice.
              </p>
            </div>
          </div>
          <div className="services-columns">
            <div
              className="w-layout-grid services-grid"
              style={{
                gridTemplateColumns: 'repeat(6, 1fr)',
              }}
            >
              {/* Row 1: MD5 (2 cols), SHA-1 (2 cols), MAC (2 cols) */}
              <Link
                to="/experiments/md5"
                className="services-callout-item yellow w-inline-block"
                style={{ gridColumn: 'span 2', textDecoration: 'none', color: 'inherit' }}
              >
                <div className="services-callout-bg-shape">
                  <img
                    src="/images/629b9ac155a84f4387b26c2f_services-bg-shape-red.svg"
                    loading="eager"
                    alt=""
                    className="services-callout-bg-shape-img"
                  />
                </div>
                <div className="services-callout-card">
                  <h3 className="services-callout-card-title">MD5</h3>
                </div>
              </Link>

              <Link
                to="/experiments/sha1"
                className="services-callout-item middle green w-inline-block"
                style={{ gridColumn: 'span 2', textDecoration: 'none', color: 'inherit' }}
              >
                <div className="services-callout-bg-shape">
                  <img
                    src="/images/629b9aeeb00da574fa41647d_services-bg-shape-yellow.svg"
                    loading="eager"
                    alt=""
                    className="services-callout-bg-shape-img"
                  />
                </div>
                <div className="services-callout-card">
                  <h3 className="services-callout-card-title">SHA-1</h3>
                </div>
              </Link>

              <Link
                to="/experiments/mac"
                className="services-callout-item purple w-inline-block"
                style={{ gridColumn: 'span 2', textDecoration: 'none', color: 'inherit' }}
              >
                <div className="services-callout-bg-shape">
                  <img
                    src="/images/629b9ad38cb8b4240cda84e3_services-bg-shape-green.svg"
                    loading="eager"
                    alt=""
                    className="services-callout-bg-shape-img"
                  />
                </div>
                <div className="services-callout-card">
                  <h3 className="services-callout-card-title">MAC</h3>
                </div>
              </Link>

              {/* Row 2: HMAC (3 cols), SSL/TLS (3 cols) - wider to fill bottom row perfectly */}
              <Link
                to="/experiments/hmac"
                className="services-callout-item blue w-inline-block"
                style={{ gridColumn: 'span 3', textDecoration: 'none', color: 'inherit' }}
              >
                <div className="services-callout-bg-shape">
                  <img
                    src="/images/629b94174ed1a8345a245a7f_services-bg-shape-pink.svg"
                    loading="eager"
                    alt=""
                    className="services-callout-bg-shape-img"
                  />
                </div>
                <div className="services-callout-card">
                  <h3 className="services-callout-card-title">HMAC</h3>
                </div>
              </Link>

              <Link
                to="/experiments/ssl-tls"
                className="services-callout-item middle pink w-inline-block"
                style={{ gridColumn: 'span 3', textDecoration: 'none', color: 'inherit' }}
              >
                <div className="services-callout-bg-shape">
                  <img
                    src="/images/629b93be151de2288958bae8_services-bg-shape-purple.svg"
                    loading="eager"
                    alt=""
                    className="services-callout-bg-shape-img"
                  />
                </div>
                <div className="services-callout-card">
                  <h3 className="services-callout-card-title">SSL/TLS</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
