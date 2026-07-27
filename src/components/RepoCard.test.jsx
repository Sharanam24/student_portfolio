import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import RepoCard from './RepoCard';

afterEach(() => {
  cleanup();
});

const mockRepo = {
  id: 1,
  name: 'my-project',
  html_url: 'https://github.com/user/my-project',
  stargazers_count: 42,
};

describe('RepoCard', () => {
  it('renders repo name as a link (Requirement 6.2)', () => {
    render(<RepoCard repo={mockRepo} />);
    const link = screen.getByRole('link', { name: 'my-project' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/user/my-project');
  });

  it('link opens in a new tab (Requirement 6.2)', () => {
    render(<RepoCard repo={mockRepo} />);
    const link = screen.getByRole('link', { name: 'my-project' });
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('link includes rel="noreferrer noopener" to prevent tab-napping (Requirement 6.5)', () => {
    render(<RepoCard repo={mockRepo} />);
    const link = screen.getByRole('link', { name: 'my-project' });
    const rel = link.getAttribute('rel');
    expect(rel).toContain('noreferrer');
    expect(rel).toContain('noopener');
  });

  it('renders star count as visible text (Requirement 6.3)', () => {
    render(<RepoCard repo={mockRepo} />);
    expect(screen.getByText(/42 stars/i)).toBeInTheDocument();
  });

  it('renders zero stars correctly (Requirement 6.3)', () => {
    render(<RepoCard repo={{ ...mockRepo, stargazers_count: 0 }} />);
    expect(screen.getByText(/0 stars/i)).toBeInTheDocument();
  });
});
