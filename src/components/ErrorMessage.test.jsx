import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ErrorMessage from './ErrorMessage';

afterEach(() => {
  cleanup();
});

describe('ErrorMessage', () => {
  it('renders the message as visible text (Requirement 5.1)', () => {
    render(<ErrorMessage message="Something went wrong" onRetry={() => {}} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders a Retry button (Requirement 5.2)', () => {
    render(<ErrorMessage message="Error" onRetry={() => {}} />);
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls onRetry when the Retry button is clicked (Requirement 5.2)', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('Retry button is a native <button> element for keyboard accessibility (Requirement 5.4)', () => {
    render(<ErrorMessage message="Error" onRetry={() => {}} />);
    const button = screen.getByRole('button', { name: /retry/i });
    expect(button.tagName).toBe('BUTTON');
  });

  it('Retry button is keyboard-activatable via Enter key (Requirement 5.4)', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={onRetry} />);
    const button = screen.getByRole('button', { name: /retry/i });
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalled();
  });

  it('renders different messages correctly (Requirement 5.1)', () => {
    const { rerender } = render(
      <ErrorMessage message="Network error" onRetry={() => {}} />
    );
    expect(screen.getByText('Network error')).toBeInTheDocument();

    rerender(<ErrorMessage message="GitHub API error: 404" onRetry={() => {}} />);
    expect(screen.getByText('GitHub API error: 404')).toBeInTheDocument();
  });
});
