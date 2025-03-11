import React from 'react';

const Navigator = () => {
  return (
    <div className="navigator">
      <h2>Navigation</h2>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/explore">Explore</a></li>
        <li><a href="/notifications">Notifications</a></li>
        <li><a href="/messages">Messages</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
    </div>
  );
}

export default Navigator;
