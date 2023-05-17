import "./App.css";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/signup" element={<Register />}></Route>
        <Route path="/signin" element={<Login />}></Route>
      </Routes>
    </div>
  );
}

export default App;
