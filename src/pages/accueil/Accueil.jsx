import React, { useState, useEffect } from "react";
import TweetService from "../../services/TweetService";
import Tweet from "../../components/tweet/Tweet"; // Tweet component
import TweetPost from "../../components/tweetpost/TweetPost"; // New Tweet Post component
import Trends from '../../components/cards/trends/Trends.jsx';
import Suggestions from '../../components/cards/suggestions/suggestions.jsx';
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
      console.log("📥 Tweets Fetched:", data);
      
      setTweets((prevTweets) => [...prevTweets, ...data.tweets]);
      setPage(page + 1);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("❌ Error fetching tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Corrected: Reload tweets after posting
  const handleNewTweet = async () => {
    console.log("🆕 New tweet posted, refreshing feed...");
    
    // Reset state to fetch fresh tweets
    setPage(1);
    setHasMore(true);
    setTweets([]); // 🔥 Clear previous tweets
    
    try {
      const data = await TweetService.getTweets(1, 10); // 🔥 Fetch fresh tweets
      setTweets(data.tweets);
    } catch (error) {
      console.error("❌ Error fetching fresh tweets:", error);
    }
  };

  return (
    <main className="main-content">
      <div className="homepage-container">
        <div className="tweet-container">
          <TweetPost onTweetPosted={handleNewTweet} /> {/* ✅ Post Component */}
        </div>
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
        <div className="trends-container">
          <Trends />
        </div>
        <div className="sugg-container">
          <Suggestions/>
        </div>
      </div>
      </main>

    
  );
};

export default Accueil;
