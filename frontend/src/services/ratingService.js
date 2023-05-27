const BASE_URL = "http://localhost:3001";

const checkResponse = (res) =>
  res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);

class RatingService {
  addRating(rating) {
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/ratings`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        movieId: rating.movieId,
        title: rating.title,
        backdrop_path: `https://image.tmdb.org/t/p/w500${rating.backdrop_path}`,
        poster_path: `https://image.tmdb.org/t/p/w500${rating.poster_path}`,
        my_rating: rating.my_rating,
      }),
    }).then(checkResponse);
  }

  getRatings(token) {
    return fetch(`${BASE_URL}/ratings`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(checkResponse);
  }

  getRatingById(id) {
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/ratings/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(checkResponse);
  }

  updateRating({ id, my_rating }) {
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/ratings/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ my_rating }),
    }).then(checkResponse);
  }
}

const ratingServiceInstance = new RatingService();
export default ratingServiceInstance;
