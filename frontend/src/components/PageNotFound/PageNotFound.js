import { useNavigate } from "react-router-dom";
import "./PageNotFound.css";
import React from "react";
const PageNotFound = () => {
  const navigate = useNavigate();

  function handleClickButtonBack() {
    navigate("/");
  }

  return (
    <div className="error">
      <div className="error__container">
        <h1 className="error__title">404</h1>
        <p className="error__subtitle">Page not found</p>
      </div>
      <button
        type="button"
        className="error__button"
        onClick={handleClickButtonBack}
      >
        Back to home page
      </button>
    </div>
  );
};

export default PageNotFound;
