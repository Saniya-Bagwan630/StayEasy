import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-link">
          <div className="brand-icon">🏨</div>
          <span className="brand-title">
            Stay<span>Easy</span>
          </span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link
              to="/"
              className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              Explore Hotels
            </Link>
          </li>
          <li>
            <Link
              to="/bookings"
              className={`nav-item ${location.pathname === '/bookings' ? 'active' : ''}`}
            >
              My Bookings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
