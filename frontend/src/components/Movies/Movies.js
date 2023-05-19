import MoviesCardList from "../MoviesCardList/MoviesCardList";

function Movies({ movies }) {
  return (
    <>
      <div className="movies">
        <MoviesCardList cards={movies} buttonMore={true} />
      </div>
    </>
  );
}

export default Movies;
