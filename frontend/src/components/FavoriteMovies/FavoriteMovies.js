import { useState, useEffect } from "react";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import React from "react";
function FavoriteMovies({ favoriteMovies, onClickMoreButton, onCardClickButton }) {
  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState(favoriteMovies);

  const handleSearchSubmit = (value) => {
    setSearchValue(value);
  };

  const searchMovie = (movies, value) =>
    movies.filter((movie) => {
      return movie.title.toLowerCase().includes(value.toLowerCase());
    });

  useEffect(() => {
    const moviesFound = searchMovie(favoriteMovies, searchValue);
    setMovies(moviesFound);
  }, [favoriteMovies, searchValue]);
  return (
    <div className="favorite-movies">
      <SearchForm onSearchSubmit={handleSearchSubmit} />
      <MoviesCardList
        cards={movies}
        onClickMoreButton={onClickMoreButton}
        onCardClickButton={onCardClickButton}
        buttonMore={false}
      />
    </div>
  );
}

export default FavoriteMovies;
