import React, { useState } from "react";
import axios from "axios";

const TweetForm = ({ addTweet }) => {
  const [content, setContent] = useState("");
  const user = JSON.parse(localStorage.getItem("user")); // Récupérer l'utilisateur connecté

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    if (!user) {
      alert("Vous devez être connecté pour tweeter !");
      return;
    }

    try {
      const newTweet = {
        username: user.email, // Associer le tweet à l'utilisateur connecté
        content,
      };

      // Envoi du tweet au backend
      const response = await axios.post("http://localhost:5000/api/tweets", newTweet);
      
      // Ajouter le tweet à l'affichage
      addTweet(response.data);
      setContent("");
    } catch (error) {
      console.error("Erreur lors de l'ajout du tweet :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formContainer}>
      <input
        type="text"
        placeholder="Quoi de neuf ?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={styles.input}
        disabled={!user} // Désactive l'input si l'utilisateur n'est pas connecté
      />
      <button type="submit" style={styles.button} disabled={!user}>
        Tweeter
      </button>
    </form>
  );
};

// Styles
const styles = {
  formContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f5f8fa",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginRight: "10px",
  },
  button: {
    backgroundColor: "#1DA1F2",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default TweetForm;