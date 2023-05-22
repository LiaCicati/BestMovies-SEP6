import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import React from "react";
function FavoriteMovies({
  showMore,
  displayedMovies,
  onSearchSubmit,
  onClickMoreButton,
  onCardClickButton,
}) {
  return (
    <div className="favorite-movies">
      <SearchForm onSearchSubmit={onSearchSubmit} />
      <MoviesCardList
        cards={displayedMovies}
        onClickMoreButton={onClickMoreButton}
        onCardClickButton={onCardClickButton}
        buttonMore={false}
      />
    </div>
  );
}

export default FavoriteMovies;
