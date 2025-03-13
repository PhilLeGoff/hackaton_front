import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "./Login.css"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await AuthService.loginUser(formData);
      setMessage("✅ Login successful!");
      navigate("/");
    } catch (error) {
      console.error("❌ Login Error:", error);
      setMessage(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side Branding */}
      <div className="glass-overlay"></div>
      <div className="login-left">
      <div className="logo">
        <img src="https://i.imgur.com/iV5PR2K.png" alt="EmoTwitt Logo" className="logo-image" />
      </div>
        <h1 className="login-logo">EmoTwitt</h1>
      </div>

      {/* Login Form */}
      <div className="login-right">
        <h2> Se connecter à EmoTwitt</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "⏳ Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        {/* Message d'erreur */}
        {message && <p className="login-message">{message}</p>}

        {/* Liens supplémentaires */}
        <p>
          <a href="#" className="login-link">🔄 Mot de passe oublié ?</a>  
          <Link to="/signup" className="login-link">📝 S'inscrire sur EmoTwitt</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
