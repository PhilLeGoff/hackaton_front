import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Signup from "../pages/signup/Signup";
import Login from "../pages/login/Login";
import Accueil from "../pages/accueil/Accueil";
import AuthService from "../services/AuthService";
import UserProfile from "../components/profil/UserProfile";
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
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        // ✅ This Layout wraps the pages, keeping Header/Footer fixed
        <Route path="/" element={<Layout />} >
          <Route index element={<Accueil />} /> 
          <Route path="profile" element={<UserProfile />} /> 
          <Route path="explore" element={<div>Explore Page</div>} /> 
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
}
