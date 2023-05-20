export const MOVIES_URL = "https://api.themoviedb.org/3/movie";
export const API_KEY = "api_key=8e52cfb664bd10618b03ab564d9677eb";

const getResponseData = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(new Error(`Error: ${res.status}`));
};

class MovieService {
  getMovies = () => {
    return fetch(MOVIES_URL + "/popular?" + API_KEY, {
      method: "GET",
    }).then(getResponseData);
  };

  getMovieDetails = (id) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}?${API_KEY}&append_to_response=credits`,
      {
        method: "GET",
      }
    ).then(getResponseData);
  };

  getMovieByTitle = (title) => {
    return fetch(
      `https://api.themoviedb.org/3/search/movie?${API_KEY}&query=${title}`,
      {
        method: "GET",
      }
    ).then(getResponseData);
  };
}

const movieServiceInstance = new MovieService();
export default movieServiceInstance;
