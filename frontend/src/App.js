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
  const [searchValue, setSearchValue] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [displayedMovies, setDisplayedMovies] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const checkUserToken = async () => {
      try {
        if (token) {
          const res = await userService.getUser(token);
          if (res) {
            setIsLoggedIn(true);
            navigate(path);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkUserToken();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchMoviesAndSavedMovies = async () => {
      try {
        const [userData, savedMovies] = await Promise.all([
          userService.getUser(token),
          userService.getFavoriteMovies(token),
        ]);

        setCurrentUser(userData);
        setSavedMovies(savedMovies);
        localStorage.setItem("saved-movies", JSON.stringify(savedMovies));
        localStorage.setItem("current-user", JSON.stringify(userData));

        const storedMovies = localStorage.getItem("movies");

        if (storedMovies) {
          const parsedMovies = JSON.parse(storedMovies);
          const updatedMovies = checkSavedMovies(parsedMovies, savedMovies);
          setMovies(updatedMovies);
          setDisplayedMovies(updatedMovies.slice(0, getMoviesCount())); // Set displayedMovies with updatedMovies
          setShowMore(updatedMovies.length > getMoviesCount());
        } else {
          const data = await movieService.getMovies();
          const movies = data.results;
          localStorage.setItem("movies", JSON.stringify(movies));
          const updatedMovies = checkSavedMovies(movies, savedMovies);
          setMovies(updatedMovies);
          setDisplayedMovies(updatedMovies.slice(0, getMoviesCount())); // Set displayedMovies with updatedMovies
          setShowMore(updatedMovies.length > getMoviesCount());
        }
      } catch (error) {
        console.error("Error fetching movies and saved movies:", error);
      }
    };

    if (loggedIn) {
      fetchMoviesAndSavedMovies();
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

  const handleSaveMovie = async (movie) => {
    const isSaved = savedMovies.some((item) => item.id === movie.id);

    if (!isSaved) {
      const updatedMovie = { ...movie, isSaved: true };

      try {
        // Call the likeMovie API to save the movie
        await userService.likeMovie(movie);

        // Update the movie in the savedMovies state
        setSavedMovies((prevSavedMovies) => [updatedMovie, ...prevSavedMovies]);

        // Update the movie in the displayedMovies state as well
        setDisplayedMovies((prevDisplayedMovies) => {
          const updatedDisplayedMovies = prevDisplayedMovies.map((m) =>
            m.id === movie.id ? updatedMovie : m
          );
          return updatedDisplayedMovies;
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  function handleCardClickButton(movie) {
    const isSaved = savedMovies.some((item) => item.id === movie.id);
    if (!isSaved) {
      handleSaveMovie(movie);
      console.log(movie);
    } else {
      // Remove the movie from savedMovies and update the displayedMovies
      const updatedSavedMovies = savedMovies.filter(
        (item) => item.id !== movie.id
      );
      const updatedDisplayedMovies = displayedMovies.map((m) =>
        m.id === movie.id ? { ...m, isSaved: false } : m
      );

      setSavedMovies(updatedSavedMovies);
      setDisplayedMovies(updatedDisplayedMovies);
      console.log("unliking");

      // Update the savedMovies array in local storage
      localStorage.setItem("savedMovies", JSON.stringify(updatedSavedMovies));
    }
  }

  const checkSavedMovies = (allMovies, savedMovies) => {
    savedMovies.forEach((savedMovie) => {
      const movie = allMovies.find((item) => item.title === savedMovie.title);
      if (movie) {
        movie.isSaved = true;
      }
    });
    return allMovies;
  };

  useEffect(() => {
    const handleResize = () => {
      setDisplayedMovies(movies.slice(0, getMoviesCount()));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [movies]);

  useEffect(() => {
    setDisplayedMovies(movies.slice(0, getMoviesCount()));
    setShowMore(movies.length > getMoviesCount());
  }, [movies]);

  const getMoviesCount = () => {
    switch (true) {
      case window.innerWidth >= 944:
        return 9;
      case window.innerWidth >= 570:
        return 8;
      default:
        return 5;
    }
  };

  const loadMovies = () => {
    if (window.innerWidth >= 944) {
      return 3;
    }
    return 2;
  };

  const handleSearchSubmit = async (value) => {
    setSearchValue(value.trim());

    if (value.trim() !== "") {
      try {
        const data = await movieService.getMovieByTitle(value);
        const searchedMovies = data.results;

        setDisplayedMovies(searchedMovies.slice(0, getMoviesCount()));
        setShowMore(searchedMovies.length > getMoviesCount());

        setMovies(checkSavedMovies(searchedMovies, savedMovies));
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    } else {
      setDisplayedMovies(movies.slice(0, getMoviesCount()));
      setShowMore(movies.length > getMoviesCount());

      setMovies(checkSavedMovies(movies, savedMovies));
    }
  };

  const handleClickMoreButton = () => {
    const loadCount = loadMovies();
    const nextBatch = movies.slice(
      displayedMovies.length,
      displayedMovies.length + loadCount
    );

    setDisplayedMovies((prevMovies) => [...prevMovies, ...nextBatch]);
    setShowMore(displayedMovies.length + loadCount < movies.length);
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <Movies
                showMore={showMore}
                displayedMovies={displayedMovies}
                searchValue={searchValue}
                onSearchSubmit={handleSearchSubmit}
                onClickMoreButton={handleClickMoreButton}
                onCardClickButton={handleCardClickButton}
              />
            }
          />
          <Route
            path="/movies/:id"
            element={
              <>
                <MovieDetails />
              </>
            }
          />
          <Route
            path="/signup"
            element={<Register onRegister={onRegister} />}
          />
          <Route path="/signin" element={<Login onLogin={onLogin} />} />
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
