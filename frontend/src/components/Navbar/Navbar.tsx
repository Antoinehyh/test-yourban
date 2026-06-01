import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = React.memo(() => {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          Box Office <span>Explorer</span>
        </Link>
        {pathname !== '/' && (
          <Link to="/" className="back-link">
            ← Retour à la liste
          </Link>
        )}
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
