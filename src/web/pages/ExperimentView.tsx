import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { EXPERIMENTS_CONFIG } from '../../shared/config/experiments';
import { AGENT_SYSTEM_PROMPT } from '../../shared/config/prompt';
import '../theme/experiment-theme.css';

const SLUG_COLORS: Record<string, string> = {
  md5: '#fc411f',
  sha1: '#3c8aff',
  mac: '#299e00',
  hmac: '#cd97e9',
  'ssl-tls': '#ffbe2e',
};

interface ExperimentData {
  slug: string;
  isLive: boolean;
  held: boolean;
  snapshotsCount?: number;
  lastRun: {
    runId?: string;
    status: string;
    at?: string;
    commitSha?: string;
  } | null;
  repo?: {
    owner: string;
    name: string;
  } | null;
}

export default function ExperimentView() {
  const { slug = 'md5' } = useParams<{ slug: string }>();
  const validSlug = (slug in EXPERIMENTS_CONFIG ? slug : 'md5') as keyof typeof EXPERIMENTS_CONFIG;
  const config = EXPERIMENTS_CONFIG[validSlug];
  const accentColor = SLUG_COLORS[validSlug] || '#fc411f';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<ExperimentData | null>(null);
  const [cacheBuster, setCacheBuster] = useState<number>(() => Date.now());
  const [copySuccess, setCopySuccess] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');
  const [fetchLatency, setFetchLatency] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(950);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const syncIframeHeight = useCallback(() => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const container = doc.querySelector('.lab-experiment-container') as HTMLElement;
      let calculatedHeight = 0;

      if (container) {
        calculatedHeight = Math.max(container.scrollHeight, container.offsetHeight);
      } else if (doc.body) {
        calculatedHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
      }

      // Check all visible sections and headers to ensure nothing is clipped
      const visibleElements = doc.querySelectorAll('section:not(.tab-hidden), header');
      let maxBottom = 0;
      visibleElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const bottom = (htmlEl.offsetTop || 0) + (htmlEl.offsetHeight || 0);
        if (bottom > maxBottom) maxBottom = bottom;
      });

      const targetHeight = Math.max(calculatedHeight, maxBottom + 60, 750);
      setIframeHeight(targetHeight);
    } catch {
      // Safe fallback if cross-origin
    }
  }, []);

  const handleIframeLoad = useCallback(() => {
    syncIframeHeight();
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc?.body && 'ResizeObserver' in window) {
        const ro = new ResizeObserver(() => {
          syncIframeHeight();
        });
        ro.observe(doc.body);
        const container = doc.querySelector('.lab-experiment-container');
        if (container) ro.observe(container);
      }
    } catch {
      // Safe fallback
    }
  }, [syncIframeHeight]);

  useEffect(() => {
    const onNavChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ target: string }>;
      const target = customEvent.detail?.target;
      if (target && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'SET_TAB', target }, '*');
        setTimeout(syncIframeHeight, 50);
        setTimeout(syncIframeHeight, 200);
      }
    };
    window.addEventListener('EXPERIMENT_NAV_CHANGE', onNavChange);
    return () => window.removeEventListener('EXPERIMENT_NAV_CHANGE', onNavChange);
  }, [syncIframeHeight]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'RESIZE_IFRAME' && typeof e.data.height === 'number') {
        setIframeHeight(Math.max(e.data.height + 40, 750));
      }
      if (e.data?.type === 'ACTIVE_TAB_CHANGED') {
        setTimeout(syncIframeHeight, 40);
        setTimeout(syncIframeHeight, 200);
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('resize', syncIframeHeight);
    const interval = setInterval(syncIframeHeight, 600);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('resize', syncIframeHeight);
      clearInterval(interval);
    };
  }, [syncIframeHeight]);

  const fetchStatus = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);
      setFetchError(null);

      const startTime = performance.now();
      const timestamp = new Date().toLocaleTimeString();

      try {
        console.groupCollapsed(
          `%c[CryptoLab:Experiment] Status check for "${validSlug}" (${timestamp})`,
          'color: #0969da; font-weight: bold;'
        );
        console.log('Experiment config:', config);

        const res = await fetch(`/api/experiments/${validSlug}?t=${Date.now()}`);
        const duration = Math.round(performance.now() - startTime);
        setFetchLatency(duration);

        if (!res.ok) {
          throw new Error(`API returned HTTP ${res.status}`);
        }

        const json: ExperimentData = await res.json();
        console.log('API payload:', json);
        console.log(`Live status: ${json.isLive ? 'LIVE' : 'PENDING'} | Last run: ${json.lastRun?.status || 'none'}`);
        console.groupEnd();

        setData(json);
        setLastCheckTime(timestamp);
        if (isManual) {
          setCacheBuster(Date.now());
        }
      } catch (err: any) {
        console.error('[CryptoLab:Experiment] Error loading status:', err);
        console.groupEnd();
        setFetchError(err.message || 'Network error fetching status');
      } finally {
        setLoading(false);
        if (isManual) setRefreshing(false);
      }
    },
    [validSlug, config]
  );

  useEffect(() => {
    setLoading(true);
    fetchStatus(false);
  }, [fetchStatus]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(AGENT_SYSTEM_PROMPT);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const hasLocalModule =
    validSlug === 'md5' ||
    validSlug === 'mac' ||
    validSlug === 'sha1' ||
    validSlug === 'hmac' ||
    validSlug === 'ssl-tls';
  const isLive = Boolean((data?.isLive || hasLocalModule) && !data?.held);
  const isFailed = data?.lastRun?.status === 'failed' && !hasLocalModule;

  return (
    <div
      className="lab-experiment-container lab-blank-view"
      style={{
        '--exp-accent': accentColor,
        minHeight: 'calc(100vh - 80px)',
        padding: '24px 20px 60px',
        maxWidth: '1020px',
        margin: '0 auto',
      } as React.CSSProperties}
    >
      <div className="lab-opening-bar" key={validSlug} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', color: '#666', fontWeight: 600 }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>⚡</div>
          Loading experiment status for {config.title}...
        </div>
      ) : isLive ? (
        /* When all test code passes: Show their module properly on our platform */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              background: '#ffffff',
              border: '2px solid #18181b',
              borderRadius: '14px',
              padding: '12px 20px',
              boxShadow: '4px 4px 0px #18181b',
              maxWidth: '980px',
              width: '100%',
              margin: '0 auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: accentColor,
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: '1.5px solid #000',
                }}
              >
                {config.groupLabel}
              </span>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{config.title}</h2>
              <span
                style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid #16a34a',
                }}
              >
                🟢 Live &amp; Verified
              </span>
              {(data?.lastRun?.commitSha || hasLocalModule) && (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#666',
                    background: '#f4f4f5',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #e4e4e7',
                  }}
                  title={
                    validSlug === 'md5'
                      ? 'Repository: dmelloruth21/MD5_virtual_lab'
                      : validSlug === 'mac'
                      ? 'Repository: Slora123/CSS_mini_project'
                      : validSlug === 'sha1'
                      ? 'Repository: TanushCode/SHA1-CSS-Virtual-Lab'
                      : validSlug === 'hmac'
                      ? 'Repository: Wendellpy/CSS-Virtual-Lab'
                      : validSlug === 'ssl-tls'
                      ? 'Repository: Jace-4/CSS-Virtual-Lab-'
                      : `Full commit SHA: ${data?.lastRun?.commitSha}`
                  }
                >
                  {validSlug === 'md5'
                    ? 'repo: dmelloruth21/MD5_virtual_lab'
                    : validSlug === 'mac'
                    ? 'repo: Slora123/CSS_mini_project'
                    : validSlug === 'sha1'
                    ? 'repo: TanushCode/SHA1-CSS-Virtual-Lab'
                    : validSlug === 'hmac'
                    ? 'repo: Wendellpy/CSS-Virtual-Lab'
                    : validSlug === 'ssl-tls'
                    ? 'repo: Jace-4/CSS-Virtual-Lab-'
                    : `commit: ${data?.lastRun?.commitSha?.substring(0, 7)}`}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => fetchStatus(true)}
                disabled={refreshing}
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#000',
                  background: refreshing ? '#e4e4e7' : '#fff',
                  border: '1.5px solid #000',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  cursor: refreshing ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '2px 2px 0px #000',
                }}
                title="Re-fetch status without reloading the page"
              >
                <span style={{ display: 'inline-block', transform: refreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s ease' }}>
                  ↻
                </span>
                {refreshing ? 'Updating...' : 'Refresh Status'}
              </button>

              <Link
                to="/dash"
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#000',
                  textDecoration: 'none',
                  background: '#f4f4f5',
                  border: '1.5px solid #000',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  boxShadow: '2px 2px 0px #000',
                }}
              >
                Dashboard &rarr;
              </Link>
            </div>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: '980px',
              margin: '0 auto',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <iframe
              ref={iframeRef}
              key={`${validSlug}-${data?.lastRun?.commitSha || cacheBuster}`}
              src={`/experiments/${validSlug}/index.html?v=${data?.lastRun?.commitSha || cacheBuster}`}
              sandbox="allow-scripts allow-forms allow-same-origin"
              title={`${config.title} Interactive Simulation`}
              scrolling="no"
              onLoad={handleIframeLoad}
              style={{
                width: '100%',
                height: `${iframeHeight}px`,
                minHeight: '750px',
                border: 'none',
                display: 'block',
                background: 'transparent',
                overflow: 'hidden',
                transition: 'height 0.15s ease-out',
              }}
            />
          </div>
        </div>
      ) : (
        /* When tests have not passed or repo not linked: Show the prompt */
        <div style={{ maxWidth: '960px', margin: '20px auto 0' }}>
          <div
            style={{
              background: '#fff',
              border: '3px solid #000',
              borderRadius: '16px',
              padding: '36px 32px',
              boxShadow: '6px 6px 0px #000',
            }}
          >
            {/* Status Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    background: isFailed ? '#fee2e2' : '#fef3c7',
                    color: isFailed ? '#b91c1c' : '#b45309',
                    border: '2px solid #000',
                    borderRadius: '999px',
                    padding: '4px 14px',
                    fontWeight: 800,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {isFailed ? '⚠️ Tests Failed' : '⏳ Module In Progress'}
                </span>
                <span
                  style={{
                    background: accentColor,
                    color: '#000',
                    border: '2px solid #000',
                    borderRadius: '999px',
                    padding: '4px 14px',
                    fontWeight: 800,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {config.groupLabel}
                </span>
              </div>

              <button
                onClick={() => fetchStatus(true)}
                disabled={refreshing}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#000',
                  background: '#fff',
                  border: '1.5px solid #000',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  cursor: refreshing ? 'wait' : 'pointer',
                  boxShadow: '2px 2px 0px #000',
                }}
              >
                {refreshing ? 'Checking...' : '↻ Check Status'}
              </button>
            </div>

            <h1 style={{ margin: '0 0 12px', fontSize: '32px', fontWeight: 800 }}>
              {config.title}
            </h1>

            <p style={{ margin: '0 0 24px', fontSize: '16px', lineHeight: 1.6, color: '#444' }}>
              {isFailed
                ? 'The latest automated validation run for this team failed automated testing. Use the official AI guidance prompt below to resolve the rule violations in Claude, ChatGPT, or Cursor so the live simulation can appear here.'
                : 'The student team has not published a passing build yet. Once their repository passes all automated test rules (Ruleset v1: V001–V505), their live experiment will appear here in real time.'}
            </p>

            {/* AI Prompt Section */}
            <div
              style={{
                background: '#faf9f6',
                border: '2px solid #000',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '14px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px' }}>
                    AI Guidance Prompt &amp; Formatting Rules
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    Copy this exact prompt into Claude / ChatGPT / Cursor to build or fix the module.
                  </div>
                </div>

                <button
                  onClick={handleCopyPrompt}
                  style={{
                    background: copySuccess ? '#10b981' : '#c2410c',
                    color: '#fff',
                    border: '2px solid #000',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px #000',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copySuccess ? '✓ Copied to Clipboard!' : 'Copy AI Prompt'}
                </button>
              </div>

              <textarea
                readOnly
                value={AGENT_SYSTEM_PROMPT}
                style={{
                  width: '100%',
                  height: '240px',
                  background: '#27272a',
                  color: '#34d399',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  padding: '14px',
                  borderRadius: '8px',
                  border: '2px solid #000',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                to="/dash"
                style={{
                  background: '#000',
                  color: '#fff',
                  border: '2px solid #000',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0px #000',
                }}
              >
                Go to Dashboard (/dash) &rarr;
              </Link>
              <Link
                to="/team"
                style={{
                  background: '#fff',
                  color: '#000',
                  border: '2px solid #000',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0px #000',
                }}
              >
                View Assigned Team (/team)
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostics Drawer (Live Debugging without Reload) */}
      <div style={{ marginTop: '32px', maxWidth: '1240px', margin: '32px auto 0' }}>
        <button
          onClick={() => setDebugOpen(!debugOpen)}
          style={{
            background: '#f4f4f5',
            border: '1.5px solid #000',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🛠️ Diagnostics &amp; Debug Info</span>
          <span style={{ fontSize: '10px', color: '#666' }}>({debugOpen ? 'Hide' : 'Show'})</span>
        </button>

        {debugOpen && (
          <div
            style={{
              marginTop: '12px',
              background: '#18181b',
              color: '#e4e4e7',
              border: '2px solid #000',
              borderRadius: '12px',
              padding: '16px 20px',
              fontFamily: 'monospace',
              fontSize: '12px',
              lineHeight: 1.6,
              boxShadow: '4px 4px 0px #000',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div><strong>Experiment:</strong> {validSlug} ({config.title})</div>
              <div><strong>Live Status:</strong> {isLive ? '🟢 LIVE' : '⏳ PENDING/UNVERIFIED'}</div>
              <div><strong>Last Run:</strong> {data?.lastRun?.status || 'None'}</div>
              <div><strong>Commit SHA:</strong> {data?.lastRun?.commitSha || 'None'}</div>
              <div><strong>API Latency:</strong> {fetchLatency !== null ? `${fetchLatency}ms` : 'N/A'}</div>
              <div><strong>Last Checked:</strong> {lastCheckTime || 'Just now'}</div>
              <div><strong>Network:</strong> {fetchError ? `❌ ${fetchError}` : '✅ 200 OK'}</div>
              <div><strong>Snapshots:</strong> {data?.snapshotsCount ?? 0}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid #3f3f46', paddingTop: '10px' }}>
              <button
                onClick={() => fetchStatus(true)}
                disabled={refreshing}
                style={{
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {refreshing ? 'Polling API...' : '↻ Re-check Status (No Reload)'}
              </button>
              <span style={{ color: '#a1a1aa', fontSize: '11px' }}>
                Tip: Open browser Developer Tools console to inspect formatted `[CryptoLab:Experiment]` logs.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
