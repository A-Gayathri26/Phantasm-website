import { useState } from 'react';
import { Link } from 'react-router-dom';

const LINKS = ['HOME', 'EVENTS', 'SCHEDULE', 'GALLERY', 'SPONSORS', 'CONTACT'];

export default function Navbar({ active = 'EVENTS' }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="navbar-logo-main">PHANTASM</span>
        <span className="navbar-logo-sub">CSE</span>
      </div>

      <ul className="navbar-links">
        {LINKS.map((link) => (
          <li key={link} data-active={link === active}>
            <a href="#">{link}</a>
          </li>
        ))}
      </ul>

      <Link to="/register" className="navbar-register">
        Register
      </Link>

      {/* Mobile only (see events.css) — .navbar-links/.navbar-register
          above are hidden under 860px with nothing to reach them by, so
          this toggle + panel is the actual way to navigate on a phone. */}
      <button
        type="button"
        className="navbar-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <ul className="navbar-mobile-menu">
          {LINKS.map((link) => (
            <li key={link} data-active={link === active}>
              <a href="#" onClick={() => setOpen(false)}>
                {link}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/register"
              className="navbar-mobile-register"
              onClick={() => setOpen(false)}
            >
              Register
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}