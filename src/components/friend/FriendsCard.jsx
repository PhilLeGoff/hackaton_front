import React from "react";
import { useNavigate } from "react-router-dom";
import "./FriendsCard.css";

const FriendsCard = ({ title, users, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>❌</button>
        <h3>{title}</h3>
        {users.length > 0 ? (
          <ul className="friends-list">
            {users.map((user) => (
              <li
                key={user._id}
                className="friend-item"
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                <img
                  src={user.avatar || "https://via.placeholder.com/50"}
                  alt="Avatar"
                  className="friend-avatar"
                />
                <span>{user.username}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun utilisateur</p>
        )}
      </div>
    </div>
  );
};

export default FriendsCard;
