import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/tweets`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Utilisateur non authentifié");

  return { Authorization: `Bearer ${token}` };
};

const TweetService = {
  /**
   * Créer un imote avec un média optionnel
   */
  createTweet: async ({ text, media }) => {
    try {
      const formData = new FormData();
      formData.append("text", text);

      if (media) {
        formData.append("media", media);
      }

      const response = await axios.post(`${API_BASE_URL}/`, formData, {
        headers: { 
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data"
        },
      });

      return response.data;
    } catch (error) {
      console.error("😢 Erreur lors de la création de l'imote :", error.response?.data || error.message);
      throw error.response?.data || { message: "Échec de la création de l'imote" };
    }
  },

  /**
   * Récupérer les hashtags populaires
   */
  getTrendingHashtags: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trending-hashtags`);
      return response.data;
    } catch (error) {
      console.error("😵 Erreur lors de la récupération des hashtags tendances :", error);
      throw new Error("Impossible de récupérer les hashtags tendances");
    }
  },

  /**
   * Rechercher des imotes par hashtag
   */
  searchByHashtag: async (hashtag) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hashtag/${hashtag}`);
      return response.data;
    } catch (error) {
      console.error("🤯 Erreur lors de la recherche d'imotes :", error);
      throw new Error("Échec de la recherche d'imotes");
    }
  },

  /**
   * Récupérer les imotes paginés
   */
  getTweets: async (page = 1, limit = 10) => {
    try {
      console.log("📥 Récupération des imotes...");
      const response = await axios.get(`${API_BASE_URL}/?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("🚨 Erreur lors de la récupération des imotes :", error);
      throw new Error("Impossible de récupérer les imotes");
    }
  },

  /**
   * Aimer un imote ❤️
   */
  likeTweet: async (tweetId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${tweetId}/like`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("💔 Erreur lors de l'ajout du like :", error);
      throw new Error("Échec de l'ajout du like à l'imote");
    }
  },

  /**
   * Repartager un imote 🔄
   */
  retweet: async (tweetId, userId, text = "") => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${tweetId}/retweet`,
        { text }, // ✅ Envoi du texte du commentaire
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("😵 Erreur lors du repartage :", error);
      throw new Error("Échec du repartage de l'imote");
    }
  },

  /**
   * Annuler un repartage ❌
   */
  undoRetweet: async (tweetId) => {
    try {
      await axios.post(`${API_BASE_URL}/${tweetId}/undo-retweet`, {}, { headers: getAuthHeaders() });
    } catch (error) {
      console.error("🤯 Erreur lors de l'annulation du repartage :", error);
      throw new Error("Échec de l'annulation du repartage");
    }
  },

  /**
   * Supprimer un imote 🗑️
   */
  deleteTweet: async (tweetId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${tweetId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de l'imote :", error);
      throw new Error("Impossible de supprimer l'imote");
    }
  },
};

export default TweetService;
