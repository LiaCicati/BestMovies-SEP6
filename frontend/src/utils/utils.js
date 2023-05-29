/*
 Utility functions
*/

// Determines the number of movies to display based on the current window width
export const getMoviesCount = () => {
  switch (true) {
    case window.innerWidth >= 944:
      return 12;
    case window.innerWidth >= 570:
      return 8;
    default:
      return 5;
  }
};

// Determines the number of movies to load initially based on the current window width
export const loadMovies = () => {
  if (window.innerWidth >= 944) {
    return 3;
  }
  return 2;
};

// Checks and updates the favorite status of movies
export const checkFavoriteMovies = (allMovies, favoriteMovies) => {
  favoriteMovies.forEach((favoriteMovie) => {
    const movie = allMovies.find((item) => item.title === favoriteMovie.title);
    if (movie) {
      movie.isFavorite = true;
    }
  });
  return allMovies;
};

// Returns the error message based on the provided error
export const getErrors = (err) => {
  if (err === "Error: 400" || err.message === "Error: 400")
    return "The data provided is invalid. Please check the information you provided and try again.";
  if (err === "Error: 401" || err.message === "Error: 401")
    return "Incorrect email or password";
  if (err === "Error: 403" || err.message === "Error: 403")
    return "You can't delete the movie";
  if (err === "Error: 404" || err.message === "Error: 404")
    return "The requested data was not found";
  if (err === "Error: 409" || err.message === "Error: 409")
    return "A user with this email is already registered";
  if (err === "Error: 429" || err.message === "Error: 429")
    return "Too many requests. Try again later";
  return "Server Error";
};
