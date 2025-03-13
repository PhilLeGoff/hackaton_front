export default Accueil;
import React, { useState, useEffect, useRef } from "react";
import TweetService from "../../services/TweetService";
import UserService from "../../services/UserService.js";
import Tweet from "../../components/tweet/Tweet";
import TweetPost from "../../components/tweetpost/TweetPost";
import Trends from "../../components/cards/trends/Trends.jsx";
import Suggestions from "../../components/cards/suggestions/suggestions.jsx";
import Header from "../../components/header/Header"; // ✅ Import Header
import "./Accueil.css";

const Accueil = () => {
  const [tweets, setTweets] = useState([]); // ✅ Tweets state passed from Header
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      try {
        const user = localStorage.getItem("user");
        if (user) {
          console.log("📥 Logged in user found");
          setLoggedInUser(JSON.parse(user));
        }
      } catch (error) {
        console.error("😢 Error retrieving user:", error);
      }
    };

    fetchUserFromLocalStorage();
    if (tweets.length === 0) loadTweets();
    requestCameraPermission();

    return () => {
      stopCamera();
    };
  }, []);

  // ✅ Request camera permission
  const requestCameraPermission = async () => {
    try {
      console.log("🎥 Requesting camera permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraPermission(true);
      console.log("✅ Camera activated");
    } catch (error) {
      setCameraPermission(false);
      console.error("❌ Camera permission denied:", error);
    }
  };

  // ✅ Stop camera when component unmounts
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      console.log("📴 Camera stopped");
    }
  };

  // ✅ Load initial tweets if no search is performed
  const loadTweets = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const data = await TweetService.getTweets(page, 10);
      console.log("📥 Tweets fetched:", data);

      setTweets((prevTweets) => [...prevTweets, ...data.tweets]);
      setPage(page + 1);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("😢 Error fetching tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh feed & update user info
  const refreshFeed = async () => {
    console.log("🔄 Refreshing feed...");

    setPage(1);
    setHasMore(true);
    setLoading(true);

    try {
      const updatedUser = await UserService.getUserProfile();

      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setLoggedInUser(updatedUser);
        console.log("✅ Updated user info saved to localStorage");
      }

      const data = await TweetService.getTweets(1, 10);
      setTweets(data.tweets);
    } catch (error) {
      console.error("❌ Error refreshing feed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Header now handles tweet searching */}
      <Header setTweets={setTweets} />

      <main className="main-content">
        <div className="glass-overlay"></div>
        <div className="homepage-container">

          {/* ✅ Display camera feed */}
          <div className="camera-container">
            <video ref={videoRef} autoPlay playsInline className="camera-feed"></video>
          </div>

          {/* ✅ If permission is denied, show message */}
          {cameraPermission === false && (
            <p className="error-message">⚠️ Camera access denied. Please enable it in browser settings.</p>
          )}

          <div className="tweet-container">
            {loggedInUser && <TweetPost onTweetPosted={refreshFeed} />}
          </div>

          <div className="posts-container">
            {tweets.map((tweet, i) => (
              <Tweet key={i} tweet={tweet} loggedInUser={loggedInUser} onInteraction={refreshFeed} />
            ))}

            {loading && <p>⏳ Loading tweets...</p>}

            {!loading && hasMore && (
              <button className="load-more" onClick={loadTweets}>Load More...</button>
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
    </>
  );
};

export default Accueil;