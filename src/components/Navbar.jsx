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
  );
}
