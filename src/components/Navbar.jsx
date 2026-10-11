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
          ======================================================== */}
      <div className="lab-nav-desktop" style={{ width: '100%', alignItems: 'stretch' }}>
        {/* Left nav stack */}
        <div
          id="w-node-_41727ff4-b8be-88c2-bd24-9e52a96dc283-e7aaa9b3"
          className="w-layout-layout nav-stack wf-layout-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            alignItems: 'stretch',
            width: '100%',
          }}
        >
          {isExperiment ? (
            <>
              <div className="w-layout-cell cell-2" style={{ display: 'flex', width: '100%' }}>
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

              <div className="w-layout-cell cell-2" style={{ display: 'flex', width: '100%' }}>
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

              <div className="w-layout-cell cell-2" style={{ display: 'flex', width: '100%' }}>
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
            DEFAULT_GLOBAL_NAV.left.map((item) => (
              <div key={item.to} className="w-layout-cell cell-2" style={{ display: 'flex', width: '100%' }}>
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

        {/* Center brand logo stack */}
        <div
          id="w-node-_0045fa72-ac34-d7e0-0e83-215a84c1777d-e7aaa9b3"
          className="w-layout-layout nav-logo-stack-container nav-logo-stack wf-layout-layout"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="w-layout-cell nav-logo-cell" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div className="brand-wrapper">
              <Link to="/" aria-label="Fr. CRCE Crypto Lab home" className="brand w-nav-brand">
                <LabLogo />
              </Link>
            </div>
          </div>
        </div>

        {/* Right nav stack */}
        <div
          id="w-node-_452cc59b-7d9c-4767-f02e-fafaccbd707f-e7aaa9b3"
          className="w-layout-layout nav-stack right wf-layout-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            alignItems: 'stretch',
            width: '100%',
          }}
        >
          {isExperiment ? (
            <>
              <div className="w-layout-cell cell-2" style={{ display: 'flex', width: '100%' }}>
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

              <div className="w-layout-cell cell-2" style={{ display: 'flex', width: '100%' }}>
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

              <div className="w-layout-cell cell-2" style={{ display: 'flex', width: '100%' }}>
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
            DEFAULT_GLOBAL_NAV.right.map((item) => (
              <div key={item.to} className="w-layout-cell cell-2" style={{ display: 'flex', width: '100%' }}>
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
          ======================================================== */}
      <div className="lab-nav-mobile" style={{ width: '100%', flexDirection: 'column' }}>
        {/* Mobile Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            borderBottom: '1px solid #e5e7eb',
            background: '#ffffff',
            minHeight: '48px',
          }}
        >
          <Link to="/" aria-label="Fr. CRCE Crypto Lab home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <LabLogo />
          </Link>
          {isExperiment ? (
            <Link
              to="/#experiments"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                background: '#18181b',
                color: '#ffffff',
                padding: '5px 12px',
                borderRadius: '999px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>All Labs</span>
              <span>→</span>
            </Link>
          ) : (
            <a
              href="/#experiments"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              style={{
                fontSize: '12px',
                fontWeight: 700,
                background: '#fc411f',
                color: '#ffffff',
                padding: '5px 12px',
                borderRadius: '999px',
                textDecoration: 'none',
              }}
            >
              Explore Labs
            </a>
          )}
        </div>

        {/* Mobile Horizontal Scrollable Tab Bar */}
        <div
          className="lab-mobile-tabs-scroll"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '7px 12px',
            background: '#fafafa',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {isExperiment ? (
            <>
              {[
                { id: 'objective', label: 'Objective', color: accentColor },
                { id: 'theory', label: 'Theory', color: '#3c8aff' },
                { id: 'procedure', label: 'Procedure', color: '#8b5cf6' },
                { id: 'simulation', label: 'Simulation', color: '#18181b' },
                { id: 'assessment', label: 'Assessment', color: '#ca8a04' },
                { id: 'references', label: 'References', color: '#0260a8' },
              ].map((tab) => {
                const isActive = activeTab === tab.id || (tab.id === 'assessment' && activeTab === 'quiz');
                return (
                  <a
                    key={tab.id}
                    href={`#${tab.id}`}
                    onClick={(e) => handleTabClick(e, tab.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '5px 14px',
                      borderRadius: '999px',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 500,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      background: isActive ? tab.color : '#ffffff',
                      color: isActive ? '#ffffff' : '#3f3f46',
                      border: isActive ? `1.5px solid ${tab.color}` : '1.5px solid #e4e4e7',
                      boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.15s ease',
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
                { to: '/', label: 'Home' },
                { to: '/dash', label: 'Dashboard' },
                { to: '/about', label: 'About' },
                { to: '/team', label: 'Team' },
                { to: '/instructions', label: 'Instructions' },
                { to: '/#experiments', label: 'Experiments', isCta: true },
              ].map((item) => {
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
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '5px 14px',
                      borderRadius: '999px',
                      fontSize: '12.5px',
                      fontWeight: isCurrent || item.isCta ? 700 : 500,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      background: item.isCta ? '#fc411f' : isCurrent ? '#18181b' : '#ffffff',
                      color: item.isCta || isCurrent ? '#ffffff' : '#3f3f46',
                      border: item.isCta ? '1.5px solid #fc411f' : isCurrent ? '1.5px solid #18181b' : '1.5px solid #e4e4e7',
                      transition: 'all 0.15s ease',
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
