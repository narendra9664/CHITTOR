// frontend/src/App.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// ── MUST be at top level so vitest can hoist them ────────────────

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    to: vi.fn(() => ({ kill: vi.fn() })),
    fromTo: vi.fn(() => ({ kill: vi.fn() })),
    set: vi.fn(),
  },
  gsap: {
    registerPlugin: vi.fn(),
    to: vi.fn(() => ({ kill: vi.fn() })),
    fromTo: vi.fn(() => ({ kill: vi.fn() })),
    set: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: vi.fn(), refresh: vi.fn() },
}));

vi.mock('framer-motion', async () => {
  const React = await import('react');

  const noopComponent = (tag) =>
    // eslint-disable-next-line react/display-name
    React.forwardRef(
      (
        {
          children,
          initial, animate, exit, transition, variants,
          whileHover, whileTap, whileInView, viewport,
          layout, layoutId, drag, dragConstraints,
          onAnimationComplete, onDragStart, onDrag, onDragEnd,
          ...rest
        },
        ref
      ) => React.createElement(tag, { ...rest, ref }, children)
    );

  const motion = new Proxy(
    {},
    { get: (_, tag) => noopComponent(tag) }
  );

  return {
    motion,
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
    useInView: () => true,
    useMotionValue: (v) => ({ get: () => v, set: vi.fn() }),
    useTransform: vi.fn(() => ({ get: vi.fn() })),
  };
});

// ── Import App AFTER mocks are declared ──────────────────────────
import App from './app';

// ── Helpers ───────────────────────────────────────────────────────
const renderApp = () =>
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

// ─────────────────────────────────────────────────────────────────
describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Static content
  test('renders hero headline', () => {
    renderApp();
    expect(screen.getByText(/Promote Your Brand to/i)).toBeInTheDocument();
  });

  test('renders pricing heading', () => {
    renderApp();
    expect(screen.getByText(/Pick the Plan That/i)).toBeInTheDocument();
  });

  test('renders all four plan names', () => {
    renderApp();
    expect(screen.getByText('One Day Story')).toBeInTheDocument();
    expect(screen.getByText("Two's Story & Post")).toBeInTheDocument();
    expect(screen.getByText('Seven Days Premium')).toBeInTheDocument();
    expect(screen.getByText('Permanent Posting')).toBeInTheDocument();
  });

  test('renders stats follower count', () => {
    renderApp();
    expect(screen.getByText('1,00,000+')).toBeInTheDocument();
  });

  test('renders testimonials heading', () => {
    renderApp();
    expect(screen.getByText(/What Our Clients/i)).toBeInTheDocument();
  });

  // Booking modal
  test('opens booking modal on plan select', async () => {
    renderApp();
    fireEvent.click(screen.getAllByText(/Choose Plan/i)[0]);
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    );
    expect(screen.getByPlaceholderText('Your active number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
  });

  test('WhatsApp button appears in modal', async () => {
    renderApp();
    fireEvent.click(screen.getAllByText(/Choose Plan/i)[0]);
    await waitFor(() => {
      const modal = document.querySelector('.modal-overlay');
      expect(modal).toBeTruthy();
      expect(within(modal).getByText(/Submit via WhatsApp/i)).toBeInTheDocument();
    });
  });

  test('modal shows plan price', async () => {
    renderApp();
    fireEvent.click(screen.getAllByText(/Choose Plan/i)[0]); // One Day Story = ₹999
    await waitFor(() => {
      // The modal renders a price display — find it inside the modal overlay
      const modal = document.querySelector('.modal-overlay');
      expect(modal).toBeTruthy();
      expect(within(modal).getByText(/₹999/)).toBeInTheDocument();
    });
  });

  // Form interactions
  test('name input accepts text', async () => {
    renderApp();
    fireEvent.click(screen.getAllByText(/Choose Plan/i)[0]);
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    );
    const input = screen.getByPlaceholderText('Enter your full name');
    fireEvent.change(input, { target: { value: 'Ramesh Sharma' } });
    expect(input.value).toBe('Ramesh Sharma');
  });

  test('phone input accepts number', async () => {
    renderApp();
    fireEvent.click(screen.getAllByText(/Choose Plan/i)[0]);
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Your active number')).toBeInTheDocument()
    );
    const input = screen.getByPlaceholderText('Your active number');
    fireEvent.change(input, { target: { value: '9602221576' } });
    expect(input.value).toBe('9602221576');
  });

  test('alerts when WhatsApp clicked with empty fields', async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderApp();
    fireEvent.click(screen.getAllByText(/Choose Plan/i)[0]);
    await waitFor(() => {
      const modal = document.querySelector('.modal-overlay');
      expect(modal).toBeTruthy();
    });
    // Click the WhatsApp submit button inside the modal
    const modal = document.querySelector('.modal-overlay');
    const waBtn = within(modal).getByText(/Submit via WhatsApp/i);
    fireEvent.click(waBtn);
    expect(window.alert).toHaveBeenCalledWith(
      'Please enter your name and contact number.'
    );
  });

  test('opens wa.me link when fields are filled', async () => {
    vi.spyOn(window, 'open').mockImplementation(() => {});
    renderApp();
    fireEvent.click(screen.getAllByText(/Choose Plan/i)[0]);
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    );
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Your active number'), {
      target: { value: '9876543210' },
    });
    // Use getByRole to target the actual button (not the footer link text)
    const modal = document.querySelector('.modal-overlay');
    const waBtn = within(modal).getByText(/Submit via WhatsApp/i);
    fireEvent.click(waBtn);
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('wa.me/919602221576'),
      '_blank'
    );
  });
});