import { Link, NavLink } from 'react-router-dom';

export default function NavBar({ name = '', sidebarOpen, onToggleSidebar, darkMode, onToggleDark }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__title">{name}'s Portfolio</Link>

        <div className="site-header__right">
          <button
            className="nav-toggle"
            onClick={onToggleSidebar}
            aria-expanded={sidebarOpen}
            aria-controls="main-nav"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>

          <nav
            id="main-nav"
            className={`site-header__nav${sidebarOpen ? ' site-header__nav--open' : ''}`}
            aria-label="Main navigation"
          >
            <ul role="list">
              <li>
                <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
                  Projects
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
                  Contact
                </NavLink>
              </li>
            </ul>
          </nav>

          <button
            className="dark-toggle"
            onClick={onToggleDark}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
