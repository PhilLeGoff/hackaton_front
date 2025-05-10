import React from "react";
import { Outlet } from "react-router-dom"; 
import Header from "../components/header/Header.jsx";
import Footer from "../components/footer/Footer.jsx";
import "../App.css"; 
import "./Layout.css";

const Layout = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="content">
        <Outlet /> {/* ✅ This is where the changing content will load */}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
