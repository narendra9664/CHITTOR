// vitest.setup.js — global polyfills for jsdom
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ── IntersectionObserver (used by framer-motion whileInView) ──────
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// ── ResizeObserver ────────────────────────────────────────────────
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// ── matchMedia (responsive hooks) ─────────────────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ── scrollIntoView ─────────────────────────────────────────────────
window.HTMLElement.prototype.scrollIntoView = vi.fn();