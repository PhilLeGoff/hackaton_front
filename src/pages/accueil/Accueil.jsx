import React from 'react';
import Post from '../../components/cards/posts/Posts.jsx';
import Trends from '../../components/cards/trends/Trends.jsx';
import Suggestions from '../../components/cards/suggestions/Suggestions.jsx';
import TweetForm from '../../components/cards/tweetform/Tweetform.jsx';
import './Accueil.css';

const Accueil = () => {
  return (
    <div className="homepage-container">
      
      <div className="posts-container">
        <Post />
        <Post />
        <Post />
      </div>
      <Trends />
      <Suggestions/>
      <TweetForm/>
    </div>
  );
}

export default Accueil;
