import "./App.css";
import { useEffect, useState } from "react";
import { CurrentUserContext } from "./contexts/CurrentUserContext";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import userService from "./services/userService";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      userService
        .getUser(token)
        .then((res) => {
          if (res) {
            setIsLoggedIn(true);
            navigate(path);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      localStorage.removeItem("token");
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      const token = localStorage.getItem("token");
      Promise.all([userService.getUser(token)])
        .then(([userData]) => {
          setCurrentUser(userData);
          localStorage.setItem("current-user", JSON.stringify(userData));
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Routes>
          <Route path="/signup" element={<Register />}></Route>
          <Route path="/signin" element={<Login />}></Route>
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
