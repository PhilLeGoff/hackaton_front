import React, { useState, useEffect } from "react";
import TweetService from "../../services/TweetService";
import "./Tweet.css";

const Tweet = ({ tweet, loggedInUser, onInteraction }) => {
  // Déterminer si c'est un repartage & sélectionner le bon imote
  const isRepartage = !!tweet.originalTweet;
  const imoteAInteragir = isRepartage ? tweet.originalTweet : tweet;

  // États pour les likes & repartages
  const [likes, setLikes] = useState(imoteAInteragir.likes.length);
  const [repartages, setRepartages] = useState(imoteAInteragir.retweets.length);
  const [aAime, setAAime] = useState(false);
  const [aRepartage, setARepartage] = useState(false);
  const [commentaireRepartage, setCommentaireRepartage] = useState("");
  const [afficherZoneRepartage, setAfficherZoneRepartage] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      setAAime(
        imoteAInteragir.likes.some((like) => like.toString() === loggedInUser._id.toString())
      );
      setARepartage(
        imoteAInteragir.retweets.some((retweet) => retweet.toString() === loggedInUser._id.toString())
      );
    }
  }, [imoteAInteragir.likes, imoteAInteragir.retweets, loggedInUser]);

  // 🎉 Gérer le Like / Unlike
  const handleLike = async () => {
    try {
      await TweetService.likeTweet(imoteAInteragir._id);
      setAAime(!aAime);
      setLikes(aAime ? likes - 1 : likes + 1);

      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("😞 Erreur lors du like :", error);
    }
  };

  // 🔄 Gérer le repartage
  const handleRepartage = async () => {
    try {
      await TweetService.retweet(imoteAInteragir._id, loggedInUser._id, commentaireRepartage);
      setARepartage(true);
      setRepartages(repartages + 1);
      setAfficherZoneRepartage(false);
      setCommentaireRepartage("");

      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("😓 Erreur lors du repartage :", error);
    }
  };

  // ❌ Annuler un repartage
  const handleAnnulerRepartage = async () => {
    try {
      await TweetService.undoRetweet(imoteAInteragir._id);
      setARepartage(false);
      setRepartages(repartages - 1);

      if (onInteraction) onInteraction();
    } catch (error) {
      console.error("😣 Erreur lors de l'annulation du repartage :", error);
    }
  };

  return (
    <div className="tweet">
      {/* Si c'est un repartage, afficher l'utilisateur qui a repartagé */}
      {isRepartage && (
        <p className="repartage-info">🔄 Repartagé par @{tweet.retweetedBy?.username}</p>
      )}

      {/* Afficher le commentaire du repartage */}
      {isRepartage && tweet.text && <p className="repartage-texte">🗣️ {tweet.text}</p>}

      {/* Contenu principal de l'imote */}
      {!isRepartage && (
        <div className="tweet-content">
          <h3 className="username">@{tweet.userId?.username}</h3>
          <p>{tweet.text}</p>

          {/* Afficher une image ou une vidéo si disponible */}
          {tweet.media && tweet.media.url && (
            <div className="tweet-media">
              {tweet.media.type === "image" ? (
                <img src={tweet.media.url} alt="📸 Média de l'imote" className="tweet-image" />
              ) : (
                <video src={tweet.media.url} controls className="tweet-video" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Si c'est un repartage, afficher l'imote original */}
      {isRepartage && (
        <div className="original-tweet">
          <h3 className="username">@{tweet.originalTweet.userId?.username}</h3>
          <p>{tweet.originalTweet.text}</p>

          {/* Afficher le média de l'imote original */}
          {tweet.originalTweet.media && tweet.originalTweet.media.url && (
            <div className="tweet-media">
              {tweet.originalTweet.media.type === "image" ? (
                <img src={tweet.originalTweet.media.url} alt="📸 Média de l'imote" className="tweet-image" />
              ) : (
                <video src={tweet.originalTweet.media.url} controls className="tweet-video" />
              )}
            </div>
          )}

          {/* Boutons J'aime et Repartager pour l'imote original */}
          <div className="tweet-actions">
            <button onClick={handleLike}>
              {aAime ? "💔 Je n'aime plus" : "❤️ J'aime"} {imoteAInteragir.likes.length}
            </button>
            
            {aRepartage ? (
              <button onClick={handleAnnulerRepartage}>😢 Annuler repartage {imoteAInteragir.retweets.length}</button>
            ) : (
              <button onClick={() => setAfficherZoneRepartage(!afficherZoneRepartage)}>
                🔄 Repartager {imoteAInteragir.retweets.length}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Boutons J'aime et Repartager pour les imotes normaux */}
      {!isRepartage && (
        <div className="tweet-actions">
          <button onClick={handleLike}>
            {aAime ? "💔 Je n'aime plus" : "❤️ J'aime"} {imoteAInteragir.likes.length}
          </button>
          {aRepartage ? (
            <button onClick={handleAnnulerRepartage}>😢 Annuler repartage {imoteAInteragir.retweets.length}</button>
          ) : (
            <button onClick={() => setAfficherZoneRepartage(!afficherZoneRepartage)}>
              🔄 Repartager {imoteAInteragir.retweets.length}
            </button>
          )}
        </div>
      )}

      {/* Zone pour ajouter un commentaire lors d'un repartage */}
      {afficherZoneRepartage && !aRepartage && (
        <div className="repartage-input">
          <textarea
            placeholder="Ajoutez un commentaire à votre repartage... ✍️"
            value={commentaireRepartage}
            onChange={(e) => setCommentaireRepartage(e.target.value)}
          />
          <button onClick={handleRepartage}>✅ Confirmer le repartage</button>
        </div>
      )}
    </div>
  );
};

export default Tweet;
