import React, { useState, useContext, useEffect } from "react";
import { NotificationContext } from "../../NotificationContext";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "./Header.css";
import {socket} from "../../utils/socket";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Listen for notifications from the server
    socket.on("notification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off("notification"); // Cleanup on unmount
    };
  }, []);
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <header className="header">
      <div className="header-overlay"></div>
      <div className="logo">
        <div>
        <img src="https://i.imgur.com/iV5PR2K.png" alt="EmoTwitt Logo" className="logo-header" />
        </div>
        <h1>EmoTwitt</h1>
      </div> 
      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher Emotes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-submit">
              🔍
            </button>
          </div>
        </form>
      </div>

      {/* Navigation & Notifications */}
      <div className="nav-container">
        <nav>
          <ul className="nav-links">
            <li><a href="/">🏠 Accueil</a></li>
            <li><a href="/profile">👤 Mon Profil</a></li>
            <li className="notifications">
              <a href="/notifications">🔔 {notifications.length}</a>
            </li>
            <li><LogoutButton /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
