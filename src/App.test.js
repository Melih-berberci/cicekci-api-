import { render, screen } from '@testing-library/react';
import App from './App';

test('renders products heading', () => {
  render(<App />);
  const heading = screen.getByText(/Ürünler/i);
  expect(heading).toBeInTheDocument();
});
