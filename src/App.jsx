import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import Navbar from './components/Navbar.jsx';
import { useWebflow } from './web/webflow/useWebflow';
import Home from './web/pages/Home';
import ExperimentView from './web/pages/ExperimentView';
import About from './web/pages/About';
import Team from './components/Team';

import Dash from './web/pages/Dash';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

function WebflowWatcher() {
  const location = useLocation();
  useWebflow([location.pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="body">
        <WebflowWatcher />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dash" element={<Dash />} />
          <Route path="/about" element={<About />} />
          <Route path="/instructions" element={<About />} />
          <Route path="/experiments/:slug" element={<ExperimentView />} />
          <Route path="/team" element={<Team />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
