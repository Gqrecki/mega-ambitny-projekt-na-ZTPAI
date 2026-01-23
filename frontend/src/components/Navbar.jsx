import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">🍸</span>
          <span className="navbar-title">DrinkAdvisor</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/drinks" className="navbar-link">
            Drinks
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/favorites" className="navbar-link">
                Favorites
              </Link>
              <Link to="/my-reviews" className="navbar-link">
                My Reviews
              </Link>
              {isAdmin() && (
                <Link to="/admin" className="navbar-link navbar-link-admin">
                  Admin
                </Link>
              )}
              <div className="navbar-user">
                <span className="navbar-username">{user?.username}</span>
                <button onClick={logout} className="navbar-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-button">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
