import React, { useState, useEffect } from "react";
import TweetService from "../../services/TweetService";
import Tweet from "../../components/tweet/Tweet"; // Tweet component
import TweetPost from "../../components/tweetpost/TweetPost"; // New Tweet Post component
import "./Accueil.css";

const Accueil = () => {
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadTweets();
  }, []);

  const loadTweets = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const data = await TweetService.getTweets(page, 10);
      setTweets((prevTweets) => [...prevTweets, ...data.tweets]);
      setPage(page + 1);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("❌ Error fetching tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Callback for new tweets
  const handleNewTweet = async () => {
    setPage(1);
    setTweets([]);
    loadTweets();
  };

  return (
    <div className="homepage-container">
      <TweetPost onTweetPosted={handleNewTweet} /> {/* 🔥 New TweetPost Component */}
      <div className="posts-container">
        {tweets.map((tweet, i) => (
          <Tweet key={i} tweet={tweet} />
        ))}
        {loading && <p>Loading more tweets...</p>}
        {!loading && hasMore && (
          <button className="load-more" onClick={loadTweets}>
            Load More Tweets
          </button>
        )}
      </div>
    </div>
  );
};

export default Accueil;
