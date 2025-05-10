import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

const AuthService = {
  /**
   * Register a new user with an avatar image
   */
  registerUser: async ({ username, email, password, bio, avatar }) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("bio", bio);
      formData.append("avatar", avatar);

      const response = await axios.post(`${API_BASE_URL}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { token, user } = response.data;

      // Store the token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (error) {
      console.error("❌ Registration Error:", error.response?.data || error.message);
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  /**
   * Login an existing user and store token
   */
  loginUser: async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });

      const { token, user } = response.data;

      // Store the token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      throw error.response?.data || { message: "Login failed" };
    }
  },

  /**
   * Get the stored token
   */
  getToken: () => {
    return localStorage.getItem("token");
  },

  /**
   * Get the stored user info
   */
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Logout the user
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

export default AuthService;
