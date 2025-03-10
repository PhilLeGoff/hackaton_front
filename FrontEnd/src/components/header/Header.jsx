import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <header style={{ backgroundColor: '#1DA1F2', padding: '10px 20px', color: 'white' }}>
      <div className="logo">
        <h1>Twitter</h1>
      </div>
      <nav>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '15px', margin: 0 }}>
          <li><a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a></li>
          <li><a href="/explore" style={{ color: 'white', textDecoration: 'none' }}>Explore</a></li>
          <li><a href="/notifications" style={{ color: 'white', textDecoration: 'none' }}>Notifications</a></li>
          <li><a href="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</a></li>
        </ul>
      </nav>
      </header>
    </div>
    
  );
}

export default Header;
