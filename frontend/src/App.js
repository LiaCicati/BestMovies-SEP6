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
import FavoriteMovies from "./components/FavoriteMovies/FavoriteMovies";
import MovieDetails from "./components/MoviesDetails/MovieDetails";
import Statistics from "./components/Statistics/Statistics";
function App() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [allMovies, setAllMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState([]);

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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchMoviesAndFavoriteMovies = async () => {
      try {
        const [userData, favoriteMovies] = await Promise.all([
          userService.getUser(token),
          userService.getFavoriteMovies(token),
        ]);

        setCurrentUser(userData);
        setFavoriteMovies(favoriteMovies);
        localStorage.setItem("favorite-movies", JSON.stringify(favoriteMovies));
        localStorage.setItem("current-user", JSON.stringify(userData));

        const storedMovies = localStorage.getItem("movies");

        if (storedMovies) {
          const parsedMovies = JSON.parse(storedMovies);
          const updatedMovies = checkFavoriteMovies(
            parsedMovies,
            favoriteMovies
          );
          setAllMovies(updatedMovies);
          setShowMore(updatedMovies.length > getMoviesCount());
        } else {
          const data = await movieService.getMovies();
          const movies = data.results;
          localStorage.setItem("movies", JSON.stringify(movies));
          const updatedMovies = checkFavoriteMovies(movies, favoriteMovies);
          setAllMovies(updatedMovies);
          setShowMore(updatedMovies.length > getMoviesCount());
        }
      } catch (error) {
        console.error("Error fetching movies and favorite movies:", error);
      }
    };

    if (loggedIn) {
      fetchMoviesAndFavoriteMovies();
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

  function handleAddMovie(movie) {
    userService
      .likeMovie(movie)
      .then((favoriteMovie) => {
        setFavoriteMovies((prevFavoriteMovies) => [
          favoriteMovie,
          ...prevFavoriteMovies,
        ]);
        updateMovieState(movie, true);
        setFilteredMovies((prevFilteredMovies) => {
          const updatedMovies = [...prevFilteredMovies, favoriteMovie];
          setShowMore(updatedMovies.length > getMoviesCount());
          return updatedMovies;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDeleteMovie(movie) {
    const movieId = movie.id || movie.movieId;
    const userMovie = favoriteMovies.find(
      (favoriteMovie) => favoriteMovie.movieId === movieId
    );
    userService
      .deleteMovie(userMovie._id)
      .then(() => {
        const newFavoriteMovies = favoriteMovies.filter(
          (favoriteMovie) => favoriteMovie.movieId !== movieId
        );
        setFavoriteMovies(newFavoriteMovies);
        updateMovieState(movie, false);
        setFilteredMovies((prevFilteredMovies) =>
          prevFilteredMovies.filter(
            (filteredMovie) => filteredMovie.id !== movie.id
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function updateMovieState(movie, isFavorite) {
    setAllMovies((prevMovies) =>
      prevMovies.map((prevMovie) =>
        prevMovie.id === movie.id ? { ...prevMovie, isFavorite } : prevMovie
      )
    );
  }

  function handleCardClickButton(movie) {
    if (!movie.isFavorite && !movie._id) {
      handleAddMovie(movie);
    } else {
      handleDeleteMovie(movie);
    }
  }

  const checkFavoriteMovies = (allMovies, favoriteMovies) => {
    favoriteMovies.forEach((favoriteMovie) => {
      const movie = allMovies.find(
        (item) => item.title === favoriteMovie.title
      );
      if (movie) {
        movie.isFavorite = true;
      }
    });
    return allMovies;
  };

  useEffect(() => {
    const handleResize = () => {
      setFilteredMovies(allMovies.slice(0, getMoviesCount()));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [allMovies]);

  useEffect(() => {
    setFilteredMovies(allMovies.slice(0, getMoviesCount()));
    setShowMore(allMovies.length > getMoviesCount());
  }, [allMovies]);

  const getMoviesCount = () => {
    switch (true) {
      case window.innerWidth >= 944:
        return 12;
      case window.innerWidth >= 570:
        return 8;
      default:
        return 5;
    }
  };

  const handleSearchSubmit = async (value) => {
    setSearchValue(value.trim());

    if (value.trim() !== "") {
      try {
        const data = await movieService.getMovieByTitle(value);
        const searchedMovies = data.results;

        setFilteredMovies(searchedMovies.slice(0, getMoviesCount()));
        setShowMore(searchedMovies.length > getMoviesCount());

        setAllMovies(checkFavoriteMovies(searchedMovies, favoriteMovies));
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    } else {
      setFilteredMovies(allMovies.slice(0, getMoviesCount()));
      setShowMore(allMovies.length > getMoviesCount());

      setAllMovies(checkFavoriteMovies(allMovies, favoriteMovies));
    }
  };

  const handleClickMoreButton = () => {
    const loadCount = loadMovies();
    const nextBatch = allMovies.slice(
      filteredMovies.length,
      filteredMovies.length + loadCount
    );

    setFilteredMovies((prevFilteredMovies) => [
      ...prevFilteredMovies,
      ...nextBatch,
    ]);
    setShowMore(filteredMovies.length + loadCount < allMovies.length);
  };

  const loadMovies = () => {
    if (window.innerWidth >= 944) {
      return 3;
    }
    return 2;
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
                displayedMovies={filteredMovies}
                searchValue={searchValue}
                onSearchSubmit={handleSearchSubmit}
                onClickMoreButton={handleClickMoreButton}
                onCardClickButton={handleCardClickButton}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute isLoggedIn={loggedIn}>
                <FavoriteMovies
                  favoriteMovies={favoriteMovies}
                  onClickMoreButton={handleClickMoreButton}
                  onCardClickButton={handleCardClickButton}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites/:id"
            element={
              <ProtectedRoute isLoggedIn={loggedIn}>
                <MovieDetails />
              </ProtectedRoute>
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
          <Route
            path="/statistics"
            element={
              <>
                <Statistics />
              </>
            }
          />
        </Routes>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
