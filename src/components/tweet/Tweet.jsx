import React, { useState } from "react";
import TweetService from "../../services/TweetService";
import "./Tweet.css";

const Tweet = ({ tweet }) => {
  const [likes, setLikes] = useState(tweet.likes.length);
  const [retweets, setRetweets] = useState(tweet.retweets.length);

  // Handle Like
  const handleLike = async () => {
    try {
      await TweetService.likeTweet(tweet._id);
      setLikes(likes + 1);
    } catch (error) {
      console.error("❌ Error liking tweet:", error);
    }
  };

  // Handle Retweet
  const handleRetweet = async () => {
    try {
      await TweetService.retweet(tweet._id);
      setRetweets(retweets + 1);
    } catch (error) {
      console.error("❌ Error retweeting:", error);
    }
  };

  return (
    <div className="tweet">
      <h3 className="username">@{tweet.userId?.username}</h3>
      <p>{tweet.text}</p>

      {/* Display Image or Video if media exists */}
      {tweet.media && tweet.media.url && (
        <div className="tweet-media">
          {tweet.media.type === "image" ? (
            <img src={tweet.media.url} alt="Tweet Media" className="tweet-image" />
          ) : (
            <video src={tweet.media.url} controls className="tweet-video" />
          )}
        </div>
      )}

      <div className="tweet-actions">
        <button onClick={handleLike}>❤️ {likes}</button>
        <button onClick={handleRetweet}>🔄 {retweets}</button>
      </div>
    </div>
  );
};

export default Tweet;
