import React from 'react';
import './Trends.css';  // ✅ Import du fichier CSS

const Trends = () => {
  return (
    <div className="trends">
      <h2>📈 Tendances</h2> {/* Ajout d'un emoji pour le style */}
      <ul>
        <li>#MERN</li>
        <li>#ReactJS</li>
        <li>#JavaScript</li>
      </ul>
    </div>
  );
}

export default Trends;
