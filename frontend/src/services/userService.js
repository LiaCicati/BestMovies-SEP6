const BASE_URL = "http://localhost:3001";

const checkResponse = (res) =>
  res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);

class UserService {
  registerUser(name, email, password) {
    return fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    }).then(checkResponse);
  }

  loginUser = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then(checkResponse);
  };

  getUser = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(checkResponse);
  };

  likeMovie(movie) {
    const token = localStorage.getItem("token");
    let posterPath = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    let backdropPath = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;

    // Check if movie has poster and backdrop paths
    if (!movie.poster_path) {
      posterPath =
        "https://t3.ftcdn.net/jpg/03/34/83/22/360_F_334832255_IMxvzYRygjd20VlSaIAFZrQWjozQH6BQ.jpg";
    }

    if (!movie.backdrop_path) {
      backdropPath =
        "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg";
    }
    return fetch(`${BASE_URL}/movies`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

  getFavoriteMovies(token) {
    return fetch(`${BASE_URL}/movies`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(checkResponse);
  }

  deleteMovie(movieId) {
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/movies/${movieId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(checkResponse);
  }

  getFavoriteMovieDetails(movieId) {
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/movies/${movieId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(checkResponse);
  }

  updateProfile({ name, email }) {
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/users/me`, {
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
