import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // ✅ Get userId from URL
import UserService from "../../services/UserService";
import "./Profile.css";

export default function UserProfile() {
  const { userId } = useParams(); // ✅ Extract userId from URL (if viewing another user)
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null); // ✅ Store logged-in user
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null); // ✅ Store selected file

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // ✅ Fetch logged-in user
        const loggedInUserData = await UserService.getUserProfile();
        setLoggedInUser(loggedInUserData);

        // ✅ Determine whose profile to fetch (own or another user's)
        const profileId = userId || loggedInUserData._id;
        const userData = await UserService.getUserById(profileId);
        setUser(userData);

        // ✅ Check if already a friend
        setIsFriend(loggedInUserData.following?.includes(userData._id));
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // ✅ Store file
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    console.log("updating")
    try {
      await UserService.updateUser(user._id, {
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarFile, // ✅ Pass the selected file
      });
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  const handleAddFriend = async () => {
    try {
      await UserService.followUser(user._id);
      setIsFriend(true);
    } catch (error) {
      console.error("❌ Error adding friend:", error);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await UserService.unfollowUser(user._id);
      setIsFriend(false);
    } catch (error) {
      console.error("❌ Error removing friend:", error);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <main className="main-content">
      <div className="profile-container">
        <h2>Profil Utilisateur</h2>
        <img src={user.avatar || "https://via.placeholder.com/150"} alt="Photo de profil" className="avatar" />

        {/* ✅ Show Edit Form if it's the logged-in user's profile */}
        {loggedInUser && loggedInUser._id === user._id ? (
          isEditing ? (
            <form className="profile-form">
              <div>
                <label>Photo de profil :</label>
                <input type="file" accept="image/*" onChange={handlePictureChange} />
              </div>
              <div>
                <label>Nom :</label>
                <input type="text" name="username" value={user.username} onChange={handleChange} />
              </div>
              <div>
                <label>Email :</label>
                <input type="email" name="email" value={user.email} onChange={handleChange} />
              </div>
              <div>
                <label>Bio :</label>
                <textarea name="bio" value={user.bio} onChange={handleChange} />
              </div>
              <button type="button" onClick={handleUpdateProfile} className="save-btn">
                Enregistrer
              </button>
            </form>
          ) : (
            <div className="profile-info">
              <p><strong>Nom :</strong> {user.username}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Bio :</strong> {user.bio}</p>
              <button onClick={() => setIsEditing(true)} className="edit-btn">Modifier</button>
            </div>
          )
        ) : (
          // ✅ If viewing another user's profile, show info + Add Friend button
          <div className="profile-info">
            <p><strong>Nom :</strong> {user.username}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Bio :</strong> {user.bio}</p>
            {isFriend ? (
              <button onClick={handleRemoveFriend} className="remove-friend-btn">Retirer de mes amis</button>
            ) : (
              <button onClick={handleAddFriend} className="add-friend-btn">Ajouter comme ami</button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
