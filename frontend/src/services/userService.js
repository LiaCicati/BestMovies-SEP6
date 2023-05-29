const BASE_URL = "http://localhost:8080"; // The base URL for the API

// Checks the response status and handle errors
const checkResponse = (res) =>
  res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);

class UserService {
  // Registers a new user
  registerUser(name, email, password) {
    return fetch(`${BASE_URL}/signup`, {
      // API endpoint for user registration
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    }).then(checkResponse);
  }
  // Logs in a user
  loginUser = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
      // API endpoint for user login
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then(checkResponse);
  };
  // Retrieves user details
  getUser = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
      // API endpoint to get user details
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
    }).then(checkResponse);
  };
  // Likes a movie
  likeMovie(movie) {
    const token = localStorage.getItem("token");
    let posterPath = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    let backdropPath = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;

    // Check if movie has poster and backdrop paths
    if (!movie.poster_path) {
      posterPath =
        "https://t3.ftcdn.net/jpg/03/34/83/22/360_F_334832255_IMxvzYRygjd20VlSaIAFZrQWjozQH6BQ.jpg"; // Default poster path
    }

    if (!movie.backdrop_path) {
      backdropPath =
        "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg"; // Default backdrop path
    }
    return fetch(`${BASE_URL}/movies`, {
      // API endpoint to like a movie
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
      body: JSON.stringify({
        movieId: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        original_language: movie.original_language,
        popularity: movie.popularity,
        overview: movie.overview,
        poster_path: posterPath,
        backdrop_path: backdropPath,
        vote_average: movie.vote_average,
      }),
    }).then(checkResponse);
  }
  // Retrieves favorite movies
  getFavoriteMovies(token) {
    return fetch(`${BASE_URL}/movies`, {
      // API endpoint to get favorite movies
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(checkResponse);
  }
  // Deletes a movie
  deleteMovie(movieId) {
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/movies/${movieId}`, {
      // API endpoint to delete a movie
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(checkResponse);
  }
  // Retrieves details of a favorite movie
  getFavoriteMovieDetails(movieId) {
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/movies/${movieId}`, {
      // API endpoint to get details of a favorite movie
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(checkResponse);
  }
  // Updates user profile
  updateProfile({ name, email }) {
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/users/me`, {
      // API endpoint to update user profile
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    }).then(checkResponse);
  }
}

const userServiceInstance = new UserService();
export default userServiceInstance;
