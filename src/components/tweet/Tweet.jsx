import React, { useState, useEffect } from "react";
import TweetService from "../../services/TweetService";
import "./Tweet.css";
import formatTimestamp from "../../hooks/formatTimeStamp";
import CommentSection from "../commentSection.js/CommentSection";
// import séocket from "../../utils/socket";

const Tweet = ({ tweet, loggedInUser, onInteraction }) => {
  // Determine if it's a retweet & select the correct tweet to interact with
  const isRetweet = !!tweet.originalTweet;
  const tweetToInteractWith = isRetweet ? tweet.originalTweet : tweet;

  // State for likes & retweets
  const [likes, setLikes] = useState(tweetToInteractWith.likes.length);
  const [retweets, setRetweets] = useState(tweetToInteractWith.retweets.length);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasRetweeted, setHasRetweeted] = useState(false);
  const [retweetText, setRetweetText] = useState("");
  const [showRetweetInput, setShowRetweetInput] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);

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
    }
  }, [tweetToInteractWith.likes, tweetToInteractWith.retweets, loggedInUser]);

  // ✅ Handle Like/Unlike (Triggers Feed Refresh)
  const handleLike = async () => {
    try {
      await TweetService.likeTweet(tweetToInteractWith._id);
      // socket.emit("like_téweet", { user: loggedInUser.username, tweetId: tweet._id });
      setHasLiked(!hasLiked);
      setLikes(hasLiked ? likes - 1 : likes + 1);

      // ✅ Refresh feed after like action
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("😞 Erreur lors du like:", error);
    }
  };

  // ✅ Handle Retweet
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

      // ✅ Refresh feed after retweet
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("😓 Erreur lors du repartage:", error);
    }
  };

  // ✅ Handle Undo Retweet (Directly Calls the Service)
  const handleUndoRetweet = async () => {
    try {
      await TweetService.undoRetweet(tweetToInteractWith._id);
      setHasRetweeted(false);
      setRetweets(retweets - 1);

      // ✅ Refresh feed after undo retweet
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("😣 Erreur lors de l'annulation du repartage :", error);
    }
  };

  const handleSaveTweet = async () => {
    try {
      await TweetService.saveTweet(tweetToInteractWith._id);
      setIsSaved(true);
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("❌ Error saving tweet:", error);
    }
  };

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
      {/* If this is a retweet, show who retweeted it */}
      {isRetweet && (
        <p className="retweet-info"><b>↳↴</b> repartagé par<b> @{tweet.retweetedBy?.username}</b></p>
      )}

      {/* If it's a retweet with additional comment, display it */}
      {isRetweet && tweet.text && <p className="retweet-text">🗣️{tweet.text}</p>}

      {/* Main Tweet Content (for original tweets) */}
      {!isRetweet && (
        <div className="tweet-content">
          <h3 className="username">
            @{tweet.userId?.username} · {formatTimestamp(tweet.createdAt)}
          </h3>
          <p>{tweet.text}</p>

          {/* Show media if available */}
          {tweet.media && tweet.media.url && (
            <div className="tweet-media">
              {tweet.media.type === "image" ? (
                <img
                  src={tweet.media.url}
                  alt="Tweet Media"
                  className="tweet-image"
                />
              ) : (
                <video src={tweet.media.url} controls className="tweet-video" />
              )}
            </div>
          )}
        </div>
      )}

      {/* ✅ If this is a retweet, display the original tweet below it with like/retweet buttons */}
      {isRetweet && (
        <div className="original-tweet">
          <h3 className="username">
            @{tweet.originalTweet.userId?.username} ·{" "}
            {formatTimestamp(tweet.originalTweet.createdAt)}
          </h3>
          <p>{tweet.originalTweet.text}</p>

          {/* Show media from the original tweet if available */}
          {tweet.originalTweet.media && tweet.originalTweet.media.url && (
            <div className="tweet-media">
              {tweet.originalTweet.media.type === "image" ? (
                <img
                  src={tweet.originalTweet.media.url}
                  alt="Tweet Media"
                  className="tweet-image"
                />
              ) : (
                <video
                  src={tweet.originalTweet.media.url}
                  controls
                  className="tweet-video"
                />
              )}
            </div>
          )}

          {/* ✅ Like & Retweet buttons for the original tweet */}
          <div className="tweet-actions">
            <button onClick={handleLike}>
              {hasLiked ? "💔 Je n'aime plus" : "🩷 J'aime"} {tweetToInteractWith.likes.length}

            </button>

            {/* ✅ If the user has retweeted, show "Undo Retweet" */}
            {hasRetweeted ? (
              <button onClick={handleUndoRetweet}>😢 Annuler repartage {tweetToInteractWith.retweets.length}</button>
            ) : (
              <button onClick={() => setShowRetweetInput(!showRetweetInput)}>
                🔄 Repartager {tweetToInteractWith.retweets.length}
              </button>
            )}
            {isSaved ? (
              <button onClick={handleUnsaveTweet}>❌ Unsave</button>
            ) : (
              <button onClick={handleSaveTweet}>💾 Save</button>
            )}
            <div className="tweet-actions">
              <button onClick={() => setShowComments(!showComments)}>
                💬 Comment
              </button>
            </div>

           
          </div>
        </div>
      )}

      {/* ✅ Like & Retweet buttons for normal tweets (if not a retweet) */}
      {!isRetweet && (
        <div className="tweet-actions">
          <button onClick={handleLike}>
            {hasLiked ? "💔 Je n'aime plus" : "🩷 J'aime"} {tweetToInteractWith.likes.length}
          </button>
          {hasRetweeted ? (
            <button onClick={handleUndoRetweet}>😢 Annuler repartage {tweetToInteractWith.retweets.length}</button>

          ) : (
            <button onClick={() => setShowRetweetInput(!showRetweetInput)}>
              🔄 Repartager {tweetToInteractWith.retweets.length}
            </button>
          )}
          {isSaved ? (
            <button onClick={handleUnsaveTweet}>❌ Unsave</button>
          ) : (
            <button onClick={handleSaveTweet}>💾 Save</button>
          )}
        </div>
      )}

      {/* Retweet Text Input */}
      {showRetweetInput && !hasRetweeted && (
        <div className="retweet-input">
          <textarea
            placeholder="Add a comment to your retweet..."
            value={retweetText}
            onChange={(e) => setRetweetText(e.target.value)}
          />
          <button onClick={handleRetweet}>✅ Confirmer le repartage</button>
        </div>
      )}
       {showComments && (
              <CommentSection tweetId={tweet._id} loggedInUser={loggedInUser} />
            )}
    </div>
   
  );
};

export default Tweet;
