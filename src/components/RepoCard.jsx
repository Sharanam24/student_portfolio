// GitHub repo card matching the reference design:
// - repo icon top-left
// - bold name + star/fork counts inline
// - description text
// - language badge + "View on GitHub →" button row

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  Rust: '#dea584',
  Go: '#00ADD8',
};

export default function RepoCard({ repo }) {
  const langColor = LANG_COLORS[repo.language] ?? '#8b949e';

  return (
    <div className="repo-card">
      <div className="repo-card__header">
        {/* repo icon */}
        <svg className="repo-card__icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z"/>
        </svg>
        <div className="repo-card__meta">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer noopener"
            className="repo-card__name-link"
          >
            {repo.name}
          </a>
          <div className="repo-card__counts">
            <span className="repo-card__stat" aria-label={`${repo.stargazers_count} stars`}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
              {repo.stargazers_count} stars
            </span>
            <span className="repo-card__stat" aria-label={`${repo.forks_count ?? 0} forks`}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>
              {repo.forks_count ?? 0}
            </span>
          </div>
        </div>
      </div>

      <p className="repo-card__desc">
        {repo.description || <span className="repo-card__no-desc">No description provided.</span>}
      </p>

      <div className="repo-card__footer">
        {repo.language && (
          <span className="repo-card__lang">
            <span className="repo-card__lang-dot" style={{ background: langColor }} aria-hidden="true" />
            {repo.language}
          </span>
        )}
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer noopener"
          className="repo-card__link"
          aria-label={`View ${repo.name} on GitHub`}
        >
          View on GitHub →
        </a>
      </div>
    </div>
  );
}
