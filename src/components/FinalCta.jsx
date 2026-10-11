import { Link } from 'react-router';

export default function FinalCta() {
  return (
    <>
      <div className="section final-cta-section">
        <div className="container w-container">
          <div className="final-cta">
            <h2 className="heading-2 final-cta">Your journey into cryptography starts here</h2>
            <div className="button-wrapper final-cta-button-wrapper" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/#experiments" className="button-icon emoji w-inline-block">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <div className="button-text">Explore Experiments</div>
              </Link>
              <Link to="/instructions" className="button-icon emoji w-inline-block" style={{ background: '#ffd166', color: '#000' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div className="button-text">Read Guidelines</div>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-left">
          <img src="/images/650cf1004fbb8cdbc037d5d2_serenity-now-left.svg" loading="eager" alt="" className="slide-in-left-small" />
        </div>
        <div className="bg-right">
          <img src="/images/650cf10f3ba81cb64a8d1cb9_serenity-now-right.svg" loading="eager" alt="" className="slide-in-right-small" />
        </div>
      </div>
    </>
  );
}
