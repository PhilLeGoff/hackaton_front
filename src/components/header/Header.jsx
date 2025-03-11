import React, { useState } from "react";
import "./Header.css";
import LogoutButton from "../LogoutButton";
import TweetService from "../../services/TweetService";

const Header = () => {
  const [tweetText, setTweetText] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Retrieve token
  const token = localStorage.getItem("token");

  // Handle input change
  const handleTextChange = (e) => {
    setTweetText(e.target.value);
  };

  // Handle file selection (image/video)
  const handleMediaChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file)); // Preview image/video before upload
    }
  };

  // Handle tweet submission
  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("❌ You must be logged in to tweet.");
      setLoading(false);
      return;
    }

    try {
      await TweetService.createTweet({ text: tweetText, media, token });
      setMessage("✅ Tweet posted successfully!");
      setTweetText("");
      setMedia(null);
      setMediaPreview(null);
    } catch (error) {
      console.error("❌ Tweet Error:", error);
      setMessage("❌ Failed to post tweet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="header">
      <header style={{ backgroundColor: "#1DA1F2", padding: "10px 20px", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="logo">
          <h1>Twitter</h1>
        </div>

        <nav>
          <ul style={{ listStyle: "none", display: "flex", gap: "15px", margin: 0 }}>
            <li><a href="/" style={{ color: "white", textDecoration: "none" }}>Home</a></li>
            <li><a href="/explore" style={{ color: "white", textDecoration: "none" }}>Explore</a></li>
            <li><a href="/notifications" style={{ color: "white", textDecoration: "none" }}>Notifications</a></li>
            <li><a href="/profile" style={{ color: "white", textDecoration: "none" }}>Profile</a></li>
          </ul>
        </nav>

        {/* Tweet Input */}
        <form onSubmit={handleTweetSubmit} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="What's happening?"
            value={tweetText}
            onChange={handleTextChange}
            maxLength={280}
            required
            style={{ padding: "5px", width: "250px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <label>
            📸
            <input type="file" accept="image/*,video/*" onChange={handleMediaChange} style={{ display: "none" }} />
          </label>
          <button type="submit" disabled={loading} style={{ backgroundColor: "white", color: "#1DA1F2", padding: "5px 10px", borderRadius: "5px", border: "none", cursor: "pointer" }}>
            {loading ? "Tweeting..." : "Tweet"}
          </button>
        </form>

        {/* Media Preview */}
        {mediaPreview && (
          <div style={{ marginTop: "10px" }}>
            {media.type.startsWith("image") ? (
              <img src={mediaPreview} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }} />
            ) : (
              <video src={mediaPreview} controls style={{ width: "100px", height: "100px", borderRadius: "5px" }} />
            )}
          </div>
        )}

        {/* Status Message */}
        {message && <p style={{ color: "white", fontSize: "14px", marginTop: "10px" }}>{message}</p>}

        <LogoutButton />
      </header>
    </div>
  );
};

export default Header;
