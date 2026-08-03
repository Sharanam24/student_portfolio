import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProjectsPage from './ProjectsPage';

const mockRepos = [
  { id: 1, name: 'awesome-project', html_url: 'https://github.com/user/awesome-project', stargazers_count: 10 },
  { id: 2, name: 'cool-app',        html_url: 'https://github.com/user/cool-app',        stargazers_count: 5  },
  { id: 3, name: 'portfolio-site',  html_url: 'https://github.com/user/portfolio-site',  stargazers_count: 3  },
];

describe('ProjectsPage', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 9.1 Happy-path unit test — Requirements 9.1
  it('renders repo names after a successful fetch and removes Spinner (Requirement 9.1)', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockRepos,
    });

    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    // Spinner should appear while loading
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for fetch to resolve and repos to be rendered
    await waitFor(() => {
      expect(screen.getByText('awesome-project')).toBeInTheDocument();
    });

    expect(screen.getByText('cool-app')).toBeInTheDocument();
    expect(screen.getByText('portfolio-site')).toBeInTheDocument();

    // Spinner must be gone after data loads
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  // 9.2 Error-path unit test — Requirements 9.2
  it('renders ErrorMessage with error text when fetch returns a non-ok response (Requirement 9.2)', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });

    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    // Wait for fetch to settle and ErrorMessage to appear
    await waitFor(() => {
      expect(screen.getByText('GitHub API error: 500')).toBeInTheDocument();
    });

    // RepoList must not be present — no repo links should be visible
    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    // Spinner must be gone
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
