import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = React.memo(() => {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          Box Office <span>Explorer</span>
        </Link>
        {pathname !== '/' && (
          <Link to="/" className="back-btn" style={{ margin: 0 }}>
            ← Retour à la liste
          </Link>
        )}
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
