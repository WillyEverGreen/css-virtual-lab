import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router';
import LabLogo from './LabLogo.jsx';

const EXPERIMENT_NAV_CONFIG = {
  md5: {
    left: [
      { id: 'objective', label: '1. Aim', color: 'hover-red', tooltip: 'Aim & Overview' },
      { id: 'theory', label: '2. Theory', color: 'hover-blue', tooltip: 'Theory & Rounds' },
      { id: 'procedure', label: '3. Procedure', color: 'hover-purple', tooltip: 'Laboratory Procedure' },
    ],
    right: [
      { id: 'simulation', label: '4. Simulation', color: 'hover-pink', tooltip: 'Live Simulation' },
      { id: 'avalanche', label: '5. Avalanche', color: 'hover-yellow', tooltip: 'Strict Avalanche Criterion' },
      { id: 'quiz', label: '6. Quiz', color: 'hover-blue', tooltip: 'Knowledge Quiz' },
      { id: 'references', label: '7. References', color: 'hover-red', tooltip: 'Authoritative References' },
    ],
  },
  sha1: {
    left: [
      { id: 'objective', label: '1. Aim', color: 'hover-red', tooltip: 'Aim & Overview' },
      { id: 'theory', label: '2. Theory', color: 'hover-blue', tooltip: 'Theory & Architecture' },
      { id: 'procedure', label: '3. Procedure', color: 'hover-purple', tooltip: 'Laboratory Procedure' },
    ],
    right: [
      { id: 'simulation', label: '4. Simulation', color: 'hover-pink', tooltip: 'Live Simulation' },
      { id: 'avalanche', label: '5. Avalanche', color: 'hover-yellow', tooltip: 'Strict Avalanche Criterion' },
      { id: 'quiz', label: '6. Quiz', color: 'hover-blue', tooltip: 'Knowledge Quiz' },
      { id: 'references', label: '7. References', color: 'hover-red', tooltip: 'Authoritative References' },
    ],
  },
  mac: {
    left: [
      { id: 'objective', label: '1. Aim', color: 'hover-red', tooltip: 'Aim & Overview' },
      { id: 'theory', label: '2. Theory', color: 'hover-blue', tooltip: 'Theory & Architecture' },
      { id: 'procedure', label: '3. Procedure', color: 'hover-purple', tooltip: 'Laboratory Procedure' },
    ],
    right: [
      { id: 'simulation', label: '4. Simulation', color: 'hover-pink', tooltip: 'Live Pipeline Simulation' },
      { id: 'quiz', label: '5. Quiz', color: 'hover-yellow', tooltip: 'Knowledge Quiz' },
      { id: 'references', label: '6. References', color: 'hover-blue', tooltip: 'Authoritative References' },
    ],
  },
  hmac: {
    left: [
      { id: 'objective', label: '1. Aim', color: 'hover-red', tooltip: 'Aim & Overview' },
      { id: 'theory', label: '2. Theory', color: 'hover-blue', tooltip: 'Theory & Architecture' },
      { id: 'procedure', label: '3. Procedure', color: 'hover-purple', tooltip: 'Laboratory Procedure' },
    ],
    right: [
      { id: 'simulation', label: '4. Generator', color: 'hover-pink', tooltip: 'HMAC Generator & Pads' },
      { id: 'tamper', label: '5. Tamper', color: 'hover-yellow', tooltip: 'In-Transit Tamper Channel' },
      { id: 'quiz', label: '6. Quiz', color: 'hover-blue', tooltip: 'Knowledge Quiz' },
      { id: 'references', label: '7. References', color: 'hover-red', tooltip: 'Authoritative References' },
    ],
  },
  'ssl-tls': {
    left: [
      { id: 'objective', label: '1. Aim', color: 'hover-red', tooltip: 'Aim & Overview' },
      { id: 'theory', label: '2. Theory', color: 'hover-blue', tooltip: 'Theory & Handshake' },
      { id: 'procedure', label: '3. Procedure', color: 'hover-purple', tooltip: 'Laboratory Procedure' },
    ],
    right: [
      { id: 'simulation', label: '4. Simulator', color: 'hover-pink', tooltip: 'Protocol Simulator' },
      { id: 'comparison', label: '5. Analysis', color: 'hover-yellow', tooltip: 'TLS 1.2 vs 1.3 Analysis' },
      { id: 'quiz', label: '6. Quiz', color: 'hover-blue', tooltip: 'Knowledge Quiz' },
      { id: 'references', label: '7. References', color: 'hover-red', tooltip: 'Authoritative References' },
    ],
  },
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
  const [activeTab, setActiveTab] = useState('objective');

  const expMatch = location.pathname.match(/^\/experiments\/([^/]+)/);
  const currentSlug = expMatch ? expMatch[1] : null;
  const expConfig = currentSlug && EXPERIMENT_NAV_CONFIG[currentSlug] ? EXPERIMENT_NAV_CONFIG[currentSlug] : null;

  // Reset to objective on experiment change
  useEffect(() => {
    setActiveTab('objective');
  }, [location.pathname]);

  // Listen for active tab notifications from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && (event.data.type === 'ACTIVE_TAB_CHANGED' || event.data.type === 'EXPERIMENT_TAB_CHANGED')) {
        if (event.data.target) {
          setActiveTab(event.data.target);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    setActiveTab(tabId);

    // Forward to any active iframes
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      try {
        iframe.contentWindow?.postMessage({ type: 'SET_TAB', target: tabId }, '*');
      } catch (_) {}
    });

    window.dispatchEvent(new CustomEvent('EXPERIMENT_NAV_CHANGE', { detail: { target: tabId } }));
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
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'space-between',
        }}
      >
        {expConfig ? (
          expConfig.left.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <div key={tab.id} className="w-layout-cell cell-2" style={{ flex: 1, minWidth: 0, display: 'flex' }}>
                <a
                  href={`#${tab.id}`}
                  onClick={(e) => handleTabClick(e, tab.id)}
                  className={`nav-link left ${tab.color} w-inline-block`}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#18181b' : undefined,
                    transition: 'all 0.15s ease',
                  }}
                  title={tab.tooltip}
                >
                  <div
                    className="nav-link-text"
                    style={{
                      color: isActive ? '#ffffff' : undefined,
                      fontWeight: isActive ? 800 : undefined,
                      fontSize: '13px',
                    }}
                  >
                    {tab.label}
                  </div>
                </a>
              </div>
            );
          })
        ) : (
          DEFAULT_GLOBAL_NAV.left.map((item) => (
            <div key={item.to} className="w-layout-cell cell-2" style={{ flex: 1, minWidth: 0, display: 'flex' }}>
              <Link
                to={item.to}
                className={`nav-link left ${item.color} w-inline-block`}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div className="nav-link-text" style={{ fontSize: '13px' }}>{item.label}</div>
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
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'space-between',
        }}
      >
        {expConfig ? (
          <>
            {expConfig.right.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <div key={tab.id} className="w-layout-cell cell-2" style={{ flex: 1, minWidth: 0, display: 'flex' }}>
                  <a
                    href={`#${tab.id}`}
                    onClick={(e) => handleTabClick(e, tab.id)}
                    className={`nav-link right ${tab.color} w-inline-block`}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#18181b' : undefined,
                      transition: 'all 0.15s ease',
                    }}
                    title={tab.tooltip}
                  >
                    <div
                      className="nav-link-text"
                      style={{
                        color: isActive ? '#ffffff' : undefined,
                        fontWeight: isActive ? 800 : undefined,
                        fontSize: '13px',
                      }}
                    >
                      {tab.label}
                    </div>
                  </a>
                </div>
              );
            })}
            <div className="w-layout-cell cell-2" style={{ flex: 1, minWidth: 0, display: 'flex' }}>
              <Link
                to="/#experiments"
                className="nav-link right cta w-inline-block"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Return to experiments selection"
              >
                <div className="nav-link-text" style={{ fontSize: '13px' }}>Experiments</div>
              </Link>
            </div>
          </>
        ) : (
          DEFAULT_GLOBAL_NAV.right.map((item) => (
            <div key={item.to} className="w-layout-cell cell-2" style={{ flex: 1, minWidth: 0, display: 'flex' }}>
              <Link
                to={item.to}
                className={`nav-link right ${item.isCta ? 'cta' : item.color} w-inline-block`}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div className="nav-link-text" style={{ fontSize: '13px' }}>{item.label}</div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
