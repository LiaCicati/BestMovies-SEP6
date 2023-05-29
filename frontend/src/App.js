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
import RatedMovies from "./components/RatedMovies/RatedMovies";
import Header from "./components/Header/Header";
import InfoTooltip from "./components/InfoToolTip/InfoToolTip";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import Footer from "./components/Footer/Footer";
import success from "./images/success.png";
import fail from "./images/fail.png";
import * as utils from "./utils/utils";
// Main component of the application
function App() {
  // State variables
  const [loggedIn, setIsLoggedIn] = useState(false); // Tracks if the user is logged in
  const [currentUser, setCurrentUser] = useState({}); // Stores the current user data
  const [allMovies, setAllMovies] = useState([]); // Stores all movies data
  const [favoriteMovies, setFavoriteMovies] = useState([]); // Stores favorite movies data
  const [searchValue, setSearchValue] = useState(""); // Stores the value of the search input
  const [showMore, setShowMore] = useState(false); // Tracks whether to show "Load More" button
  const [filteredMovies, setFilteredMovies] = useState([]); // Stores the movies to display after filtering
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false); // Controls the visibility of the info tooltip
  const [tooltipImage, setTooltipImage] = useState(""); // Determines the image to display in the info tooltip
  const [message, setMessage] = useState(""); // Stores the message to display in the info tooltip

  // Hooks
  const navigate = useNavigate(); // Provides navigation functionality
  const location = useLocation(); // Tracks the current location
  const path = location.pathname; // Retrieves the current path

  // Authentication check
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

  // Fetch movies and user data
  useEffect(() => {
    const token = localStorage.getItem("token");

    const getMovies = () => {
      const storedMovies = localStorage.getItem("movies");
      if (storedMovies) {
        const parsedMovies = JSON.parse(storedMovies);
        const updatedMovies = utils.checkFavoriteMovies(
          parsedMovies,
          favoriteMovies
        );
        setAllMovies(updatedMovies);
        setShowMore(updatedMovies.length > utils.getMoviesCount());
      } else {
        movieService
          .getMovies()
          .then((data) => {
            const movies = data.results;
            localStorage.setItem("movies", JSON.stringify(movies));
            const updatedMovies = utils.checkFavoriteMovies(
              movies,
              favoriteMovies
            );
            setAllMovies(updatedMovies);
            setShowMore(updatedMovies.length > utils.getMoviesCount());
          })
          .catch((error) => {
            console.error("Error fetching movies:", error);
          });
      }
    };

    const getUserDataAndFavoriteMovies = () => {
      Promise.all([
        userService.getUser(token),
        userService.getFavoriteMovies(token),
      ])
        .then(([userData, favoriteMovies]) => {
          setCurrentUser(userData);
          setFavoriteMovies(favoriteMovies);
          localStorage.setItem(
            "favorite-movies",
            JSON.stringify(favoriteMovies)
          );
          localStorage.setItem("current-user", JSON.stringify(userData));
        })
        .catch((error) => {
          console.error("Error fetching user data and favorite movies:", error);
        });
    };

    if (loggedIn) {
      getUserDataAndFavoriteMovies();
    }

    getMovies();
    // eslint-disable-next-line
  }, [loggedIn]);

  // Update movies when favoriteMovies change
  useEffect(() => {
    const storedMovies = localStorage.getItem("movies");
    if (storedMovies) {
      const parsedMovies = JSON.parse(storedMovies);
      const updatedMovies = utils.checkFavoriteMovies(
        parsedMovies,
        favoriteMovies
      );
      setAllMovies(updatedMovies);
      setShowMore(updatedMovies.length > utils.getMoviesCount());
    }
  }, [favoriteMovies]);

  // Handle user login
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
        setIsInfoTooltipOpen(true);
        setTooltipImage(fail);
        setMessage(utils.getErrors(err));
        console.log(err);
      });
  }

  // Handle user registration
  function onRegister(name, email, password) {
    userService
      .registerUser(name, email, password)
      .then((res) => {
        if (res.email) {
          setIsInfoTooltipOpen(true);
          setTooltipImage(success);
          onLogin(email, password);
          setMessage("You have successfully registered!");
          navigate("/profile");
        }
      })
      .catch((err) => {
        setIsInfoTooltipOpen(true);
        setTooltipImage(fail);
        setMessage(utils.getErrors(err));
        console.log(err);
      });
  }

  // Update user profile information
  function handleUpdateUserInfo({ name, email }) {
    userService
      .updateProfile({ name, email })
      .then((data) => {
        if (data) {
          setCurrentUser(data);
          setIsInfoTooltipOpen(true);
          setTooltipImage(success);
          setMessage("Profile updated successfully!");
        }
      })
      .catch((err) => {
        setIsInfoTooltipOpen(true);
        setTooltipImage(fail);
        setMessage(utils.getErrors(err));
        console.log(utils.getErrors(err));
      });
  }

  // Add a movie to favoriteMovies
  function handleAddMovie(movie) {
    userService
      .likeMovie(movie)
      .then((favoriteMovie) => {
        setFavoriteMovies([favoriteMovie, ...favoriteMovies]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Delete a movie from favoriteMovies
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
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Handle add/delete favorite movie
  function handleCardClickButton(movie) {
    if (!movie.isFavorite && !movie._id) {
      handleAddMovie(movie);
    } else {
      handleDeleteMovie(movie);
    }
  }

  // Handle user sign out
  function onSignOut() {
    localStorage.clear();

    setIsLoggedIn(false);
    setCurrentUser({});
    setFavoriteMovies([]);
    navigate("/");
  }

  // Set up event listeners for window resize
  useEffect(() => {
    const handleResize = () => {
      setFilteredMovies(allMovies.slice(0, utils.getMoviesCount()));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [allMovies]);

  useEffect(() => {
    setFilteredMovies(allMovies.slice(0, utils.getMoviesCount()));
    setShowMore(allMovies.length > utils.getMoviesCount());
  }, [allMovies]);

  // Handle searching movies
  const handleSearchSubmit = async (value) => {
    setSearchValue(value.trim());

    if (value.trim() !== "") {
      try {
        const data = await movieService.getMovieByTitle(value);
        const searchedMovies = data.results;

        setFilteredMovies(searchedMovies.slice(0, utils.getMoviesCount()));
        setShowMore(searchedMovies.length > utils.getMoviesCount());

        setAllMovies(utils.checkFavoriteMovies(searchedMovies, favoriteMovies));
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    } else {
      setFilteredMovies(allMovies.slice(0, utils.getMoviesCount()));
      setShowMore(allMovies.length > utils.getMoviesCount());

      setAllMovies(utils.checkFavoriteMovies(allMovies, favoriteMovies));
    }
  };

  // Handle click on the "More" button to load more movies to the UI
  const handleClickMoreButton = () => {
    const loadCount = utils.loadMovies();
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

  function closeAllModals() {
    setIsInfoTooltipOpen(false);
  }

  function handlerEscClose(evt) {
    if (evt.key === "Escape") {
      closeAllModals();
    }
  }

  function closeByOverlay(evt) {
    if (evt.target.classList.contains("modal-tooltip")) {
      closeAllModals();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handlerEscClose);
    document.addEventListener("click", closeByOverlay);
    return () => {
      document.removeEventListener("keydown", handlerEscClose);
      document.removeEventListener("click", closeByOverlay);
    };
  });

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Header />
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
            path="/my-ratings"
            element={
              <ProtectedRoute isLoggedIn={loggedIn}>
                <RatedMovies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-ratings/:id"
            element={
              <ProtectedRoute isLoggedIn={loggedIn}>
                <MovieDetails />
              </ProtectedRoute>
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
                <Profile
                  onUpdate={handleUpdateUserInfo}
                  onSignOut={onSignOut}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute isLoggedIn={loggedIn}>
                <Statistics />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllModals}
          image={tooltipImage}
          message={message}
        />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
