import { Link } from "react-router-dom";
import "./AuthNav.css";
import React from 'react';
const AuthNav = () => {

  return (
    <nav className="auth-nav">
      <ul className="auth-nav__list">
        <li className="auth-nav__list-item">
          <Link
            to="/signup"
            className="auth-nav__link auth-nav__link_type_signup"
          >
            Register
          </Link>
        </li>
        <li className="auth__list-item">
          <Link
            to="/signin"
            className="auth-nav__link auth-nav__link_type_signin"
          >
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AuthNav;