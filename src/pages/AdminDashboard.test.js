import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';
import supabase from '../supabaseClient';

jest.mock('../supabaseClient');

describe('AdminDashboard', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    supabase.from = jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: [],
          error: null
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          error: null
        }))
      }))
    }));
  });

  test('renders admin panel heading', () => {
    render(<AdminDashboard onLogout={mockOnLogout} />);
    expect(screen.getByText(/Admin Paneli/i)).toBeInTheDocument();
  });

  test('renders logout button', () => {
    render(<AdminDashboard onLogout={mockOnLogout} />);
    expect(screen.getByText(/Çıkış/i)).toBeInTheDocument();
  });

  test('renders products and categories tabs', () => {
    render(<AdminDashboard onLogout={mockOnLogout} />);
    const productsButtons = screen.getAllByText(/Ürünler/i);
    expect(productsButtons.length).toBeGreaterThan(0);
    expect(screen.getByText(/Kategoriler/i)).toBeInTheDocument();
  });

  test('shows new product button when in products view', () => {
    render(<AdminDashboard onLogout={mockOnLogout} />);
    expect(screen.getByText(/Yeni Ürün/i)).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<AdminDashboard onLogout={mockOnLogout} />);
    expect(screen.getByText(/Yükleniyor/i)).toBeInTheDocument();
  });
});
