import React, { useEffect, useState } from "react";
import ratingService from "../../services/ratingService";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import SearchForm from "../SearchForm/SearchForm";
import Preloader from "../Preloader/Preloader";
function RatedMovies() {
  const [ratings, setRatings] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState(ratings);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchSubmit = (value) => {
    setSearchValue(value);
  };

  const searchMovie = (movies, value) =>
    movies.filter((movie) => {
      return movie.title.toLowerCase().includes(value.toLowerCase());
    });

  useEffect(() => {
    const moviesFound = searchMovie(ratings, searchValue);
    setMovies(moviesFound);
  }, [ratings, searchValue]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    ratingService
      .getRatings(token)
      .then((fetchedRatings) => {
        setRatings(fetchedRatings);
      })
      .catch((error) => {
        console.error("Error fetching ratings:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="rated-movies">
      <SearchForm onSearchSubmit={handleSearchSubmit} />
      {isLoading && <Preloader />}
      <MoviesCardList
        cards={movies}
        movieSearchError={
          ratings < 1
            ? "No ratings"
            : "Sorry, we couldn't find any movies that match your search criteria."
        }
      />
    </div>
  );
}

export default RatedMovies;
