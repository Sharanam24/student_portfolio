import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import Skills from './Skills';

afterEach(() => {
  cleanup();
});

describe('Skills', () => {
  it('renders each skill as a list item', () => {
    const skills = ['React', 'JavaScript', 'CSS'];
    const { getByText } = render(<Skills skills={skills} />);
    skills.forEach((skill) => {
      expect(getByText(skill)).toBeInTheDocument();
    });
  });

  it('renders an empty list gracefully when skills is empty', () => {
    const { container } = render(<Skills skills={[]} />);
    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(0);
  });

  it('renders gracefully when skills prop is omitted', () => {
    const { container } = render(<Skills />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  /**
   * Property 1 (Skills): Props are reflected in rendered output
   * Validates: Requirements 2.3
   */
  it('property: every skill string appears in rendered output', () => {
    // Use strings with at least one non-whitespace character.
    const printableString = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0);
    fc.assert(
      fc.property(
        fc.array(printableString, { minLength: 1 }),
        (skills) => {
          const { container, unmount } = render(<Skills skills={skills} />);
          try {
            const listItems = Array.from(container.querySelectorAll('li'));
            expect(listItems).toHaveLength(skills.length);
            skills.forEach((skill, index) => {
              expect(listItems[index].textContent).toBe(skill);
            });
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
