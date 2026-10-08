let runtimePromise: Promise<void> | null = null;

function appendScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already appended
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const s = document.createElement('script');
    s.src = src;
    s.type = 'text/javascript';
    s.onload = () => resolve();
    s.onerror = (err) => reject(new Error(`Failed to load ${src}: ${err}`));
    document.body.appendChild(s);
  });
}

export function loadWebflowRuntime(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (runtimePromise) {
    return runtimePromise;
  }

  runtimePromise = (async () => {
    // 1. Load jQuery
    await appendScript('/js/jquery-3.5.1.min.dc5e7f18c8.js');
    // 2. Load Webflow runtime
    await appendScript('/js/webflow.04b571216.js');
  })();

  return runtimePromise;
}
