import movies from "../../utils/movies";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";

function MovieDetails() {
  const { id } = useParams();
  const movieId = parseInt(id);
  const movie = movies.find((movie) => movie.id === movieId);

  return (
    <div>
      <Header />
      <h2>{movie.title}</h2>
      <p>Rating: {movie.rating}</p>
      <img src={movie.image} alt={movie.title} />
      <p>{movie.original_language}</p>
      <p>{movie.overview}</p>
      <p>{movie.popularity}</p>
      <p>{movie.release_date}</p>
      <p>{movie.vote_count}</p>
    </div>
  );
}

export default MovieDetails;
