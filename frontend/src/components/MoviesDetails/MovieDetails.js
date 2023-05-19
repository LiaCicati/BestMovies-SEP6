import movieService from "../../services/movieService";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
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
      <h2>{movie.title}</h2>
      <p>Rating: {movie.vote_count}</p>
      <img src={API_IMG + movie.poster_path} alt={movie.title} />
      <p>Director: {director}</p>
      <p>{movie.original_language}</p>
      <p>{movie.overview}</p>
      <p>{movie.popularity}</p>
      <p>{movie.release_date}</p>
      <p>{movie.vote_count}</p>
      <h3>Cast:</h3>
      <ul>
        {cast.map((castMember) => (
          <li key={castMember.id}>{castMember.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default MovieDetails;
