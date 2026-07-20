export default function Hero({ name = '', tagline = '' }) {
  return (
    <section id="home" className="hero-section">
      <h1>Hi, I'm {name}</h1>
      <p className="hero-tagline">{tagline}</p>
      <a href="#about" className="hero-link">Learn more about me →</a>
    </section>
  );
}
