import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "test@example.com" && password === "password") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
   
      <div className="login-left">
        <h1 className="login-logo">Twitter Clone</h1>
      </div>

  
      <div className="login-right">
        <h2>Sign in to Twitter</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">Log in</button>
        </form>
        <p>
          <a href="#" className="login-link">Forgot password?</a> · 
          <a href="#" className="login-link">Sign up for Twitter</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
