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
   * Update user profile
   */
  updateUser: async (userId, userData) => {
    try {
      console.log("in update user")
      const formData = new FormData();
  
      // Append text fields
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("bio", userData.bio);
  
      // Append file if a new avatar is selected
      if (userData.avatarFile) {
        formData.append("avatar", userData.avatarFile);
      }
      console.log("formdata", formData)
  
      const response = await axios.put(`${API_BASE_URL}/${userId}`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data", // ✅ Ensure multipart request
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("❌ Error updating user:", error);
      throw new Error("Failed to update user");
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
      console.log("getuserbyid", response.data)
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching user ${userId}:`, error);
      throw new Error("Failed to fetch user");
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
   * Follow a user (Add friend)
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
   * Unfollow a user (Remove friend)
   */
  unfollowUser: async (userId) => {
    try {
      console.log("unfollowing")
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

  /**
   * Get followers
   */
  getFollowers: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/followers/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching followers:", error);
      throw new Error("Failed to fetch followers");
    }
  },

  /**
   * Get following
   */
  getFollowing: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/following/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching followers:", error);
      throw new Error("Failed to fetch followers");
    }
  },
};

export default UserService;
