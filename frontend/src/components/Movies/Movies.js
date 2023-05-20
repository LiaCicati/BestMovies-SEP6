import React, { useState, useEffect } from "react";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import SearchForm from "../SearchForm/SearchForm";
import movieService from "../../services/movieService";

function Movies({ movies }) {
  // State variables
  const [searchedMovies, setSearchedMovies] = useState([]); // Stores the movies searched by the user
  const [isSearching, setIsSearching] = useState(false); // Indicates if the user is currently searching
  const [showMore, setShowMore] = useState(false); // Controls whether to show the "Load More" button
  const [displayedMovies, setDisplayedMovies] = useState([]); // Stores the movies to be displayed on the screen

  // Determines the number of movies to be displayed based on the window width
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

  // Determines the number of movies to load when the "Load More" button is clicked
  const loadMovies = () => {
    if (window.innerWidth >= 944) {
      return 3;
    }
    return 2;
  };

  // Updates the displayed movies and the "Load More" button when the movies prop changes
  useEffect(() => {
    setDisplayedMovies(movies.slice(0, getMoviesCount())); // Display initial batch of movies
    setShowMore(movies.length > getMoviesCount()); // Show "Load More" button if there are more movies to display
  }, [movies]);

  // Handles the submission of the search form
  const handleSearchSubmit = async (value) => {
    setIsSearching(true); // Set searching flag to true
    setShowMore(false); // Hide the "Load More" button

    if (value.trim() !== "") {
      try {
        const data = await movieService.getMovieByTitle(value); // Make API call to get movies by title
        const movies = data.results; // Extract movies from the API response
        setSearchedMovies(movies); // Store the searched movies
        setDisplayedMovies(movies.slice(0, getMoviesCount())); // Display initial batch of searched movies
        setShowMore(movies.length > getMoviesCount()); // Show "Load More" button if there are more searched movies
      } catch (error) {
        console.error("Error searching movies:", error); // Log error if the API call fails
      }
    } else {
      setSearchedMovies([]); // Clear the searched movies
      setIsSearching(false); // Set searching flag to false
    }
  };

  // Handles the click event of the "Load More" button
  const handleClickMoreButton = () => {
    const nextDisplayedMovies = isSearching
      ? searchedMovies.slice(
          displayedMovies.length,
          displayedMovies.length + loadMovies()
        )
      : movies.slice(
          displayedMovies.length,
          displayedMovies.length + loadMovies()
        );

    setDisplayedMovies((prevMovies) => [...prevMovies, ...nextDisplayedMovies]); // Append the next batch of movies to the displayed movies
    setShowMore(
      displayedMovies.length + loadMovies() <
        (isSearching ? searchedMovies.length : movies.length)
    ); // Update the "Load More" button visibility
  };

  // Handles the resize event to update the displayed movies and the "Load More" button
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        setDisplayedMovies(
          (isSearching ? searchedMovies : movies).slice(0, getMoviesCount())
        ); // Update displayed movies based on current search or all movies
        setShowMore(
          (isSearching ? searchedMovies : movies).length > getMoviesCount()
        ); // Update "Load More" button visibility
      }, 1000);
    };

    window.addEventListener("resize", handleResize); // Add event listener for window resize
    return () => window.removeEventListener("resize", handleResize); // Remove event listener on cleanup
  }, [movies, searchedMovies, isSearching]);

  return (
    <div className="movies">
      <SearchForm onSearchSubmit={handleSearchSubmit} />
      <MoviesCardList
        cards={displayedMovies}
        onClickMoreButton={handleClickMoreButton}
        buttonMore={showMore}
      />
    </div>
  );
}

export default Movies;
