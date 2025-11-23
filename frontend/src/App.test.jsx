// frontend/src/App.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';
import '@testing-library/jest-dom';

// Mock the Razorpay library
global.Razorpay = vi.fn();

// Mock the API calls
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ booking_id: 'BK-TEST123', amount: 999 }),
  })
);

describe('App Component', () => {
  const renderApp = () => {
    render(<App />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders main sections correctly', () => {
    renderApp();

    // Check for main sections
    expect(screen.getByText('Promote Your Brand to')).toBeInTheDocument();
    expect(screen.getByText('Trusted by Local Businesses')).toBeInTheDocument();
    expect(screen.getByText('Why Choose chittorgarh_vlog?')).toBeInTheDocument();
    expect(screen.getByText('Ready to Reach Chittorgarh?')).toBeInTheDocument();
    expect(screen.getByText('Success Stories')).toBeInTheDocument();
    expect(screen.getByText('Simple, Transparent Pricing')).toBeInTheDocument();
  });

  test('booking modal opens when plan is selected', async () => {
    renderApp();

    // Find and click on "Choose Plan" button for the "One Day Story" plan
    const planButtons = screen.getAllByText('Choose Plan');
    const oneDayPlanButton = planButtons[0]; // First plan is One Day Story

    fireEvent.click(oneDayPlanButton);

    // Check that the booking modal opens
    await waitFor(() => {
      expect(screen.getByText('Book Your Plan')).toBeInTheDocument();
    });

    // Check that form fields are present
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your contact number')).toBeInTheDocument();
  });

  test('handles form input changes', async () => {
    renderApp();

    // Open the booking modal
    const planButtons = screen.getAllByText('Choose Plan');
    fireEvent.click(planButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Book Your Plan')).toBeInTheDocument();
    });

    // Test input changes
    const nameInput = screen.getByPlaceholderText('Your full name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');

    const emailInput = screen.getByPlaceholderText('your@email.com');
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    expect(emailInput.value).toBe('john@example.com');

    const contactInput = screen.getByPlaceholderText('Your contact number');
    fireEvent.change(contactInput, { target: { value: '9876543210' } });
    expect(contactInput.value).toBe('9876543210');
  });

  test('sets booking data when plan is selected', () => {
    renderApp();

    // This test verifies that selecting a plan sets the booking data correctly
    // which is an important interaction in the component
    const planButtons = screen.getAllByText('Choose Plan');
    const firstPlanButton = planButtons[0]; // This is for the first plan

    fireEvent.click(firstPlanButton);

    // Check that the booking data is set (we can verify this by checking if the form appears)
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
  });
});