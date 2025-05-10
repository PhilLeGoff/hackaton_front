
export default Header;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TweetService from "../../services/TweetService"; // ✅ Import TweetService
import { socket } from "../../utils/socket";
import LogoutButton from "./LogoutButton";
import "./Header.css";

const Header = ({ setTweets }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  let typingTimeout = null; // Timeout for debounce

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

    // 🔄 Clear previous timeout to debounce the request
    if (typingTimeout) clearTimeout(typingTimeout);

    // ⏳ Set a new timeout to trigger search after 1 second of inactivity
    typingTimeout = setTimeout(() => {
      fetchSearchResults(event.target.value);
    }, 1000);
  };

  // ✅ Fetch search results based on query type
  const fetchSearchResults = async (query) => {
    if (!query.trim()) return;
    try {
      let searchResults = [];
      if (query.startsWith("#")) {
        searchResults = await TweetService.searchByHashtag(query);
      } else if (query.startsWith("@")) {
        searchResults = await TweetService.searchByMention(query.slice(1));
      } else {
        searchResults = await TweetService.searchByText(query);
      }

      console.log("🔍 Search Results:", searchResults);
      setTweets(searchResults);
      navigate("/"); // ✅ Redirect to home page to display results
    } catch (error) {
      console.error("❌ Error fetching search results:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-overlay"></div>
      <div className="logo">
        <img src="https://i.imgur.com/iV5PR2K.png" alt="EmoTwitt Logo" className="logo-header" />
        <h1>EmoTwitt</h1>
      </div>

      <div className="search-section">
        <form className="search-form">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tweets..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="button" className="search-submit">🔍</button>
          </div>
        </form>
      </div>

      <div className="nav-container">
        <nav>
          <ul className="nav-links">
            <li><a href="/">🏠 Home</a></li>
            <li><a href="/profile">👤 Profile</a></li>
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
