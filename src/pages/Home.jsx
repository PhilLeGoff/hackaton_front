import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    avatar: null, // File
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected File:", file); // Debugging
    setFormData({ ...formData, avatar: file });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("bio", formData.bio);
      data.append("avatar", formData.avatar); // File

      const response = await axios.post("http://localhost:3000/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Registration successful!");
      console.log("Server Response:", response.data);
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      setMessage("❌ Registration failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="bio" placeholder="Bio" onChange={handleChange} required />

        {/* File Input Wrapper */}
        <label htmlFor="avatar" className="file-input-label">
          Choose an avatar
          <input
            type="file"
            name="avatar"
            id="avatar"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="file-input"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
