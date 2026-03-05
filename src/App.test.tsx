import { render, screen } from '@testing-library/react';
import App from './App';

test('renders 360 Feedback System header', () => {
  render(<App />);
  const headerElement = screen.getByText(/360 Feedback System/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders Dashboard by default', () => {
  render(<App />);
  // We use getAllByText since "Dashboard" appears in both the nav and the heading
  const dashboardElements = screen.getAllByText(/Dashboard/i);
  expect(dashboardElements.length).toBeGreaterThan(0);

  // Checking that our mock data renders
  const employeeElement = screen.getByText(/Alice Johnson/i);
  expect(employeeElement).toBeInTheDocument();
});
