import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /welcome to household manager/i });
  expect(heading).toBeInTheDocument();
});
