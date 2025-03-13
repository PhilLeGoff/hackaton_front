import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Navigation for profile link
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
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      setHasLiked(
        tweetToInteractWith.likes.some(
          (like) => like.toString() === loggedInUser._id.toString()
        )
      );
      setHasRetweeted(
        tweetToInteractWith.retweets.some(
          (retweet) => retweet.toString() === loggedInUser._id.toString()
        )
      );
      setIsSaved(loggedInUser.savedTweets.includes(tweetToInteractWith._id));

      if (loggedInUser.friends?.includes(tweetToInteractWith.userId?._id)) {
        setIsFriend(true);
      }
    }
  }, [tweetToInteractWith.likes, tweetToInteractWith.retweets, loggedInUser]);

  // ✅ Handle Like/Unlike
  const handleLike = async () => {
    try {
      await TweetService.likeTweet(tweetToInteractWith._id);
      setHasLiked(!hasLiked);
      setLikes(hasLiked ? likes - 1 : likes + 1);

      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("😞 Erreur lors du like:", error);
    }
  };

  // ✅ Handle Retweet
  const handleRetweet = async () => {
    try {
      await TweetService.retweet(tweetToInteractWith._id, loggedInUser._id, retweetText);
      setHasRetweeted(true);
      setRetweets(retweets + 1);
      setShowRetweetInput(false);
      setRetweetText("");

      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("😓 Erreur lors du repartage:", error);
    }
  };

  // ✅ Handle Undo Retweet
  const handleUndoRetweet = async () => {
    try {
      await TweetService.undoRetweet(tweetToInteractWith._id);
      setHasRetweeted(false);
      setRetweets(retweets - 1);

      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("😣 Erreur lors de l'annulation du repartage :", error);
    }
  };

  // ✅ Handle Save Tweet
  const handleSaveTweet = async () => {
    try {
      await TweetService.saveTweet(tweetToInteractWith._id);
      setIsSaved(true);
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("❌ Error saving tweet:", error);
    }
  };

  // ✅ Handle Unsave Tweet
  const handleUnsaveTweet = async () => {
    try {
      await TweetService.unsaveTweet(tweetToInteractWith._id);
      setIsSaved(false);
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("❌ Error unsaving tweet:", error);
    }
  };

  return (
    <div className="tweet">
      {/* Retweet Info */}
      {isRetweet && (
        <p className="retweet-info">
          <b>↳↴</b> repartagé par <b>@{tweet.retweetedBy?.username}</b>
          {isFriend && <span className="friend-badge"> 👥 Ami</span>}
        </p>
      )}

      {/* Retweet with comment */}
      {isRetweet && tweet.text && <p className="retweet-text">🗣️ {tweet.text}</p>}

      {/* Main Tweet Content */}
      {!isRetweet && (
        <div className="tweet-content">
          <div className="tweet-header">
            {/* ✅ User Avatar */}
            <img
              src={tweet.userId?.avatar || "https://res.cloudinary.com/dizuhubgy/image/upload/v1741862564/twitter-clone/avatars/avatar-1741862564254.png"}
              alt="Avatar"
              className="tweet-avatar"
              onClick={() => navigate(`/profile/${tweet.userId?._id}`)}
            />
            <h3 className="username" onClick={() => navigate(`/profile/${tweet.userId?._id}`)}>
              @{tweet.userId?.username} · {formatTimestamp(tweet.createdAt)}
              {isFriend && <span className="friend-badge"> 👥 Ami</span>}
            </h3>
          </div>

          <p>{tweet.text}</p>

          {tweet.media && tweet.media.url && (
            <div className="tweet-media">
              {tweet.media.type === "image" ? (
                <img src={tweet.media.url} alt="Tweet Media" className="tweet-image" />
              ) : (
                <video src={tweet.media.url} controls className="tweet-video" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Original Tweet Content (if Retweet) */}
      {isRetweet && (
        <div className="original-tweet">
          <div className="tweet-header">
            {/* ✅ Retweeted User Avatar */}
            <img
              src={tweet.originalTweet.userId?.avatar || "https://res.cloudinary.com/dizuhubgy/image/upload/v1741862564/twitter-clone/avatars/avatar-1741862564254.png"}
              alt="Avatar"
              className="tweet-avatar"
              onClick={() => navigate(`/profile/${tweet.originalTweet.userId?._id}`)}
            />
            <h3 className="username" onClick={() => navigate(`/profile/${tweet.originalTweet.userId?._id}`)}>
              @{tweet.originalTweet.userId?.username} · {formatTimestamp(tweet.originalTweet.createdAt)}
            </h3>
          </div>

          <p>{tweet.originalTweet.text}</p>

          {tweet.originalTweet.media && tweet.originalTweet.media.url && (
            <div className="tweet-media">
              {tweet.originalTweet.media.type === "image" ? (
                <img src={tweet.originalTweet.media.url} alt="Tweet Media" className="tweet-image" />
              ) : (
                <video src={tweet.originalTweet.media.url} controls className="tweet-video" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions: Like, Retweet, Save, Comment, Profile */}
      <div className="tweet-actions">
        <button onClick={handleLike}>
          {hasLiked ? "💔 Je n'aime plus" : "🩷 J'aime"} {likes}
        </button>

        {hasRetweeted ? (
          <button onClick={handleUndoRetweet}>
            😢 Annuler repartage {retweets}
          </button>
        ) : (
          <button onClick={() => setShowRetweetInput(!showRetweetInput)}>
            🔄 Repartager {retweets}
          </button>
        )}

        {isSaved ? (
          <button onClick={handleUnsaveTweet}>❌ Unsave</button>
        ) : (
          <button onClick={handleSaveTweet}>💾 Save</button>
        )}

        <button onClick={() => setShowComments(!showComments)}>💬 Comment</button>
      </div>

      {/* Retweet Input */}
      {showRetweetInput && !hasRetweeted && (
        <div className="retweet-input">
          <textarea
            placeholder="Ajoutez un commentaire à votre retweet..."
            value={retweetText}
            onChange={(e) => setRetweetText(e.target.value)}
          />
          <button onClick={handleRetweet}>✅ Confirmer le repartage</button>
        </div>
      )}

      {/* Comment Section */}
      {showComments && <CommentSection tweetId={tweetToInteractWith._id} loggedInUser={loggedInUser} />}
    </div>
  );
};

export default Tweet;
