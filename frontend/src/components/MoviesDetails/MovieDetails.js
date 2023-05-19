import movieService from "../../services/movieService";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./MovieDetails.css";
const API_IMG = "https://image.tmdb.org/t/p/w500/";

function MovieDetails() {
  const [movie, setMovie] = useState({});
  const [director, setDirector] = useState("");
  const [cast, setCast] = useState([]);
  const { id } = useParams();
  const movieId = parseInt(id);

  useEffect(() => {
    const storedMovie = localStorage.getItem(`movie_${movieId}`);
    if (storedMovie) {
      const parsedMovie = JSON.parse(storedMovie);
      setMovie(parsedMovie);
      setDirector(
        parsedMovie.credits.crew.find((person) => person.job === "Director")
          ?.name || ""
      );
      setCast(parsedMovie.credits.cast.slice(0, 5));
    } else {
      movieService
        .getMovieDetails(movieId)
        .then((data) => {
          const movie = data;
          localStorage.setItem(`movie_${movieId}`, JSON.stringify(movie));
          setMovie(movie);
          setDirector(
            movie.credits.crew.find((person) => person.job === "Director")
              ?.name || ""
          );
          setCast(movie.credits.cast.slice(0, 5));
        })
        .catch((error) => {
          console.error("Error fetching movie details:", error);
        });
    }
  }, [movieId]);

  if (!movie) {
    return <div>Movie details not found.</div>;
  }
  return (
    <div>
      <Header />

      <div className="details">
        <div className="details__poster-container">
          <img
            className="details__poster"
            src={API_IMG + movie.poster_path}
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
          <h3>Stars:</h3>
          <div className="details__cast">
            {cast.map((castMember, index) => (
              <React.Fragment key={castMember.name}>
                {index > 0 && ", "}
                {castMember.name}
              </React.Fragment>
            ))}
          </div>
          <h3>About:</h3>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
