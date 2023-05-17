import { Link } from "react-router-dom";
import "./Auth.css";
import React from "react";
const Auth = ({ buttonText, linkText, paragraph, href, isDisabledButton }) => {
  return (
    <div className="auth">
      <button
        className={`auth__submit-button ${
          isDisabledButton ? "auth__submit-button_disabled" : ""
        }`}
        type="submit"
        disabled={isDisabledButton}
      >
        {buttonText}
      </button>
      <div className="auth__redirect">
        <p className="auth__paragraph">{paragraph}</p>
        <Link to={href} className="auth__link">
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default Auth;
