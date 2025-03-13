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
      <div className="glass-overlay"></div>
      {/* Left Side Branding */}
      <div className="login-left">
      <div className="logo">
        <img src="https://i.imgur.com/iV5PR2K.png" alt="EmoTwitt Logo" className="logo-image" />
      </div>
        <h1 className="login-logo">EmoTwitt</h1>
      </div>

      {/* Signup Form */}
      <div className="login-right">
        <h2>Créer votre compte EmoTwitt</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="login-form">
          <input
            type="text"
            name="username"
            placeholder="👤 Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            className="login-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="📧 Email"
            value={formData.email}
            onChange={handleChange}
            className="login-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="🔑 Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="login-input"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="🔄 Confirmez le mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="login-input"
            required
          />
          {/* <input
            type="text"
            name="bio"
            placeholder="📝 Bio"
            value={formData.bio}
            onChange={handleChange}
            className="login-input"
            required
          /> */}
          <label className="file-input-label">
            📸 Télécharger un avatar
            <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} />
          </label>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "⏳ Inscription en cours..." : "S'inscrire"}
          </button>
        </form>

        {/* Message d'erreur */}
        {message && <p className="login-message">{message}</p>}

        {/* Liens supplémentaires */}
        <p>
          <Link to="/login" className="login-link"> Vous avez déjà un compte ? Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
