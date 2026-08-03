import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import Spinner from './Spinner';

afterEach(() => {
  cleanup();
});

describe('Spinner', () => {
  it('renders an element with role="status"', () => {
    const { getByRole } = render(<Spinner />);
    expect(getByRole('status')).toBeInTheDocument();
  });

  it('has aria-label="Loading repositories"', () => {
    const { getByRole } = render(<Spinner />);
    expect(getByRole('status')).toHaveAttribute('aria-label', 'Loading repositories');
  });

  it('renders without any props', () => {
    // Requirements 4.2: no required props
    expect(() => render(<Spinner />)).not.toThrow();
  });
});
