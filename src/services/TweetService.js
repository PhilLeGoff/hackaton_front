import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/tweets`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  return { Authorization: `Bearer ${token}` };
};

const TweetService = {
   /**
   * Create a tweet with optional media
   */
   createTweet: async ({ text, media }) => {
    try {
      const formData = new FormData();
      formData.append("text", text);

      if (media) {
        formData.append("media", media);
      }

      console.log(getAuthHeaders())
      const response = await axios.post(`${API_BASE_URL}/`, formData, {
        headers: { 
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data"
        },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Tweet Creation Error:", error.response?.data || error.message);
      throw error.response?.data || { message: "Tweet creation failed" };
    }
  },

  /**
   * Fetch trending hashtags
   */
  getTrendingHashtags: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trending-hashtags`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching trending hashtags:", error);
      throw new Error("Failed to fetch trending hashtags");
    }
  },

  /**
   * Search tweets by hashtag
   */
  searchByHashtag: async (hashtag) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hashtag/${hashtag}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error searching tweets:", error);
      throw new Error("Failed to search tweets");
    }
  },

   /**
   * Fetch paginated tweets
   */
   getTweets: async (page = 1, limit = 10) => {
    try {
      console.log("getting tweets")
      const response = await axios.get(`${API_BASE_URL}/?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching tweets:", error);
      throw new Error("Failed to fetch tweets");
    }
  },

  /**
   * Like a tweet
   */
  likeTweet: async (tweetId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${tweetId}/like`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error liking tweet:", error);
      throw new Error("Failed to like the tweet");
    }
  },

  /**
   * Retweet a tweet
   */
  retweet: async (tweetId, userId, text = "") => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${tweetId}/retweet`,
        { text }, // ✅ Send text input
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error retweeting:", error);
      throw new Error("Failed to retweet");
    }
  },

  undoRetweet: async (tweetId) => {
    try {
      await axios.post(`${API_BASE_URL}/${tweetId}/undo-retweet`, {}, { headers: getAuthHeaders() });
    } catch (error) {
      console.error("❌ Error undoing retweet:", error);
      throw new Error("Failed to undo retweet");
    }
  },

  /**
   * Delete a tweet
   */
  deleteTweet: async (tweetId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${tweetId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting tweet:", error);
      throw new Error("Failed to delete the tweet");
    }
  },

  /**
   * Save a tweet
   */
  saveTweet: async (tweetId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${tweetId}/save`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error saving tweet:", error);
      throw new Error("Failed to save the tweet");
    }
  },

  /**
   * Unsave a tweet
   */
  unsaveTweet: async (tweetId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${tweetId}/unsave`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error unsaving tweet:", error);
      throw new Error("Failed to unsave the tweet");
    }
  },

  /**
   * Get user's saved tweets
   */
  getSavedTweets: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/saved`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching saved tweets:", error);
      throw new Error("Failed to fetch saved tweets");
    }
  },
  
  addComment: async (tweetId, text) => {
    return await axios.post(`${API_BASE_URL}/${tweetId}/comment`, { text }, { headers: getAuthHeaders() });
  },
  
  getComments: async (tweetId) => {
    return await axios.get(`${API_BASE_URL}/${tweetId}/comments`, { headers: getAuthHeaders() });
  },

  /**
   * Fetch tweets by hashtag
   */
  searchByHashtag: async (hashtag) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hashtag/${encodeURIComponent(hashtag)}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error searching by hashtag:", error);
      throw new Error("Failed to search by hashtag");
    }
  },

  /**
   * Fetch tweets by mention (username)
   */
  searchByMention: async (username) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mention/${encodeURIComponent(username)}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error searching by mention:", error);
      throw new Error("Failed to search by mention");
    }
  },

  /**
   * Fetch tweets by text query
   */
  searchByText: async (query) => {
    try {
      console.log("query sent", query)
      const response = await axios.get(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error searching by text:", error);
      throw new Error("Failed to search by text");
    }
  },

 findTweetsByUser : async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/user`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error searching by text:", error);
      throw new Error("Failed to search by text");
    }
  },
};

export default TweetService;
