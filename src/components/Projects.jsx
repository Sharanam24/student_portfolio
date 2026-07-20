import { useState } from 'react';

const ALL_CATEGORIES = ['All', 'Web', 'AI / ML'];

export default function Projects({ projects = [] }) {
  const [active, setActive] = useState('All');

  const filtered = active === 'All'
    ? projects
    : projects.filter(p => p.category === active);

  return (
    <section id="projects" className="projects-section">
      <h2>My Projects</h2>
      <p className="projects-intro">Here are some of the professional and academic projects I have built.</p>

      <div className="filter-tabs">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-tab${active === cat ? ' filter-tab--active' : ''}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="project-list">
        {filtered.map((project, i) => (
          <div key={i} className="project-card">
            <h3 className="project-card__title">{project.title}</h3>
            <p className="project-card__desc">{project.description}</p>
            <p className="project-card__tech">{project.tech.join(' · ')}</p>
            <a href={project.repo} className="project-card__link">View Project Repository →</a>
            <span className="project-card__category">{project.category}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
