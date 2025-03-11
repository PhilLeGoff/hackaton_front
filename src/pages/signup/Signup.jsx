import { useState } from "react";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    avatar: null, // File
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(AuthService.getUser()); // Load user from storage
  const navigate = useNavigate()
  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Change
  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await AuthService.registerUser(formData);
      setMessage("✅ Registration successful!");
      setUser(AuthService.getUser());
      navigate('/')
       // Update user state after registration
    } catch (error) {
      console.error("❌ Registration Error:", error);
      setMessage(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Signup</h1>
      {user ? (
        <p>Welcome, {user.username}! 🎉</p>
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="text" name="bio" placeholder="Bio" onChange={handleChange} required />
          <label htmlFor="avatar" className="file-input-label">
            Choose an avatar
            <input type="file" name="avatar" id="avatar" accept="image/*" onChange={handleFileChange} required />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
