import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/users`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  return { Authorization: `Bearer ${token}` };
};

const UserService = {
  /**
   * Fetch all users
   */
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  },

  /**
   * Fetch the logged-in user's profile
   */
  getUserProfile: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  },

  /**
   * Fetch user by ID
   */
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching user ${userId}:`, error);
      throw new Error("Failed to fetch user");
    }
  },

  /**
   * Update user profile
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${userId}`, userData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error updating user:", error);
      throw new Error("Failed to update user");
    }
  },

  /**
   * Delete user account
   */
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${userId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  },

  /**
   * Follow a user
   */
  followUser: async (userId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${userId}/follow`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error following user:", error);
      throw new Error("Failed to follow user");
    }
  },

  /**
   * Unfollow a user
   */
  unfollowUser: async (userId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${userId}/unfollow`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error unfollowing user:", error);
      throw new Error("Failed to unfollow user");
    }
  },

  /**
   * Save a tweet
   */
  saveTweet: async (tweetId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/saved/${tweetId}`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error saving tweet:", error);
      throw new Error("Failed to save tweet");
    }
  },

  /**
   * Unsave a tweet
   */
  unsaveTweet: async (tweetId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/saved/${tweetId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error unsaving tweet:", error);
      throw new Error("Failed to unsave tweet");
    }
  },

  /**
   * Get saved tweets
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
};

export default UserService;
