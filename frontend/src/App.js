import "./App.css";
import { useEffect, useState } from "react";
import { CurrentUserContext } from "./contexts/CurrentUserContext";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import userService from "./services/userService";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Main from "./components/Main/Main";
function App() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

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
    // Execute when the loggedIn state changes
    if (loggedIn) {
      // If the user is logged in, retrieve the token from local storage
      const token = localStorage.getItem("token");
      userService
        .getUser(token)
        .then((userData) => {
          // Upon successful API call, set the currentUser state with received user data
          setCurrentUser(userData);
          // Store the user data in local storage
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Routes>
          <Route path="/" element={<Main />}></Route>
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
