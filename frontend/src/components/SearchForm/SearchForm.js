import "./SearchForm.css";
import { useState } from "react";
import React from 'react';
const SearchForm = ({ onSearchSubmit }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleChange(evt) {
    setValue(evt.target.value);
  }

   const removeWhiteSpace = (value) => {
    return value.trim();
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    if (!value) {
      setError('error');
    } else {
      setError("");
      onSearchSubmit(removeWhiteSpace(value));
    }
  }
  return (
    <section className="search">
      <form className="search__form" onSubmit={handleSubmit} noValidate>
        <div className="search__container">
          <div className="search__icon"></div>
          <input
            placeholder="Movie"
            className="search__input"
            type="text"
            required
            minLength="3"
            value={value}
            onChange={handleChange}
          ></input>
          <button className="search__button" type="submit">
            Search
          </button>
        </div>
      </form>
      {error && <span className="search__error">{error}</span>}
    </section>
  );
};

export default SearchForm;
