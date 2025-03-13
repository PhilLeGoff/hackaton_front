export default Tweet;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Navigation vers le profil
import TweetService from "../../services/TweetService";
import "./Tweet.css";
import formatTimestamp from "../../hooks/formatTimeStamp";
import CommentSection from "../commentSection.js/CommentSection";

const Tweet = ({ tweet, loggedInUser, onInteraction }) => {
  const navigate = useNavigate();
  const isRetweet = !!tweet.originalTweet;
  const tweetToInteractWith = isRetweet ? tweet.originalTweet : tweet;

  const [likes, setLikes] = useState(tweetToInteractWith.likes.length);
  const [retweets, setRetweets] = useState(tweetToInteractWith.retweets.length);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasRetweeted, setHasRetweeted] = useState(false);
  const [retweetText, setRetweetText] = useState("");
  const [showRetweetInput, setShowRetweetInput] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      // ✅ Ensure retweeted tweets always get updated like/retweet data
      const targetTweet = tweetToInteractWith; // This is the tweet being interacted with

      setLikes(targetTweet.likes.length);
      setRetweets(targetTweet.retweets.length);

      setHasLiked(
        targetTweet.likes.some(
          (like) => like.toString() === loggedInUser._id.toString()
        )
      );
      setHasRetweeted(
        targetTweet.retweets.some(
          (retweet) => retweet.toString() === loggedInUser._id.toString()
        )
      );
      setIsSaved(loggedInUser.savedTweets.includes(targetTweet._id));
    }
  }, [tweetToInteractWith.likes, tweetToInteractWith.retweets, loggedInUser]); // ✅ Depend on latest like/retwee

  // ✅ Gérer le like
  const handleLike = async () => {
    try {
      await TweetService.likeTweet(tweetToInteractWith._id);
      setHasLiked(!hasLiked);
      setLikes(hasLiked ? likes - 1 : likes + 1);
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du like :", error);
    }
  };

  // ✅ Gérer le partage
  const handleRetweet = async () => {
    try {
      await TweetService.retweet(
        tweetToInteractWith._id,
        loggedInUser._id,
        retweetText
      );
      setHasRetweeted(true);
      setRetweets(retweets + 1);
      setShowRetweetInput(false);
      setRetweetText("");
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("❌ Erreur lors du partage :", error);
    }
  };

  // ✅ Annuler le partage
  const handleUndoRetweet = async () => {
    try {
      await TweetService.undoRetweet(tweetToInteractWith._id);
      setHasRetweeted(false);
      setRetweets(retweets - 1);
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("❌ Erreur lors de l'annulation du partage :", error);
    }
  };

  // ✅ Sauvegarder le tweet
  const handleSaveTweet = async () => {
    try {
      await TweetService.saveTweet(tweetToInteractWith._id);
      setIsSaved(true);
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde :", error);
    }
  };

  // ✅ Annuler la sauvegarde du tweet
  const handleUnsaveTweet = async () => {
    try {
      await TweetService.unsaveTweet(tweetToInteractWith._id);
      setIsSaved(false);
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("❌ Erreur lors de l'annulation de la sauvegarde :", error);
    }
  };

  // ✅ Supprimer un tweet
  const handleDeleteTweet = async () => {
    try {
      await TweetService.deleteTweet(tweetToInteractWith._id);
      if (onInteraction) onInteraction();
      setShowDeletePopup(false);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="tweet">
      {/* Infos de partage */}
      {isRetweet && (
        <p className="retweet-info">
          🔄 Partagé par <b>@{tweet.retweetedBy?.username}</b>
        </p>
      )}

      {/* Contenu du tweet partagé avec commentaire */}
      {isRetweet && tweet.text && (
        <p className="retweet-text">🗣️ {tweet.text}</p>
      )}

      {/* Contenu principal du tweet */}
      <div
        className={`${
          tweet.originalTweet ? "original-tweet" : "tweet-content"
        }`}
      >
        <div className="tweet-header">
          <div style={{display: "flex", gap: "10px", alignItems: "center"}}>

          <img
            src={
              tweetToInteractWith.userId?.avatar ||
              "https://via.placeholder.com/150"
            }
            alt="Avatar"
            className="tweet-avatar"
            onClick={() =>
              navigate(`/profile/${tweetToInteractWith.userId?._id}`)
            }
            />
          <h3
            className="username"
            onClick={() =>
              navigate(`/profile/${tweetToInteractWith.userId?._id}`)
            }
            >
            @{tweetToInteractWith.userId?.username} ·{" "}
            {formatTimestamp(tweetToInteractWith.createdAt)}
          </h3>

            </div>
          {/* ✅ Bouton de suppression (si l'utilisateur est le propriétaire) */}
          {loggedInUser &&
            loggedInUser._id === tweetToInteractWith.userId?._id && (
              <button
                className="delete-btn"
                onClick={() => setShowDeletePopup(true)}
              >
                ❌
              </button>
            )}
        </div>

        <p>{tweetToInteractWith.text}</p>

        {tweetToInteractWith.media && tweetToInteractWith.media.url && (
          <div className="tweet-media">
            {tweetToInteractWith.media.type === "image" ? (
              <img
                src={tweetToInteractWith.media.url}
                alt="Tweet Media"
                className="tweet-image"
              />
            ) : (
              <video
                src={tweetToInteractWith.media.url}
                controls
                className="tweet-video"
              />
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="tweet-actions">
        <button onClick={handleLike}>
          {hasLiked ? "💔 Je n'aime plus" : "❤️ J'aime"} {likes}
        </button>
        {hasRetweeted ? (
          <button onClick={handleUndoRetweet}>
            ❌ Annuler le partage {retweets}
          </button>
        ) : (
          <button onClick={() => setShowRetweetInput(!showRetweetInput)}>
            🔄 Partager {retweets}
          </button>
        )}
        {isSaved ? (
          <button onClick={handleUnsaveTweet}>❌ Retirer</button>
        ) : (
          <button onClick={handleSaveTweet}>💾 Sauvegarder</button>
        )}
        <button onClick={() => setShowComments(!showComments)}>
          💬 Commenter
        </button>
      </div>

      {/* Section de partage */}
      {showRetweetInput && !hasRetweeted && (
        <div className="retweet-input">
          <textarea
            placeholder="Ajoutez un commentaire..."
            value={retweetText}
            onChange={(e) => setRetweetText(e.target.value)}
          />
          <button onClick={handleRetweet}>✅ Confirmer</button>
        </div>
      )}

      {/* Section des commentaires */}
      {showComments && (
        <CommentSection
          tweetId={tweetToInteractWith._id}
          loggedInUser={loggedInUser}
        />
      )}

      {/* Confirmation de suppression */}
      {showDeletePopup && (
        <div className="delete-popup">
          <p>Voulez-vous vraiment supprimer ce post ?</p>
          <button onClick={handleDeleteTweet} className="confirm-delete">
            ✅ Oui
          </button>
          <button
            onClick={() => setShowDeletePopup(false)}
            className="cancel-delete"
          >
            ❌ Non
          </button>
        </div>
      )}
    </div>
  );
};

export default Tweet;
