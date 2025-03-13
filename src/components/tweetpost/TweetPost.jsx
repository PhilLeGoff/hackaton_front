import React, { useState } from "react";
import TweetService from "../../services/TweetService";
import "./TweetPost.css";

const TweetPost = ({ onTweetPosted }) => {
  const [tweetText, setTweetText] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Retrieve token
  const token = localStorage.getItem("token");

  // Handle text change
  const handleTextChange = (e) => {
    setTweetText(e.target.value);
  };

  // Handle file selection (image/video)
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  // Handle tweet submission
  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("😡 Vous devez être connecté pour publier un emote !");
      setLoading(false);
      return;
    }

    try {
      await TweetService.createTweet({ text: tweetText, media, token });
      setMessage("😃 Emote publié avec succès ! 🎉");
      setTweetText("");
      setMedia(null);
      setMediaPreview(null);

      // Notify parent (Accueil) to reload tweets
      onTweetPosted();
    } catch (error) {
      console.error("😓 Erreur lors de la publication de l'emote :", error);
      setMessage("😞 Échec de la publication de l'emote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=".homepage-container">
      <form onSubmit={handleTweetSubmit} className="tweet-form">
        <input
          type="text"
          placeholder="Quoi de neuf ? 😃"
          value={tweetText}
          onChange={handleTextChange}
          maxLength={280}
          required
          className="tweet-input"
        />
        <label className="media-label">
          📸
          <input type="file" accept="image/*,video/*" onChange={handleMediaChange} style={{ display: "none" }} />
        </label>
        <button type="submit" disabled={loading} className="tweet-button">
          {loading ? "⏳ Publication en cours... 😬" : " Emote"}
        </button>
      </form>

      {mediaPreview && (
        <div className="media-preview">
          {media?.type?.startsWith("image") ? (
            <img src={mediaPreview} alt="🖼️ Aperçu 😍" />
          ) : (
            <video src={mediaPreview} controls />
          )}
        </div>
      )}

      {message && <p className="tweet-message">{message}</p>}
    </div>
  );
};

export default TweetPost;
