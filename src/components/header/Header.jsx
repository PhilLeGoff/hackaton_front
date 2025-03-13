import React, { useState } from 'react';
import './Header.css';
import LogoutButton from "./LogoutButton";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    alert(`Searching for: ${searchQuery}`);
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
              &#x1F50E;&#xFE0E;
            </button>
          </div>
        </form>
      </div>
      <div className="nav-container">
        <nav>
        <ul className="nav-links">
          <li><a href="/">Accueil</a></li> |
          <li><a href="/profile">Mon profil</a></li> |
          <li><LogoutButton /></li>
        </ul>
        </nav>
        
      </div>
      
    </header>
  );
};

export default Header;
