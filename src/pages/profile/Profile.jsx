import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserService from "../../services/UserService";
import TweetService from "../../services/TweetService";
import Tweet from "../../components/tweet/Tweet";
import FriendsCard from "../../components/friend/FriendsCard";
import "./Profile.css";

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const fetchUserData = async () => {
    try {
      const loggedInUserData = await UserService.getUserProfile();
      setLoggedInUser(loggedInUserData);

      const profileId = userId || loggedInUserData._id;
      const userData = await UserService.getUserById(profileId);
      setUser(userData);

      setIsFriend(loggedInUserData.following?.includes(userData._id));

      const response = await TweetService.findTweetsByUser(userData.username);
      setTweets(response);

      const followersData = await UserService.getFollowers(profileId);
      setFollowers(followersData.followers); // Extract followers list

      const followingData = await UserService.getFollowing(profileId);
      setFollowing(followingData.following); // Extract following list
    } catch (err) {
      console.error("❌ Erreur lors du chargement du profil :", err);
      setError("Impossible de charger le profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await UserService.updateUser(user._id, {
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarFile,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du profil :", error);
    }
  };

  const handleAddFriend = async () => {
    try {
      await UserService.followUser(user._id);
      setIsFriend(true);
      fetchUserData();
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout en ami :", error);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await UserService.unfollowUser(user._id);
      setIsFriend(false);
      fetchUserData();
    } catch (error) {
      console.error("❌ Erreur lors de la suppression d'ami :", error);
    }
  };

  if (loading) return <p>Chargement du profil...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <main className="main-content">
        <div className="profile-layout">
          {/* Profile Section */}
          <div className="profile-container">
            <h2>Profil Utilisateur</h2>
            <img
              src={user.avatar || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="avatar"
            />

            {loggedInUser && loggedInUser._id === user._id ? (
              isEditing ? (
                <form className="profile-form">
                  <div>
                    <label>Photo de profil :</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePictureChange}
                    />
                  </div>
                  <div>
                    <label>Nom :</label>
                    <input
                      type="text"
                      name="username"
                      value={user.username}
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
                    <textarea
                      name="bio"
                      value={user.bio}
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUpdateProfile}
                    className="save-btn"
                  >
                    Enregistrer
                  </button>
                </form>
              ) : (
                <div className="profile-info">
                  <p>
                    <strong>Nom :</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email :</strong> {user.email}
                  </p>
                  <p>
                    <strong>Bio :</strong> {user.bio}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="edit-btn"
                  >
                    Modifier
                  </button>
                  <div className="followers-following-container">
              <button className="friends-btn" onClick={() => setShowFollowers(true)}>
                Abonnés: {followers.length}
              </button>
              <button className="friends-btn" onClick={() => setShowFollowing(true)}>
                Abonnements: {following.length}
              </button>
            </div>
                </div>
              )
            ) : (
              <div className="profile-info">
                <p>
                  <strong>Nom :</strong> {user.username}
                </p>
                <p>
                  <strong>Email :</strong> {user.email}
                </p>
                <p>
                  <strong>Bio :</strong> {user.bio}
                </p>
                {!isFriend ? (
                  <button
                    onClick={handleAddFriend}
                    className="add-friend-btn"
                  >
                    S'abonner
                  </button>
                ) : (
                  <button onClick={handleRemoveFriend} className="remove-friend-btn">
                    Se désabonner
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Tweets Section */}
          <div className="user-tweets-container">
            <h3>Tweets de {user.username}</h3>
            {tweets.length > 0 ? (
              tweets.map((tweet, i) => (
                <Tweet
                  key={i}
                  tweet={tweet}
                  loggedInUser={loggedInUser}
                  onInteraction={fetchUserData}
                />
              ))
            ) : (
              <p>Aucun tweet pour le moment.</p>
            )}
          </div>{" "}
        </div>

       {showFollowers && <FriendsCard title="Abonnés" users={followers} onClose={() => setShowFollowers(false)} />}
      {showFollowing && <FriendsCard title="Abonnements" users={following} onClose={() => setShowFollowing(false)} />}
    </main>
  );
}
