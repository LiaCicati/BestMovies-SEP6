const apiKey = process.env.REACT_APP_API_KEY;
const getResponseData = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(new Error(`Error: ${res.status}`));
};

class MovieService {
  // Retrieves popular movies
  getMovies = () => {
    return fetch(
      "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey,
      {
        method: "GET",
      }
    ).then(getResponseData);
  };

  // Retrieves details for a specific movie
  getMovieDetails = (id) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`,
      {
        method: "GET",
      }
    ).then(getResponseData);
  };

  // Retrieves movies based on a given title
  getMovieByTitle = (title) => {
    return fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}`,
      {
        method: "GET",
      }
    ).then(getResponseData);
  };

  // Retrieves movie genres
  getMoviesGenres = () => {
    return fetch(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=" + apiKey,
      {
        method: "GET",
      }
    ).then(getResponseData);
  };

  // Retrieves movies associated with a specific person
  getMoviesByActor = (actorId) => {
    return fetch(
      `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${apiKey}`,
      {
        method: "GET",
      }
    ).then(getResponseData);
  };

  // Retrieves popular actors
  getPopularActors = () => {
    return fetch(
      "https://api.themoviedb.org/3/person/popular?api_key=" + apiKey,
      {
        method: "GET",
      }
    ).then(getResponseData);
  };
}

const movieServiceInstance = new MovieService();
export default movieServiceInstance;
