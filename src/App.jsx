import React from 'react';
// import Header from './components/header/Header.jsx';
// import Footer from './components/footer/Footer.jsx';
// import Body from './components/body/Body.jsx';
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import './App.css'; 



function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

