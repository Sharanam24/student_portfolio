import { Link } from 'react-router-dom';
import ProjectsPage from './ProjectsPage';
import { portfolioData } from '../App';

export default function Home({ data }) {
  return (
    <>
      <section className="hero-section" aria-labelledby="hero-heading">
        <h1 id="hero-heading">Hi, I'm {data.name}</h1>
        <p className="hero-tagline">{data.tagline}</p>
        <Link to="/projects" className="hero-link">Learn more about me →</Link>
      </section>
      <ProjectsPage projects={portfolioData.projects} />
    </>
  );
}
