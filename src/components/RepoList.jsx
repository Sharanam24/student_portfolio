import RepoCard from './RepoCard';

// Grid layout for repo cards, responsive 3-column → 2-column → 1-column

export default function RepoList({ repos }) {
  if (repos.length === 0) {
    return (
      <div className="repo-list-empty">
        No repositories found.
      </div>
    );
  }

  return (
    <div className="repo-grid">
      {repos.map(repo => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
