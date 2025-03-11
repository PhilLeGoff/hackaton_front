import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login/Login.css"; // You can use the same styles as Login

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({ name, email, password }));
      navigate("/home"); 
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="login-logo">Twitter</h1>
      </div>

      <div className="login-right">
        <h2>Create your Twitter account</h2>
        <form onSubmit={handleSignUp} className="login-form">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="login-input"
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">Sign up</button>
        </form>
        <p>
          <a href="/login" className="login-link">Already have an account? Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
