import { useState, useEffect } from "react";
import MoviesCardList from "../MoviesCardList/MoviesCardList";

function Movies({ movies }) {
  const getMoviesCount = () => {
    switch (true) {
      case window.innerWidth >= 944:
        return 12;
      case window.innerWidth >= 570:
        return 8;
      default:
        return 5;
    }
  };

  const loadMovies = () => {
    if (window.innerWidth >= 944) {
      return 3;
    }
    return 2;
  };
  const [moviesCount, setMoviesCount] = useState(getMoviesCount());
  const [allMovies, setAllMovies] = useState([]);
  const [currentMovies, setCurrentMovies] = useState([]);

  const handleClickMoreButton = () => {
    setMoviesCount(moviesCount + loadMovies());
  };

  useEffect(() => {
    setAllMovies(movies);
    setCurrentMovies(movies.slice(0, moviesCount));
  }, [movies, moviesCount]);

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        setMoviesCount(getMoviesCount());
        setCurrentMovies(allMovies.slice(0, getMoviesCount()));
      }, 1000);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [allMovies]);

  return (
    <>
      <div className="movies">
        <MoviesCardList
          cards={currentMovies}
          onClickMoreButton={handleClickMoreButton}
          buttonMore={currentMovies.length < allMovies.length}
        />
      </div>
    </>
  );
}

export default Movies;
