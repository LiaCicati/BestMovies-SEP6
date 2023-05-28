import "./Footer.css";
import { useLocation } from "react-router-dom";
import React from "react";
const Footer = () => {
  const location = useLocation();
  const isSignUpPage = location.pathname === "/signup";
  const isSignInPage = location.pathname === "/signin";
  const isProfilePage = location.pathname === "/profile";
  return (
    !isSignInPage &&
    !isSignUpPage && !isProfilePage &&(
      <footer className="footer">
        <h3 className="footer__title">
          VIA University College student project х BestMovies.
        </h3>
        <div className="footer__container">
          <p className="footer__copyright">&#169; 2023</p>

          <nav className="footer__nav">
            <ul className="footer__nav-list">
              <li className="footer__nav-item">
                <a
                  className="footer__nav-link"
                  href="https://github.com/LiaCicati/BestMovies-SEP6"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    )
  );
};

export default Footer;
