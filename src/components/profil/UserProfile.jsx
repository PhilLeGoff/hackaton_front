import React, { useState, useEffect } from "react";
import "./UserProfile.css";

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "https://via.placeholder.com/150",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [friends, setFriends] = useState([]);

  // Récupérer l'utilisateur connecté depuis le back-end
  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token"); // Récupérer le token stocké
      const response = await fetch("/api/user/:userId", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données utilisateur");
      }
      const data = await response.json();
      setUser(data); // Met à jour le state avec les données récupérées
      setFriends(data.friends || []);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };
});
  

  // Gestion des changements dans les champs de formulaire
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Changer la photo de profil
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Ajouter un ami
  const addFriend = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/${friendId}/follow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert("Ami ajouté !");
        fetchUserData(); // Recharger la liste d'amis
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'ami :", error);
    }
  };
  
  // Supprimer un ami
  const removeFriend = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/user/${friendId}/unfollow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert("Ami supprimé !");
        fetchUserData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'ami :", error);
    }
  };

  // Sauvegarder les modifications utilisateur
  const updateUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("api/user/:userId", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des données");
      }
      const updatedData = await response.json();
      setUser(updatedData);
      setIsEditing(false); // Quitter le mode édition
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profil Utilisateur</h2>
      <img src={user.profilePicture} alt="Photo de profil" className="profile-picture" />

      {isEditing ? (
        <form className="profile-form">
          <div>
            <label>Photo de profil :</label>
            <input type="file" accept="image/*" onChange={handlePictureChange} />
          </div>
          <div>
            <label>Nom :</label>
            <input type="text" name="name" value={user.name} onChange={handleChange} />
          </div>
          <div>
            <label>Email :</label>
            <input type="email" name="email" value={user.email} onChange={handleChange} />
          </div>
          <div>
            <label>Bio :</label>
            <textarea name="bio" value={user.bio} onChange={handleChange} />
          </div>
          <button type="button" onClick={saveChanges} className="save-btn">Enregistrer</button>
        </form>
      ) : (
        <div className="profile-info">
          <p><strong>Nom :</strong> {user.name}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Bio :</strong> {user.bio}</p>
          <button onClick={() => setIsEditing(true)} className="edit-btn">Modifier</button>
          <button onClick={addFriend} className="add-friend-btn">Ajouter un ami</button>
        </div>
      )}

      <div className="friends-list">
        <h3>Amis :</h3>
        {friends.length > 0 ? (
          <ul>
            {friends.map((friend, index) => (
              <li key={index}>
                {friend}
                <button onClick={() => removeFriend(index)} className="remove-friend-btn">Supprimer</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun ami ajouté pour le moment.</p>
        )}
      </div>
    </div>
  );
}
