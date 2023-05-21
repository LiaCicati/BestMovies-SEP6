import React, { useState, useEffect } from "react";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import SearchForm from "../SearchForm/SearchForm";
import movieService from "../../services/movieService";

function Movies({ movies, onCardClickButton }) {
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [displayedMovies, setDisplayedMovies] = useState([]);
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

  const checkSavedMovies = (allMovies, savedMovies) => {
    savedMovies.forEach((savedMovie) => {
      const movie = allMovies.find((item) => item.title === savedMovie.title);

      // Only set isSaved if a matching movie is found
      if (movie) {
        movie.isSaved = true;
      }
    });

    return allMovies;
  };
  useEffect(() => {
    setDisplayedMovies(movies.slice(0, getMoviesCount()));
    setShowMore(movies.length > getMoviesCount());
  }, [movies]);
  const handleSearchSubmit = async (value) => {
    setIsSearching(true);
    setShowMore(false);
    if (value.trim() !== "") {
      try {
        const data = await movieService.getMovieByTitle(value);
        const movies = data.results;
        setSearchedMovies(movies);
        updateSavedMovies(movies); // Update saved movies for searched movies
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    } else {
      setSearchedMovies([]);
      setIsSearching(false);
      updateSavedMovies(movies); // Update saved movies for popular movies
    }
  };
  const handleClickMoreButton = () => {
    const nextBatch = isSearching
      ? searchedMovies.slice(
          displayedMovies.length,
          displayedMovies.length + loadMovies()
        )
      : movies.slice(
          displayedMovies.length,
          displayedMovies.length + loadMovies()
        );
    setDisplayedMovies((prevMovies) => [...prevMovies, ...nextBatch]);
    setShowMore(
      displayedMovies.length + loadMovies() <
        (isSearching ? searchedMovies.length : movies.length)
    );
  };
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        setDisplayedMovies(
          (isSearching ? searchedMovies : movies).slice(0, getMoviesCount())
        );
        setShowMore(
          (isSearching ? searchedMovies : movies).length > getMoviesCount()
        );
      }, 1000);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [movies, searchedMovies, isSearching]);
  // Function to update saved movies
  const updateSavedMovies = (movies) => {
    const updatedMovies = checkSavedMovies(movies, searchedMovies);
    setDisplayedMovies(updatedMovies);
    setShowMore(updatedMovies.length > getMoviesCount());
  };
  return (
    <div className="movies">
      {/* Search form component */}
      <SearchForm onSearchSubmit={handleSearchSubmit} />
      {/* Movie card list component */}
      <MoviesCardList
        cards={displayedMovies}
        onClickMoreButton={handleClickMoreButton}
        onCardClickButton={onCardClickButton}
        buttonMore={showMore}
      />
    </div>
  );
}
export default Movies;
