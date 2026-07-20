import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import Header from './Header';

afterEach(() => {
  cleanup();
});

describe('Header', () => {
  it('renders the name prop', () => {
    const { getByText } = render(<Header name="Alex Johnson" tagline="Frontend Developer" />);
    expect(getByText('Alex Johnson')).toBeInTheDocument();
  });

  it('renders the tagline prop', () => {
    const { getByText } = render(<Header name="Alex" tagline="Developer" />);
    expect(getByText('Developer')).toBeInTheDocument();
  });

  it('renders gracefully when props are empty', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  /**
   * Property 1: Props are reflected in rendered output
   * Validates: Requirements 2.3
   */
  it('property: any name and tagline strings appear in rendered output', () => {
    // Use strings with at least one non-whitespace character.
    const printableString = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0);
    fc.assert(
      fc.property(
        printableString,
        printableString,
        (name, tagline) => {
          const { container, unmount } = render(<Header name={name} tagline={tagline} />);
          try {
            // Check by querying specific elements to avoid cross-element conflicts
            const h1 = container.querySelector('h1');
            const p = container.querySelector('p');
            expect(h1).not.toBeNull();
            expect(p).not.toBeNull();
            expect(h1.textContent).toBe(name);
            expect(p.textContent).toBe(tagline);
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
