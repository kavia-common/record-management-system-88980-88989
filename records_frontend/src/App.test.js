import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header title', () => {
  render(<App />);
  const header = screen.getByText(/Record Management/i);
  expect(header).toBeInTheDocument();
});
