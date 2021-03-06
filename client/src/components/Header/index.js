import React from 'react';
import { Link } from "react-router-dom";
import Auth from '../../utils/auth';

const Header = () => {

  const logout = e => {
    // overrides the default nature of the hyperlink
    e.preventDefault();
    Auth.logout();
  }

  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h1>Deep Thoughts</h1>
        </Link>

        <nav>
          {Auth.loggedIn() ? (
          <>
            <Link to ="/profile">My Profile</Link>
            <a href="/" onClick={logout}>
              Logout
            </a>
          </>) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>)}
        </nav>
      </div>
    </header>
  );
};

export default Header;
