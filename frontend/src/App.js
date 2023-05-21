import "./App.css";
import { useEffect, useState } from "react";
import { CurrentUserContext } from "./contexts/CurrentUserContext";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import userService from "./services/userService";
import movieService from "./services/movieService";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Movies from "./components/Movies/Movies";
import MovieDetails from "./components/MoviesDetails/MovieDetails";
function App() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [movies, setMovies] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    // Check if a token exists in local storage
    const token = localStorage.getItem("token");
    if (token) {
      // If a token exists, make an API call to validate the token
      userService
        .getUser(token)
        .then((res) => {
          if (res) {
            // If the token is valid and user data is received, set isLoggedIn to true and navigate to the specified path
            setIsLoggedIn(true);
            navigate(path);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      const token = localStorage.getItem("token");
      Promise.all([
        userService.getUser(token),
        userService.getFavoriteMovies(token),
      ])
        .then(([userData, movies]) => {
          setCurrentUser(userData);
          setSavedMovies(movies);
          localStorage.setItem("saved-movies", JSON.stringify(movies));
          localStorage.setItem("current-user", JSON.stringify(userData));
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  function onLogin(email, password) {
    userService
      .loginUser(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("token", res.token);
          setIsLoggedIn(true);
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onRegister(name, email, password) {
    userService
      .registerUser(name, email, password)
      .then((res) => {
        if (res.email) {
          onLogin(email, password);
          navigate("/profile");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSaveMovie(movie) {
    userService
      .likeMovie(movie)
      .then((savedMovie) => {
        setSavedMovies([savedMovie, ...savedMovies]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardClickButton(movie) {
    if (!movie.isSaved && !movie._id) {
      handleSaveMovie(movie);
      console.log(movie);
    } else {
      console.log("deleting");
    }
  }

  const checkSavedMovies = (allMovies, savedMovies) => {
    savedMovies.forEach((savedMovie) => {
      const movie = allMovies.find((item) => item.title === savedMovie.title);

      // Only set isSaved if a matching movie is found
      if (movie) {
        movie.isSaved = true;
      }
    });

    return allMovies;
  };

  useEffect(() => {
    const storedMovies = localStorage.getItem("movies");
    if (storedMovies) {
      const parsedMovies = JSON.parse(storedMovies);
      setMovies(checkSavedMovies(parsedMovies, savedMovies));
    } else {
      movieService
        .getMovies()
        .then((data) => {
          console.log(data);
          const movies = data.results;
          localStorage.setItem("movies", JSON.stringify(movies));
          setMovies(checkSavedMovies(movies, savedMovies));
        })
        .catch((error) => {
          console.error("Error fetching movies:", error);
        });
    }
  }, [savedMovies]);

  // Function to fetch movies from the API
const fetchMovies = () => {
  movieService
    .getMovies()
    .then((data) => {
      const movies = data.results;
      localStorage.setItem("movies", JSON.stringify(movies));
      setMovies(checkSavedMovies(movies, savedMovies));
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
};

// Function to set movies from localStorage
const setMoviesFromLocalStorage = () => {
  const storedMovies = localStorage.getItem("movies");

  try {
    if (storedMovies) {
      const parsedMovies = JSON.parse(storedMovies);
      setMovies(checkSavedMovies(parsedMovies, savedMovies));
    } else {
      fetchMovies();
    }
  } catch (error) {
    console.error("Error parsing stored movies:", error);
    fetchMovies();
  }
};

useEffect(() => {
  setMoviesFromLocalStorage();
}, [savedMovies]);


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <Movies
                movies={movies}
                onCardClickButton={handleCardClickButton}
              />
            }
          ></Route>
          <Route
            path="/movies/:id"
            element={
              <>
                <MovieDetails />
              </>
            }
          ></Route>
          <Route
            path="/signup"
            element={<Register onRegister={onRegister} />}
          ></Route>
          <Route path="/signin" element={<Login onLogin={onLogin} />}></Route>
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={loggedIn}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
