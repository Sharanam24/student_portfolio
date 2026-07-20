import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import Footer from './Footer';

afterEach(() => {
  cleanup();
});

describe('Footer', () => {
  it('renders the email prop', () => {
    const { getByText } = render(<Footer email="alex@example.com" year={2025} />);
    expect(getByText('alex@example.com')).toBeInTheDocument();
  });

  it('renders the year prop', () => {
    const { getByText } = render(<Footer email="test@test.com" year={2025} />);
    expect(getByText('© 2025')).toBeInTheDocument();
  });

  it('renders gracefully when props are empty', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  /**
   * Property 1 (Footer): Props are reflected in rendered output
   * Validates: Requirements 2.3
   */
  it('property: any email string and year integer appear in rendered output', () => {
    // Use strings with at least one non-whitespace character.
    const printableString = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0);
    fc.assert(
      fc.property(
        printableString,
        fc.integer(),
        (email, year) => {
          const { container, unmount } = render(<Footer email={email} year={year} />);
          try {
            const paragraphs = Array.from(container.querySelectorAll('p'));
            // email paragraph
            const emailPara = paragraphs.find((p) => p.textContent === email);
            expect(emailPara).not.toBeUndefined();
            // year paragraph: © {year}
            const yearPara = paragraphs.find((p) => p.textContent === `© ${year}`);
            expect(yearPara).not.toBeUndefined();
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
