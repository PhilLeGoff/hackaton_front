import React, { useState, useEffect } from "react";
import TweetService from "../../services/TweetService";
import Tweet from "../../components/tweet/Tweet.jsx"; // Composant Imote
import TweetPost from "../../components/tweetpost/TweetPost"; // Composant de publication d'Imote
import Trends from '../../components/cards/trends/Trends.jsx';
import Suggestions from '../../components/cards/suggestions/suggestions.jsx';
import "./Accueil.css";

const Accueil = () => {
  const [tweets, setTweets] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null); // ✅ Stocker l'utilisateur connecté
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Récupérer l'utilisateur connecté depuis localStorage au chargement de la page
  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      try {
        const user = localStorage.getItem("user");
        if (user) {
          setLoggedInUser(JSON.parse(user)); // ✅ Convertir la chaîne JSON en objet
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
      console.log("📥 Imotes récupérés :", data);

      setTweets((prevTweets) => [...prevTweets, ...data.tweets]); // Ajouter de nouveaux imotes
      setPage(page + 1);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("😢 Erreur lors de la récupération des imotes :", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Recharger les imotes lorsqu'un nouvel imote est publié ou qu'une interaction se produit (Like/Retweet)
  const refreshFeed = async () => {
    console.log("🔄 Rafraîchissement du fil après interaction...");

    setPage(1);
    setHasMore(true);
    setLoading(true); // Éviter les appels en double

    try {
      const data = await TweetService.getTweets(1, 10); // Récupérer les imotes frais
      console.log("✅ Imotes mis à jour");
      setTweets(data.tweets); // 🔥 Remplacer les anciens imotes au lieu d'ajouter
    } catch (error) {
      console.error("😢 Erreur lors du rafraîchissement des imotes :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage-container">
      {loggedInUser && <TweetPost onTweetPosted={refreshFeed} />} {/* ✅ Composant de publication */}

      <div className="posts-container">
        {tweets.map((tweet, i) => (
          <Tweet key={i} tweet={tweet} loggedInUser={loggedInUser} onInteraction={refreshFeed} />
        ))}

        {loading && <p>⏳ Chargement des imotes...</p>}

        {!loading && hasMore && (
          <button className="load-more" onClick={loadTweets}>
            🔽 Charger plus d'imotes
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
  );
};

export default Accueil;
