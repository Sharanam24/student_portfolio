import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import SearchInput from './SearchInput';

afterEach(() => {
  cleanup();
});

describe('SearchInput', () => {
  it('renders a controlled input with aria-label "Search repositories" (Requirement 7.5)', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox', { name: /search repositories/i });
    expect(input).toBeInTheDocument();
  });

  it('displays the value prop as the input value (controlled component)', () => {
    render(<SearchInput value="react" onChange={() => {}} />);
    const input = screen.getByRole('textbox', { name: /search repositories/i });
    expect(input.value).toBe('react');
  });

  it('calls onChange with the raw string value on every keystroke (Requirement 7.5)', () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: /search repositories/i });
    fireEvent.change(input, { target: { value: 'a' } });
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('passes the string value (not the event) to onChange', () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: /search repositories/i });
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(typeof onChange.mock.calls[0][0]).toBe('string');
    expect(onChange.mock.calls[0][0]).toBe('hello');
  });

  it('updates displayed value when value prop changes', () => {
    const { rerender } = render(<SearchInput value="foo" onChange={() => {}} />);
    const input = screen.getByRole('textbox', { name: /search repositories/i });
    expect(input.value).toBe('foo');

    rerender(<SearchInput value="bar" onChange={() => {}} />);
    expect(input.value).toBe('bar');
  });
});
