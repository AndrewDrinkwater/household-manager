import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../components/ui/ThemeToggle';

test('toggles theme when clicked', () => {
  localStorage.clear();
  render(<ThemeToggle />);
  const btn = screen.getByRole('button');
  expect(btn.textContent).toBe('🌙');
  fireEvent.click(btn);
  expect(btn.textContent).toBe('☀️');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});
