export default function Header({ name = '' }) {
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <a href="#" className="site-header__title">{name}'s Portfolio</a>
      </div>
      <nav className="site-header__nav">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Me</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}
