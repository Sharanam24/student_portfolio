import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchInput from '../components/SearchInput';
import RepoList from '../components/RepoList';

export default function ProjectsPage() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  async function fetchRepos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api.github.com/users/Sharanam24/repos');
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const data = await res.json();
      setRepos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="github-page" aria-labelledby="github-heading">
      <div className="github-page__hero">
        <h2 id="github-heading">GitHub Repositories</h2>
        {!loading && !error && (
          <p className="github-page__subtitle">
            Live data fetched from the GitHub API —{' '}
            <strong>{repos.length}</strong> public{' '}
            {repos.length === 1 ? 'repository' : 'repositories'}.
          </p>
        )}
      </div>

      {loading && <Spinner />}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={fetchRepos} />
      )}

      {!loading && !error && (
        <>
          <div className="github-page__search">
            <SearchInput value={query} onChange={setQuery} />
          </div>
          <RepoList repos={filteredRepos} />
        </>
      )}
    </section>
  );
}
