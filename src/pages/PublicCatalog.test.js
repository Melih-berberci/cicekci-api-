import { render, screen } from '@testing-library/react';
import PublicCatalog from './PublicCatalog';
import supabase from '../supabaseClient';

jest.mock('../supabaseClient');

describe('PublicCatalog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    supabase.from = jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            data: [],
            error: null
          }))
        }))
      }))
    }));
  });

  test('renders products heading', () => {
    render(<PublicCatalog />);
    expect(screen.getByText(/Ürünler/i)).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<PublicCatalog />);
    expect(screen.getByText(/Yükleniyor/i)).toBeInTheDocument();
  });

  test('renders empty state when no products', async () => {
    render(<PublicCatalog />);
    await screen.findByText(/Henüz yayınlanmış ürün yok/i);
  });
});
