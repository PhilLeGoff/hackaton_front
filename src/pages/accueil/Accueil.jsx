import React, { useState, useEffect } from "react";
import TweetService from "../../services/TweetService";
import AuthService from "../../services/AuthService"; // ✅ Import AuthService
import Tweet from "../../components/tweet/Tweet"; // Tweet component
import TweetPost from "../../components/tweetpost/TweetPost"; // New Tweet Post component
import Trends from "../../components/cards/trends/Trends.jsx";
import Suggestions from "../../components/cards/suggestions/suggestions.jsx";
import "./Accueil.css";
import UserService from "../../services/UserService.js";

const Accueil = () => {
  const [tweets, setTweets] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Fetch the logged-in user from localStorage when the page loads
  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      try {
        const user = localStorage.getItem("user");
        if (user) {
          console.log("📥 Logged in user found");
          setLoggedInUser(JSON.parse(user));
        }
      } catch (error) {
        console.error("😢 Erreur lors de la récupération de l'utilisateur :", error);
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
      console.log("📥 Emotes récupérés :", data);

      setTweets((prevTweets) => [...prevTweets, ...data.tweets]); // Append new tweets
      setPage(page + 1);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error(" 😢 Erreur lors de la récupération des imotes:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh feed & fetch updated user info
  const refreshFeed = async () => {
    console.log("🔄 Rafraîchissement du fil après interaction...");

    setPage(1);
    setHasMore(true);
    setLoading(true);

    try {
      // 🔥 Fetch updated user info
      const updatedUser = await UserService.getUserProfile();
      
      if (updatedUser) {
        // 🔥 Store updated user in localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setLoggedInUser(updatedUser);
        console.log("✅ Updated user info saved to localStorage");
      }

      // 🔥 Fetch fresh tweets
      const data = await TweetService.getTweets(1, 10);
      setTweets(data.tweets);
    } catch (error) {
      console.error("❌ Error refreshing feed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="glass-overlay"></div>
      <div className="homepage-container">
        <div className="tweet-container">
          {loggedInUser && <TweetPost onTweetPosted={refreshFeed} />}{" "}
          {/* ✅ Post Component */}
        </div>

        <div className="posts-container">
          {tweets.map((tweet, i) => (
            <Tweet
              key={i}
              tweet={tweet}
              loggedInUser={loggedInUser}
              onInteraction={refreshFeed}
            />
          ))}

          {loading && <p>⏳ Chargement des Emotes...</p>}

          {!loading && hasMore && (
            <button className="load-more" onClick={loadTweets}>
              Charger plus...
            </button>
          )}
        </div>

        <div className="trends-container">
          <Trends />
        </div>

        <div className="sugg-container">
          <Suggestions />
        </div>
      </div>
    </main>
  );
};

export default Accueil;
