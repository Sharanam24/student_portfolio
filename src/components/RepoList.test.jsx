import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import RepoList from './RepoList';

afterEach(() => {
  cleanup();
});

const mockRepos = [
  {
    id: 1,
    name: 'first-repo',
    html_url: 'https://github.com/user/first-repo',
    stargazers_count: 5,
  },
  {
    id: 2,
    name: 'second-repo',
    html_url: 'https://github.com/user/second-repo',
    stargazers_count: 10,
  },
];

describe('RepoList', () => {
  it('renders an empty-state message when repos is empty (Requirement 6.4)', () => {
    render(<RepoList repos={[]} />);
    expect(screen.getByText(/no repositories found/i)).toBeInTheDocument();
  });

  it('renders one RepoCard per repo when repos is non-empty (Requirement 6.1)', () => {
    render(<RepoList repos={mockRepos} />);
    expect(screen.getByRole('link', { name: 'first-repo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'second-repo' })).toBeInTheDocument();
  });

  it('renders the correct number of cards (Requirement 6.1)', () => {
    render(<RepoList repos={mockRepos} />);
    const cards = document.querySelectorAll('.repo-card');
    expect(cards).toHaveLength(mockRepos.length);
  });

  it('does not render the empty-state message when repos is non-empty', () => {
    render(<RepoList repos={mockRepos} />);
    expect(screen.queryByText(/no repositories found/i)).not.toBeInTheDocument();
  });

  it('renders a single repo correctly', () => {
    render(<RepoList repos={[mockRepos[0]]} />);
    expect(screen.getByRole('link', { name: 'first-repo' })).toBeInTheDocument();
    expect(screen.queryByText(/no repositories found/i)).not.toBeInTheDocument();
  });
});
