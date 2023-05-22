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
        poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop_path: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
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
}

const userServiceInstance = new UserService();
export default userServiceInstance;
