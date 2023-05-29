import "./MoviesNav.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import React from "react";

const MoviesNav = () => {
  const [showItems, setShowItems] = useState(false);

  const toggleSidebar = () => setShowItems(!showItems);

  return (
    <nav className="nav">
      <button
        className="nav__menu-button"
        type="button"
        onClick={toggleSidebar}
      ></button>
      <div
        className={`nav__container ${
          showItems ? "nav__container_visible" : ""
        }`}
      >
        <div
          className={`nav__sidebar ${showItems ? "nav__sidebar_visible" : ""}`}
        >
          <div className="nav__list-container">
            <button
              className="nav__button-close"
              type="button"
              onClick={toggleSidebar}
            ></button>

            <ul className="nav__list">
              <li className="nav__list-item">
                <NavLink to="/" className="nav__link">
                  Home
                </NavLink>
              </li>
              <li className="nav__list-item">
                <NavLink to="/statistics" className="nav__link">
                  Statistics
                </NavLink>
              </li>
              <li className="nav__list-item">
                <NavLink to="/favorites" className="nav__link">
                  My Favorites
                </NavLink>
              </li>
              <li className="nav__list-item">
                <NavLink to="/my-ratings" className="nav__link">
                  My Ratings
                </NavLink>
              </li>
            </ul>
          </div>
          <NavLink to="/profile" className="nav__link nav__link_type_profile">
            Profile
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default MoviesNav;
