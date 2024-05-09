import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import './css/style.css';
import { AuthProvider } from "./context/Authcontext";
import Login from "./pages/Login";
import SignUP from "./pages/SignUp";
import Home from './pages/Home';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUP />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
