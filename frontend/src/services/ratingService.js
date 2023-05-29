// The URL for the API
const BASE_URL = "http://localhost:3001";

const checkResponse = (res) =>
  res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);

class RatingService {
  // Adds a rating for a movie
  addRating(rating) {
    let posterPath = `https://image.tmdb.org/t/p/w500${rating.poster_path}`;
    let backdropPath = `https://image.tmdb.org/t/p/w500${rating.backdrop_path}`;

    // Check if movie has poster and backdrop paths
    if (!rating.poster_path) {
      posterPath =
        "https://t3.ftcdn.net/jpg/03/34/83/22/360_F_334832255_IMxvzYRygjd20VlSaIAFZrQWjozQH6BQ.jpg";
    }

    if (!rating.backdrop_path) {
      backdropPath =
        "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg";
    }
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
        backdrop_path: backdropPath,
        poster_path: posterPath,
        my_rating: rating.my_rating,
      }),
    }).then(checkResponse);
  }

  // Retrieves all ratings
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

  // Retrieves a rating by its ID
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

  // Updates a rating
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
