import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "../login/Login.css"; // Using the same styles as login

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    avatar: null, // File
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

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

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      await AuthService.registerUser(formData);
      setMessage("✅ Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("❌ Registration Error:", error);
      setMessage(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side Branding */}
      <div className="login-left">
        <h1 className="login-logo">EmoTwitt</h1>
      </div>

      {/* Signup Form */}
      <div className="login-right">
        <h2>Create your EmoTwitt account</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="login-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="login-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="login-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="login-input"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="login-input"
            required
          />
          {/* <input
            type="text"
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            className="login-input"
            required
          /> */}
          <label className="file-input-label">
            Upload Avatar
            <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} />
          </label>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        {/* Error Message */}
        {message && <p className="login-message">{message}</p>}

        {/* Links */}
        <p>
          <Link to="/login" className="login-link">Already have an account? Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
