import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = React.memo(() => {
  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          Box Office <span>Explorer</span>
        </Link>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
