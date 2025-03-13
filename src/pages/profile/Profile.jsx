import React, { useState } from "react";
import "./Profile.css";

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    bio: "Développeur passionné par le web et la tech",
    avatar: "https://via.placeholder.com/150", // Image par défaut
  });

  const [isEditing, setIsEditing] = useState(false);
  const [friends, setFriends] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addFriend = () => {
    const friendName = prompt("Entrez le nom de votre ami :");
    if (friendName) {
      setFriends([...friends, friendName]);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <main className="main-content">
      <div className="profile-container">
        <h2>Profil Utilisateur</h2>
        <img src={user.avatar} alt="Photo de profil" className="avatar" />
        {isEditing ? (
          <form className="profile-form">
            <div>
              <label>Photo de profil :</label>
              <input type="file" accept="image/*" onChange={handlePictureChange} />
            </div>
            <div>
              <label>Nom :</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Email :</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Bio :</label>
              <textarea name="bio" value={user.bio} onChange={handleChange} />
            </div>
            <button type="button" onClick={toggleEdit} className="save-btn">
              Enregistrer
            </button>
          </form>
        ) : (
          <div className="profile-info">
            <p><strong>Nom :</strong> {user.name}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Bio :</strong> {user.bio}</p>
            <button onClick={toggleEdit} className="edit-btn">Modifier</button>
            <button onClick={addFriend} className="add-friend-btn">Ajouter un ami</button>
          </div>
        )}
        <div className="friends-list">
          <h3>Amis :</h3>
          {friends.length > 0 ? (
            <ul>
              {friends.map((friend, index) => (
                <li key={index}>{friend}</li>
              ))}
            </ul>
          ) : (
            <p>Aucun ami ajouté pour le moment</p>
          )}
        </div>
      </div>
    </main>
  );
}