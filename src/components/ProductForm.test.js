import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from './ProductForm';
import supabase from '../supabaseClient';

jest.mock('../supabaseClient');

describe('ProductForm', () => {
  const mockOnDone = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    supabase.from = jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: { id: 1 },
            error: null
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          error: null
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({}))
      }))
    }));
    supabase.storage = {
      from: jest.fn(() => ({
        upload: jest.fn(() => ({
          data: { path: 'test.jpg' },
          error: null
        })),
        remove: jest.fn(() => ({}))
      }))
    };
  });

  test('renders form heading', () => {
    render(<ProductForm onDone={mockOnDone} />);
    expect(screen.getByText(/İsim/i)).toBeInTheDocument();
    expect(screen.getByText(/Fiyat/i)).toBeInTheDocument();
  });

  test('shows category section', () => {
    render(<ProductForm onDone={mockOnDone} />);
    expect(screen.getByText(/Kategoriler/i)).toBeInTheDocument();
  });

  test('shows save button', () => {
    render(<ProductForm onDone={mockOnDone} />);
    expect(screen.getByText(/Kaydet/i)).toBeInTheDocument();
  });

  test('shows validation error when required fields are empty', () => {
    render(<ProductForm onDone={mockOnDone} />);
    const saveButton = screen.getByText(/Kaydet/i);
    fireEvent.click(saveButton);
    expect(screen.getByText(/İsim ve fiyat zorunludur/i)).toBeInTheDocument();
  });
});
