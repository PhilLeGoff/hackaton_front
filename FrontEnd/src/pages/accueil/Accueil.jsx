import React from 'react';
import Navigator from '../../components/cards/navigator/Navigator';
import Post from '../../components/cards/posts/Posts.jsx';
import Trends from '../../components/cards/trends/Trends.jsx';
import './Accueil.css';

const Accueil = () => {
  return (
    <div className="homepage-container">
      <Navigator />
      <div className="posts-container">
        <Post />
        <Post />
        <Post />
      </div>
      <Trends />
    </div>
  );
}

export default Accueil;
