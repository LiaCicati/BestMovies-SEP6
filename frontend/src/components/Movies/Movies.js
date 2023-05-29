import React from "react";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import SearchForm from "../SearchForm/SearchForm";

function Movies({
  showMore,
  displayedMovies,
  onSearchSubmit,
  onClickMoreButton,
  onCardClickButton,
}) {
  return (
    <div className="movies">
      <SearchForm onSearchSubmit={onSearchSubmit} />
      <MoviesCardList
        cards={displayedMovies}
        onClickMoreButton={onClickMoreButton}
        onCardClickButton={onCardClickButton}
        buttonMore={showMore}
        movieSearchError={displayedMovies < 1 && "No movies found"}
      />
    </div>
  );
}

export default Movies;
