// src/App.test.js
import { render } from '@testing-library/react';
import App from './App';

// Mock anything from src/api to avoid loading axios
jest.mock('./api', () => ({}));

test('renders App without crashing', () => {
  render(<App />);
});
