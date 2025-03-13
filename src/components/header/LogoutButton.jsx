import React from "react";
import './Header.css';
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout(); // Remove token & user
    navigate("/login", { replace: true }); // Redirect to login
    window.location.reload(); // Force re-check authentication
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Déconnexion
    </button>
  );
};

export default LogoutButton;
