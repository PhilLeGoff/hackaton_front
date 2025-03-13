import React, { useState, useEffect, useRef } from "react";
import TweetService from "../../services/TweetService";
import UserService from "../../services/UserService.js";
import Tweet from "../../components/tweet/Tweet";
import TweetPost from "../../components/tweetpost/TweetPost";
import Trends from "../../components/cards/trends/Trends.jsx";
import Suggestions from "../../components/cards/suggestions/suggestions.jsx";
import "./Accueil.css";

const Accueil = () => {
  const [tweets, setTweets] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [detectedEmotion, setDetectedEmotion] = useState(""); // ✅ Stocker l’émotion détectée

  const videoRef = useRef(null);

  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      try {
        const user = localStorage.getItem("user");
        if (user) {
          console.log("📥 Utilisateur connecté trouvé");
          setLoggedInUser(JSON.parse(user));
        }
      } catch (error) {
        console.error("😢 Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    fetchUserFromLocalStorage();
    loadTweets();
    requestCameraPermission();

    return () => {
      stopCamera();
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      console.log("🎥 Demande d'autorisation de la caméra...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraPermission(true);
      console.log("✅ Caméra activée");
    } catch (error) {
      setCameraPermission(false);
      console.error("❌ Autorisation de la caméra refusée :", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      console.log("📴 Caméra arrêtée");
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current) return;

    // 🎥 Capture d'image depuis la caméra
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // 📷 Convertir en image Blob
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      try {
        console.log("📡 Envoi de l'image au serveur Flask...");
        const response = await fetch("http://localhost:5000/analyze", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("🧠 Émotion détectée :", data.emotion);
        setDetectedEmotion(data.emotion); // ✅ Mettre à jour l’émotion détectée

      } catch (error) {
        console.error("❌ Erreur lors de l'analyse :", error);
      }
    }, "image/jpeg");
  };

  const loadTweets = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const data = await TweetService.getTweets(page, 10);
      console.log("📥 Tweets récupérés :", data);

      setTweets((prevTweets) => [...prevTweets, ...data.tweets]);
      setPage(page + 1);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("😢 Erreur lors de la récupération des tweets :", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshFeed = async () => {
    console.log("🔄 Rafraîchissement du fil d'actualité...");

    setPage(1);
    setHasMore(true);
    setLoading(true);

    try {
      const updatedUser = await UserService.getUserProfile();

      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setLoggedInUser(updatedUser);
        console.log("✅ Informations utilisateur mises à jour");
      }

      const data = await TweetService.getTweets(1, 10);
      setTweets(data.tweets);
    } catch (error) {
      console.error("❌ Erreur lors du rafraîchissement :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="glass-overlay"></div>
      <div className="homepage-container">
        
        {/* ✅ Affichage de la caméra */}
        <div className="camera-container">
          <video ref={videoRef} autoPlay playsInline className="camera-feed"></video>
        </div>

        {/* ✅ Affichage de l'émotion détectée */}
        {detectedEmotion && (
          <p className="emotion-result">🧠 Émotion détectée : {detectedEmotion}</p>
        )}

        {/* ✅ Bouton pour analyser l'émotion */}
        <button className="analyze-btn" onClick={captureAndAnalyze}>
          Analyser l'émotion
        </button>

        {/* ✅ Message si la caméra est bloquée */}
        {cameraPermission === false && (
          <p className="error-message">⚠️ Accès caméra refusé. Activez-le dans les paramètres du navigateur.</p>
        )}

        <div className="tweet-container">
          {loggedInUser && <TweetPost onTweetPosted={refreshFeed} />}
        </div>

        <div className="posts-container">
          {tweets.map((tweet, i) => (
            <Tweet key={i} tweet={tweet} loggedInUser={loggedInUser} onInteraction={refreshFeed} />
          ))}

          {loading && <p>⏳ Chargement des tweets...</p>}

          {!loading && hasMore && (
            <button className="load-more" onClick={loadTweets}>Charger plus...</button>
          )}
        </div>

        <div className="trends-container">
          <Trends />
        </div>

        <div className="sugg-container">
          <Suggestions />
        </div>
      </div>
    </main>
  );
};

export default Accueil;
