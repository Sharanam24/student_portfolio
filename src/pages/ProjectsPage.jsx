import { useState } from 'react';

const ALL_CATEGORIES = ['All', 'Web', 'AI / ML'];

export default function ProjectsPage({ projects = [] }) {
  const [active, setActive] = useState('All');

  const filtered = active === 'All'
    ? projects
    : projects.filter(p => p.category.includes(active));

  return (
    <section className="projects-section" aria-labelledby="projects-heading">
      <h2 id="projects-heading">My Projects</h2>
      <p className="projects-intro">Here are some of the professional and academic projects I have built.</p>

      <div className="filter-tabs" role="group" aria-label="Filter by category">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-tab${active === cat ? ' filter-tab--active' : ''}`}
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="project-grid">
        {filtered.map((project, i) => (
          <article key={i} className="project-card">
            <div className="project-card__categories">
              {project.category.map(cat => (
                <span key={cat} className="project-card__category">{cat}</span>
              ))}
            </div>
            <h3 className="project-card__title">{project.title}</h3>
            <p className="project-card__desc">{project.description}</p>
            <div className="project-card__tags">
              {project.tech.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <a
              href={project.repo}
              className="project-card__link"
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title} on GitHub`}
            >
              View Project Repository →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
