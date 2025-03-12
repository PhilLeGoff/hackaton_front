import React from "react";
import "./Header.css";
import LogoutButton from "../LogoutButton";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate()
  return (
    <header className="header">
      <div className="logo">
        <h1>Twitter</h1>
      </div>
      <button onClick={() => navigate("profile")}>Profil</button>

      <nav>
        {/* <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/explore">Explore</a></li>
          <li><a href="/notifications">Notifications</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul> */}
      </nav>

      <LogoutButton />
    </header>
  );
};

export default Header;
