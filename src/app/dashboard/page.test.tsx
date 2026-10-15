import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CashierDashboard from './page';

// 1. Mock the API Call
// We intercept the network request so the test runs instantly 
// and doesn't actually add fake data to your real Supabase database.
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

describe('Cashier Dashboard UI', () => {
  
  beforeEach(() => {
    // Clear the fake network history before every test
    (global.fetch as jest.Mock).mockClear();
  });

  // Test 1: Does the page load?
  it('renders the transaction form', () => {
    render(<CashierDashboard />);
    
    // Looks for the exact text on the screen, just like a user would
    expect(screen.getByText('New Transaction')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Payment/i })).toBeInTheDocument();
  });

  // Test 2: Does the state update when typing?
  it('allows the cashier to enter an amount', () => {
    render(<CashierDashboard />);
    
    // Find the input box by its placeholder
    const input = screen.getByPlaceholderText('0.00');
    
    // Simulate a human typing "150" into the keyboard
    fireEvent.change(input, { target: { value: '150' } });
    
    // Verify the React state successfully updated the input field
    expect(input).toHaveValue(150);
  });

  // Test 3: Does it prevent double-clicking?
  it('shows a loading state and calls the API when submitted', () => {
    render(<CashierDashboard />);
    
    const input = screen.getByPlaceholderText('0.00');
    const button = screen.getByRole('button', { name: /Submit Payment/i });
    
    // Type an amount and click submit
    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.click(button);
    
    // Verify the UI immediately protects against double-clicks
    expect(button).toHaveTextContent('Processing...');
    
    // Verify the React component successfully fired the data to the backend
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});