import React from 'react';
import './Header.css';


const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Twitter</h1>
      </div>
      <nav>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/explore">Explore</a></li>
          <li><a href="/notifications">Notifications</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
