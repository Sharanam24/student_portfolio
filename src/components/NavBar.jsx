import { Link, NavLink } from 'react-router-dom';

export default function NavBar({ name = '', sidebarOpen, onToggleSidebar, darkMode, onToggleDark, isAuthenticated, userEmail, onLogout }) {
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
                <NavLink to="/tasks-api" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
                  Tasks API
                </NavLink>
              </li>
              <li>
                <NavLink to="/certificates" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
                  Certificates
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
                  Contact
                </NavLink>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="nav-user-item">
                    <span className="nav-user-badge" title={userEmail}>
                      👤 {userEmail.split('@')[0]}
                    </span>
                  </li>
                  <li>
                    <button onClick={onLogout} className="nav-logout-btn">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
                      Register
                    </NavLink>
                  </li>
                </>
              )}
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
