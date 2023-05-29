import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import "./Header.css";
import AuthNav from "../AuthNav/AuthNav";
import MoviesNav from "../MoviesNav/MoviesNav";
import React from "react";
const Header = () => {
  const currentUser = useContext(CurrentUserContext);
  const location = useLocation();
  const isSignUpPage = location.pathname === "/signup";
  const isSignInPage = location.pathname === "/signin";

  return (
    !isSignInPage &&
    !isSignUpPage && (
      <header
        className={`header ${!currentUser.email ? "header_type_auth" : ""}`}
      >
        <Link to="/" className="header__link">
          <h3 className="header__logo">BM</h3>
        </Link>

        {!currentUser.email && <AuthNav />}
        {currentUser.email && <MoviesNav />}
      </header>
    )
  );
};

export default Header;
