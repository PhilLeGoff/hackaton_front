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
  retweet: async (tweetId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${tweetId}/retweet`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error retweeting:", error);
      throw new Error("Failed to retweet");
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
};

export default TweetService;
