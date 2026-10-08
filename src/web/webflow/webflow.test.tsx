// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useWebflow } from './useWebflow';

// Mock loadWebflowRuntime
vi.mock('./loadRuntime', () => ({
  loadWebflowRuntime: vi.fn().mockResolvedValue(undefined),
}));

// @ts-expect-error flag for react act
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('useWebflow hook (H2)', () => {
  const destroySpy = vi.fn();
  const readySpy = vi.fn();
  const initSpy = vi.fn();
  let container: HTMLDivElement;

  beforeEach(() => {
    vi.clearAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);

    window.Webflow = {
      destroy: destroySpy,
      ready: readySpy,
      require: vi.fn((mod: string) => {
        if (mod === 'ix2') return { init: initSpy };
        return { init: vi.fn() };
      }),
    };

    // Default: reduced motion false
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  function TestComponent({ page }: { page: string }) {
    useWebflow([page]);
    return <div>Page: {page}</div>;
  }

  it('initializes Webflow IX2 on mount', async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(<TestComponent page="home" />);
    });

    expect(destroySpy).toHaveBeenCalledTimes(1);
    expect(readySpy).toHaveBeenCalledTimes(1);
    expect(initSpy).toHaveBeenCalledTimes(1);
  });

  it('re-initializes Webflow IX2 on route dependency change', async () => {
    function Parent() {
      const [page, setPage] = useState('home');
      return (
        <div>
          <button id="switch-btn" onClick={() => setPage('about')}>Switch</button>
          <TestComponent page={page} />
        </div>
      );
    }

    const root = createRoot(container);
    await act(async () => {
      root.render(<Parent />);
    });

    expect(initSpy).toHaveBeenCalledTimes(1);

    const btn = container.querySelector('#switch-btn') as HTMLButtonElement;
    await act(async () => {
      btn.click();
    });

    expect(destroySpy).toHaveBeenCalledTimes(2);
    expect(initSpy).toHaveBeenCalledTimes(2);
  });

  it('skips IX2 initialization if prefers-reduced-motion is true', async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const root = createRoot(container);
    await act(async () => {
      root.render(<TestComponent page="reduced" />);
    });

    expect(destroySpy).not.toHaveBeenCalled();
    expect(initSpy).not.toHaveBeenCalled();
  });
});
