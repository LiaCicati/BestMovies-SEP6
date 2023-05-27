import movieService from "../../services/movieService";
import userService from "../../services/userService";
import ratingService from "../../services/ratingService";
import { useParams, useLocation } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import "./MovieDetails.css";
const API_IMG = "https://image.tmdb.org/t/p/w500/";

function MovieDetails() {
  const [movie, setMovie] = useState({});
  const [favoriteMovie, setFavoriteMovie] = useState({});
  const [director, setDirector] = useState("");
  const [cast, setCast] = useState([]);
  const { id } = useParams();
  const movieId = parseInt(id);
  const location = useLocation();
  const isFavoriteMoviesPage = location.pathname.includes("favorites");
  const isMyRatingsPage = location.pathname.includes("my-ratings");
  const [ratedMovie, setRatedMovie] = useState({});

  const currentUser = useContext(CurrentUserContext);

  const handleRatingChange = (value) => {
    // Update the rating if it already exists, otherwise add a new rating
    if (ratedMovie.my_rating) {
      ratingService
        .updateRating({ id: ratedMovie._id, my_rating: value })
        .then((updatedRating) => {
          console.log("Rating updated:", updatedRating);
          localStorage.setItem(
            `rating_${ratedMovie.movieId}`,
            JSON.stringify(updatedRating)
          );
          setRatedMovie(updatedRating);
        })
        .catch((error) => {
          console.error("Error updating rating:", error);
        });
    } else {
      ratingService
        .addRating({
          movieId: movie.id,
          title: movie.title,
          backdrop_path: movie.backdrop_path,
          poster_path: movie.poster_path,
          my_rating: value,
        })
        .then((addedRating) => {
          localStorage.setItem(
            `rating_${movie.id}`,
            JSON.stringify(addedRating)
          );
          setRatedMovie(addedRating);
        })
        .catch((error) => {
          console.error("Error adding rating:", error);
        });
    }
  };

  useEffect(() => {
    const storedRating = localStorage.getItem(`rating_${movie.id}`);
    if (storedRating) {
      const parsedRating = JSON.parse(storedRating);
      setRatedMovie(parsedRating);
    }
  }, [movie.id]);

  const fetchMovieDetails = async (movieId) => {
    try {
      const data = await movieService.getMovieDetails(movieId);
      const movie = data;
      localStorage.setItem(`movie_${movieId}`, JSON.stringify(movie));
      setMovie(movie);
      setDirector(
        movie.credits.crew.find((person) => person.job === "Director")?.name ||
          ""
      );
      setCast(movie.credits.cast.slice(0, 5));
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const fetchFavoriteMovieDetails = async (id) => {
    try {
      const data = await userService.getFavoriteMovieDetails(id);
      const movie = data;
      localStorage.setItem(`favorite-movie_${id}`, JSON.stringify(movie));
      setFavoriteMovie(movie);
    } catch (error) {
      console.error("Error fetching favorite movie details:", error);
    }
  };

  const fetchMyRatings = async (id) => {
    try {
      const data = await ratingService.getRatingById(id);
      const rating = data;
      setRatedMovie(rating);
    } catch (error) {
      console.error("Error fetching rated movies:", error);
    }
  };

  useEffect(() => {
    const getMovieDetails = async () => {
      const storedMovie = localStorage.getItem(`movie_${movieId}`);
      const storedFavoriteMovie = localStorage.getItem(`favorite-movie_${id}`);

      if (storedMovie) {
        const parsedMovie = JSON.parse(storedMovie);
        setMovie(parsedMovie);
        setDirector(
          parsedMovie.credits.crew.find((person) => person.job === "Director")
            ?.name || ""
        );
        setCast(parsedMovie.credits.cast.slice(0, 5));
      } else if (storedFavoriteMovie) {
        const parsedMovie = JSON.parse(storedFavoriteMovie);
        setFavoriteMovie(parsedMovie);
      } else {
        try {
          if (isFavoriteMoviesPage) {
            await fetchFavoriteMovieDetails(id);
          } else if (isMyRatingsPage) {
            await fetchMyRatings(id);
          } else {
            await fetchMovieDetails(movieId);
          }
        } catch (error) {
          console.error("Error fetching movie details:", error);
        }
      }
    };

    getMovieDetails();
  }, [movieId, id, isFavoriteMoviesPage, isMyRatingsPage]);

  if (
    Object.keys(movie).length === 0 &&
    Object.keys(favoriteMovie).length === 0 &&
    Object.keys(ratedMovie).length === 0
  ) {
    return <div>Movie details not found.</div>;
  }
  return (
    <div>
      {isFavoriteMoviesPage && (
        <div className="details">
          <div className="details__poster-container">
            <img
              className="details__poster"
              src={favoriteMovie.poster_path}
              alt={favoriteMovie.title}
            />
          </div>
          <div>
            <h2 className="details__header-title">{favoriteMovie.title}</h2>
            <div className="details__container">
              <p>{favoriteMovie.release_date}</p>
              <p>{favoriteMovie.original_language}</p>
              <p>{movie.popularity}</p>
              <p>Rating: {favoriteMovie.vote_average}</p>
            </div>
            <h3>About:</h3>
            <p>{favoriteMovie.overview}</p>
          </div>
        </div>
      )}{" "}
      {!isFavoriteMoviesPage && !isMyRatingsPage && (
        <div className="details">
          <div className="details__poster-container">
            <img
              className="details__poster"
              src={
                !movie.poster_path
                  ? "https://t3.ftcdn.net/jpg/03/34/83/22/360_F_334832255_IMxvzYRygjd20VlSaIAFZrQWjozQH6BQ.jpg"
                  : API_IMG + movie.poster_path
              }
              alt={movie.title}
            />
          </div>
          <div>
            <h2 className="details__header-title">{movie.title}</h2>
            <div className="details__container">
              <p>{movie.release_date}</p>
              <p>{movie.original_language}</p>
              <p>{movie.popularity}</p>
              <p>Rating: {movie.vote_average}</p>
            </div>

            <p>
              <b> Director:</b> <span>{director}</span>
            </p>

            <>
              {" "}
              <h3>Stars:</h3>
              <div className="details__cast">
                {cast.map((castMember, index) => (
                  <React.Fragment key={castMember.name}>
                    {index > 0 && ", "}
                    {castMember.name}
                  </React.Fragment>
                ))}
              </div>
            </>

            <h3>About:</h3>
            <p>{movie.overview}</p>
            {currentUser.email && (
              <div>
                <h2>Rate the Movie</h2>
                <div>
                  {Array.from({ length: 10 }, (_, index) => (
                    <span
                      key={index}
                      onClick={() => handleRatingChange(index + 1)}
                      style={{
                        cursor: "pointer",
                        fontSize: "30px",
                        color: index < ratedMovie.my_rating ? "gold" : "gray",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p>Your rating: {ratedMovie.my_rating}</p>
              </div>
            )}
          </div>
        </div>
      )}
      {isMyRatingsPage && (
        <div className="details">
          <div className="details__poster-container">
            <img
              className="details__poster"
              src={ratedMovie.poster_path}
              alt={ratedMovie.title}
            />
          </div>
          <div>
            <h2 className="details__header-title">{ratedMovie.title}</h2>

            <div>
              <h2>Update rating</h2>
              <div>
                {Array.from({ length: 10 }, (_, index) => (
                  <span
                    key={index}
                    onClick={() => handleRatingChange(index + 1)}
                    style={{
                      cursor: "pointer",
                      fontSize: "30px",
                      color: index < ratedMovie.my_rating ? "gold" : "gray",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p>My rating: {ratedMovie.my_rating}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
