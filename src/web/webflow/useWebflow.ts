import { useEffect } from 'react';
import { loadWebflowRuntime } from './loadRuntime';

declare global {
  interface Window {
    Webflow?: {
      destroy: () => void;
      ready: () => void;
      require: (mod: string) => { init: () => void };
    };
  }
}

export function useWebflow(deps: unknown[] | unknown = []): void {
  const normalizedDeps = Array.isArray(deps) ? deps : deps !== undefined ? [deps] : [];

  useEffect(() => {
    let cancelled = false;

    // Check prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    loadWebflowRuntime()
      .then(() => {
        if (cancelled) return;
        if (typeof window !== 'undefined' && window.Webflow) {
          try {
            window.Webflow.destroy();
            window.Webflow.ready();
            const ix2 = window.Webflow.require('ix2');
            if (ix2 && typeof ix2.init === 'function') {
              ix2.init();
            }
            document.dispatchEvent(new Event('readystatechange'));
          } catch (e) {
            console.warn('Webflow IX2 re-init error:', e);
          }
        }
      })
      .catch((err) => {
        console.warn('Webflow runtime load failed:', err);
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, normalizedDeps);
}
