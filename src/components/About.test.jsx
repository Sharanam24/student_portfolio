import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import About from './About';

afterEach(() => {
  cleanup();
});

describe('About', () => {
  it('renders the bio prop', () => {
    const { getByText } = render(<About bio="A passionate developer." />);
    expect(getByText('A passionate developer.')).toBeInTheDocument();
  });

  it('renders gracefully when bio is empty', () => {
    const { container } = render(<About />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  /**
   * Property 1 (About): Props are reflected in rendered output
   * Validates: Requirements 2.3
   */
  it('property: any bio string appears in rendered output', () => {
    // Use strings with at least one non-whitespace character.
    const printableString = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0);
    fc.assert(
      fc.property(
        printableString,
        (bio) => {
          const { container, unmount } = render(<About bio={bio} />);
          try {
            const p = container.querySelector('p');
            expect(p).not.toBeNull();
            expect(p.textContent).toBe(bio);
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
