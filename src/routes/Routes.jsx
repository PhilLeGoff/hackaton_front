
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Signup from "../pages/signup/Signup";
import Login from "../pages/login/Login";
import Accueil from "../pages/accueil/Accueil";
import AuthService from "../services/AuthService";
import Layout from "../layout/Layout";

export default function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.getToken() !== null);
  const location = useLocation();

  // Re-check authentication when the route changes
  useEffect(() => {
    setIsAuthenticated(AuthService.getToken() !== null);
  }, [location]);

  return (
    <Routes>
      {/* If user is NOT authenticated, redirect to login */}
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          {/* If authenticated, redirect to homepage */}
          <Route path="/" element={<Layout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}
