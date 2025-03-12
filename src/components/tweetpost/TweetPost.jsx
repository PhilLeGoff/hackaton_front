import React, { useState } from "react";
import TweetService from "../../services/TweetService";
import "./TweetPost.css";

const TweetPost = ({ onTweetPosted }) => {
  const [tweetText, setTweetText] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Récupérer le token
  const token = localStorage.getItem("token");

  // Gérer le changement de texte
  const handleTextChange = (e) => {
    setTweetText(e.target.value);
  };

  // Gérer la sélection de fichier (image/vidéo)
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  // Gérer la publication d'un imote
  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("😡 Vous devez être connecté pour publier un imote !");
      setLoading(false);
      return;
    }

    try {
      await TweetService.createTweet({ text: tweetText, media, token });
      setMessage("😃 Imote publié avec succès ! 🎉");
      setTweetText("");
      setMedia(null);
      setMediaPreview(null);

      // Notifier le parent (Accueil) pour recharger les imotes
      onTweetPosted();
    } catch (error) {
      console.error("😓 Erreur lors de la publication de l'imote :", error);
      setMessage("😞 Échec de la publication de l'imote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tweet-post">
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
          📸 Ajouter une image ou une vidéo
          <input type="file" accept="image/*,video/*" onChange={handleMediaChange} style={{ display: "none" }} />
        </label>
        <button type="submit" disabled={loading} className="tweet-button">
          {loading ? "⏳ Publication en cours... 😬" : " Publier 😃"}
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
