import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Auth from './hoc/auth'

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
            <Link to="/login">Login</Link>
            </li>
            <li>
            <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" component={<LoginPage />} />
          <Route exact path="/register" component={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}