const LINKS = ['HOME', 'EVENTS', 'SCHEDULE', 'GALLERY', 'SPONSORS', 'CONTACT'];

export default function Navbar({ active = 'EVENTS' }) {
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

      <a href="#" className="navbar-register">
        Register
      </a>
    </nav>
  );
}