import "./App.css";
import Register from "./components/Register/Register";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/signup" element={<Register />}></Route>
      </Routes>
    </div>
  );
}

export default App;
