import React, { useState, useEffect } from "react";
import TweetService from "../../services/TweetService";
import Tweet from "../../components/tweet/Tweet"; // Tweet component
import TweetPost from "../../components/tweetpost/TweetPost"; // New Tweet Post component
import Trends from '../../components/cards/trends/Trends.jsx';
import Suggestions from '../../components/cards/suggestions/suggestions.jsx';
import "./Accueil.css";

const Accueil = () => {
  const [tweets, setTweets] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null); // ✅ Store logged-in user
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Fetch the logged-in user from localStorage when the page loads
  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      try {
        const user = localStorage.getItem("user");
        if (user) {
          setLoggedInUser(JSON.parse(user)); // ✅ Parse JSON string
        }
      } catch (error) {
        console.error("❌ Error fetching user from localStorage:", error);
      }
    };

    fetchUserFromLocalStorage();
    loadTweets();
  }, []);

  const loadTweets = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const data = await TweetService.getTweets(page, 10);
      console.log("📥 Tweets Fetched:", data);

      setTweets((prevTweets) => [...prevTweets, ...data.tweets]); // Append new tweets
      setPage(page + 1);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("❌ Error fetching tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reload tweets when a new tweet is posted or interacted with (Like/Retweet)
  const refreshFeed = async () => {
    console.log("🔄 Refreshing feed after interaction...");
    
    setPage(1);
    setHasMore(true);
    setLoading(true); // Prevent duplicate calls

    try {
      const data = await TweetService.getTweets(1, 10); // Fetch fresh tweets
      console.log("✅ Fresh tweets fetched");
      setTweets(data.tweets); // 🔥 Replace old tweets instead of appending
    } catch (error) {
      console.error("❌ Error refreshing tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="homepage-container">

      {loggedInUser && <TweetPost onTweetPosted={refreshFeed} />} {/* ✅ Post Component */}

      <div className="posts-container">
        {tweets.map((tweet, i) => (
          <Tweet key={i} tweet={tweet} loggedInUser={loggedInUser} onInteraction={refreshFeed} />
        ))}

        {loading && <p>Loading more tweets...</p>}
        
        {!loading && hasMore && (
          <button className="load-more" onClick={loadTweets}>
            Load More Tweets
          </button>
        )}
      </div>
      <div className="trends-container">
        <Trends />
      </div>
      <div className="sugg-container">
        <Suggestions/>
      </div>
    </div>

    
  );
};

export default Accueil;
