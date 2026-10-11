import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router';
import LabLogo from './LabLogo.jsx';

const SLUG_COLORS = {
  md5: '#fc411f',
  sha1: '#3c8aff',
  mac: '#299e00',
  hmac: '#cd97e9',
  'ssl-tls': '#ffbe2e',
};

const DEFAULT_GLOBAL_NAV = {
  left: [
    { to: '/', label: 'Home', color: 'hover-red' },
    { to: '/dash', label: 'Dashboard', color: 'hover-blue' },
    { to: '/about', label: 'About', color: 'hover-purple' },
  ],
  right: [
    { to: '/team', label: 'Team', color: 'hover-pink' },
    { to: '/instructions', label: 'Instructions', color: 'hover-yellow' },
    { to: '/#experiments', label: 'Experiments', isCta: true },
  ],
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isExperiment = location.pathname.startsWith('/experiments/');

  const expMatch = location.pathname.match(/^\/experiments\/([^/]+)/);
  const currentSlug = expMatch ? expMatch[1] : null;
  const accentColor = currentSlug && SLUG_COLORS[currentSlug] ? SLUG_COLORS[currentSlug] : '#fc411f';

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      if (['objective', 'theory', 'procedure', 'simulation', 'assessment', 'quiz', 'references'].includes(hash)) {
        return hash === 'quiz' ? 'assessment' : hash;
      }
    }
    return 'objective';
  });

  // Keep activeTab in sync with URL hash and experiment changes
  useEffect(() => {
    if (!isExperiment) return;

    const hash = window.location.hash.replace(/^#/, '');
    if (['objective', 'theory', 'procedure', 'simulation', 'assessment', 'quiz', 'references'].includes(hash)) {
      setActiveTab(hash === 'quiz' ? 'assessment' : hash);
    } else {
      setActiveTab('objective');
    }
  }, [location.pathname, isExperiment]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (['objective', 'theory', 'procedure', 'simulation', 'assessment', 'quiz', 'references'].includes(hash)) {
        setActiveTab(hash === 'quiz' ? 'assessment' : hash);
      }
    };

    const handleTabChange = (e) => {
      if (e.detail) {
        const tab = e.detail === 'quiz' ? 'assessment' : e.detail;
        setActiveTab(tab);
      }
    };

    const handleMessage = (event) => {
      if (event.data && (event.data.type === 'ACTIVE_TAB_CHANGED' || event.data.type === 'EXPERIMENT_TAB_CHANGED')) {
        if (event.data.target) {
          const tab = event.data.target === 'quiz' ? 'assessment' : event.data.target;
          setActiveTab(tab);
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('lab:tab-change', handleTabChange);
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('lab:tab-change', handleTabChange);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleTabClick = (e, tabId) => {
    e.preventDefault();

    if (!isExperiment) {
      if (tabId === 'simulation') {
        const el = document.getElementById('experiments');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          navigate('/#experiments');
        }
      }
      return;
    }

    const normalizedTab = tabId === 'quiz' ? 'assessment' : tabId;
    setActiveTab(normalizedTab);
    window.location.hash = normalizedTab;
    window.dispatchEvent(new CustomEvent('lab:tab-change', { detail: normalizedTab }));

    // Send SET_TAB to any iframe
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      try {
        iframe.contentWindow?.postMessage({ type: 'SET_TAB', target: normalizedTab }, '*');
        if (normalizedTab === 'assessment') {
          iframe.contentWindow?.postMessage({ type: 'SET_TAB', target: 'quiz' }, '*');
        }
      } catch (_) {}
    });
  };

  const getActiveTabStyle = (tabId, activeBg, activeColor = '#ffffff') => {
    if (!isExperiment) return {};
    const isActive = activeTab === tabId || (tabId === 'assessment' && activeTab === 'quiz');
    if (!isActive) return {};
    return {
      backgroundColor: activeBg,
      color: activeColor,
      fontWeight: 'bold',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
    };
  };

  return (
    <div
      data-collapse="none"
      data-animation="default"
      data-duration="400"
      data-easing="ease"
      data-easing2="ease"
      data-doc-height="1"
      role="banner"
      className="navbar w-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #000000',
      }}
    >
      {/* ========================================================
          DESKTOP NAVBAR (Screen width > 820px)
          Symmetrically balanced 1fr - auto - 1fr grid with Virtual Lab dead-centered
          ======================================================== */}
      <div
        className="lab-nav-desktop"
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
          alignItems: 'stretch',
        }}
      >
        {/* Left nav stack: Exactly 50% minus half of center logo */}
        <div
          className="lab-nav-stack-left"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            alignItems: 'stretch',
            width: '100%',
          }}
        >
          {isExperiment ? (
            <>
              <div style={{ display: 'flex', width: '100%', borderRight: '1px solid #000' }}>
                <a
                  href="#objective"
                  onClick={(e) => handleTabClick(e, 'objective')}
                  className="nav-link left hover-red w-inline-block"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    ...getActiveTabStyle('objective', accentColor, '#ffffff'),
                  }}
                  title="Objective & Aim"
                >
                  <div className="nav-link-text">Objective</div>
                </a>
              </div>

              <div style={{ display: 'flex', width: '100%', borderRight: '1px solid #000' }}>
                <a
                  href="#theory"
                  onClick={(e) => handleTabClick(e, 'theory')}
                  className="nav-link left hover-blue w-inline-block"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    ...getActiveTabStyle('theory', '#3c8aff', '#ffffff'),
                  }}
                  title="Theory & Mathematical Formulation"
                >
                  <div className="nav-link-text">Theory</div>
                </a>
              </div>

              <div style={{ display: 'flex', width: '100%' }}>
                <a
                  href="#procedure"
                  onClick={(e) => handleTabClick(e, 'procedure')}
                  className="nav-link left hover-purple w-inline-block"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    ...getActiveTabStyle('procedure', '#8b5cf6', '#ffffff'),
                  }}
                  title="Step-by-Step Laboratory Procedure"
                >
                  <div className="nav-link-text">Procedure</div>
                </a>
              </div>
            </>
          ) : (
            DEFAULT_GLOBAL_NAV.left.map((item, idx) => (
              <div key={item.to} style={{ display: 'flex', width: '100%', borderRight: idx < 2 ? '1px solid #000' : 'none' }}>
                <Link
                  to={item.to}
                  className={`nav-link left ${item.color} w-inline-block`}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <div className="nav-link-text">{item.label}</div>
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Center brand logo stack - mathematically centered at exact 50% */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 28px',
            borderRight: '1px solid #000',
            borderLeft: '1px solid #000',
            minWidth: '260px',
            background: '#ffffff',
          }}
        >
          <Link
            to="/"
            aria-label="Fr. CRCE Crypto Lab home"
            className="brand w-nav-brand"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              padding: 0,
            }}
          >
            <LabLogo />
          </Link>
        </div>

        {/* Right nav stack: Exactly 50% minus half of center logo */}
        <div
          className="lab-nav-stack-right"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            alignItems: 'stretch',
            width: '100%',
          }}
        >
          {isExperiment ? (
            <>
              <div style={{ display: 'flex', width: '100%', borderRight: '1px solid #000' }}>
                <a
                  href="#simulation"
                  onClick={(e) => handleTabClick(e, 'simulation')}
                  className="nav-link right cta w-inline-block"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    ...getActiveTabStyle('simulation', '#18181b', '#ffffff'),
                  }}
                  title="Interactive Simulation"
                >
                  <div className="nav-link-text">Simulation</div>
                </a>
              </div>

              <div style={{ display: 'flex', width: '100%', borderRight: '1px solid #000' }}>
                <a
                  href="#assessment"
                  onClick={(e) => handleTabClick(e, 'assessment')}
                  className="nav-link right hover-yellow w-inline-block"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    ...getActiveTabStyle('assessment', '#eab308', '#000000'),
                  }}
                  title="Assessment & Quiz"
                >
                  <div className="nav-link-text">Assessment</div>
                </a>
              </div>

              <div style={{ display: 'flex', width: '100%' }}>
                <a
                  href="#references"
                  onClick={(e) => handleTabClick(e, 'references')}
                  className="nav-link right hover-blue w-inline-block"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    ...getActiveTabStyle('references', '#0260a8', '#ffffff'),
                  }}
                  title="References & Standards"
                >
                  <div className="nav-link-text">References</div>
                </a>
              </div>
            </>
          ) : (
            DEFAULT_GLOBAL_NAV.right.map((item, idx) => (
              <div key={item.to} style={{ display: 'flex', width: '100%', borderRight: idx < 2 ? '1px solid #000' : 'none' }}>
                <Link
                  to={item.to}
                  className={`nav-link right ${item.isCta ? 'cta' : item.color} w-inline-block`}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={(e) => {
                    if (item.to === '/#experiments' && location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  <div className="nav-link-text">{item.label}</div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================================
          MOBILE & TABLET NAVBAR (Screen width <= 820px)
          Covers whole screen width, Virtual Lab centered, theme matched
          ======================================================== */}
      <div className="lab-nav-mobile" style={{ width: '100%', flexDirection: 'column' }}>
        {/* Row 1: Full-width bar with Virtual Lab strictly centered */}
        <div
          style={{
            width: '100%',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #000000',
            background: '#ffffff',
          }}
        >
          <Link
            to="/"
            aria-label="Fr. CRCE Crypto Lab home"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LabLogo />
          </Link>
        </div>

        {/* Row 2: Full-width themed editorial navigation strip */}
        <div
          className="lab-editorial-nav-ribbon"
          style={{
            display: 'flex',
            alignItems: 'stretch',
            width: '100%',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            background: '#ffffff',
            borderBottom: '2px solid #000000',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {isExperiment ? (
            <>
              {[
                { id: 'objective', label: 'Objective', color: accentColor },
                { id: 'theory', label: 'Theory', color: '#3c8aff' },
                { id: 'procedure', label: 'Procedure', color: '#8b5cf6' },
                { id: 'simulation', label: 'Simulation', color: '#18181b' },
                { id: 'assessment', label: 'Assessment', color: '#ffd166', textColor: '#000000' },
                { id: 'references', label: 'References', color: '#0260a8' },
              ].map((tab, idx, arr) => {
                const isActive = activeTab === tab.id || (tab.id === 'assessment' && activeTab === 'quiz');
                return (
                  <a
                    key={tab.id}
                    href={`#${tab.id}`}
                    onClick={(e) => handleTabClick(e, tab.id)}
                    style={{
                      flex: '1 0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px 18px',
                      borderRight: idx === arr.length - 1 ? 'none' : '1px solid #000000',
                      fontFamily: "'Editorial New', Georgia, serif",
                      fontStyle: 'italic',
                      fontSize: '17px',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      background: isActive ? tab.color : 'transparent',
                      color: isActive ? (tab.textColor || '#ffffff') : '#000000',
                      fontWeight: isActive ? 700 : 400,
                      transition: 'background-color 0.2s, color 0.2s',
                    }}
                  >
                    {tab.label}
                  </a>
                );
              })}
            </>
          ) : (
            <>
              {[
                { to: '/', label: 'Home', hoverColor: '#fc411f' },
                { to: '/dash', label: 'Dashboard', hoverColor: '#3c8aff' },
                { to: '/about', label: 'About', hoverColor: '#8b5cf6' },
                { to: '/team', label: 'Team', hoverColor: '#ff70a6' },
                { to: '/instructions', label: 'Instructions', hoverColor: '#ffd166', textColor: '#000000' },
                { to: '/#experiments', label: 'Experiments', isCta: true, hoverColor: '#299e00' },
              ].map((item, idx, arr) => {
                const isCurrent = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={(e) => {
                      if (item.to === '/#experiments' && location.pathname === '/') {
                        e.preventDefault();
                        document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    style={{
                      flex: '1 0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px 18px',
                      borderRight: idx === arr.length - 1 ? 'none' : '1px solid #000000',
                      fontFamily: "'Editorial New', Georgia, serif",
                      fontStyle: 'italic',
                      fontSize: '17px',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      background: isCurrent ? item.hoverColor : item.isCta ? '#299e00' : 'transparent',
                      color: isCurrent || item.isCta ? (item.textColor || '#ffffff') : '#000000',
                      fontWeight: isCurrent || item.isCta ? 700 : 400,
                      transition: 'background-color 0.2s, color 0.2s',
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
