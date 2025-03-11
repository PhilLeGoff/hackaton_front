import React, { useState } from "react";
 
export default function UserProfile() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    bio: "Développeur passionné par le web et la tech",
  });
 
  const [isEditing, setIsEditing] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
 
  // Basculer entre l'affichage et l'édition
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
 
  return (
<div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
<h2 className="text-2xl font-bold mb-4">Profil Utilisateur</h2>
      {isEditing ? (
<form className="space-y-4">
<div>
<label className="block mb-1">Nom :</label>
<input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
</div>
<div>
<label className="block mb-1">Email :</label>
<input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
</div>
<div>
<label className="block mb-1">Bio :</label>
<textarea
              name="bio"
              value={user.bio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
</div>
<button
            type="button"
            onClick={toggleEdit}
            className="bg-green-500 text-white px-4 py-2 rounded"
>
            Enregistrer
</button>
</form>
      ) : (
<div>
<p><strong>Nom :</strong> {user.name}</p>
<p><strong>Email :</strong> {user.email}</p>
<p><strong>Bio :</strong> {user.bio}</p>
<button
            onClick={toggleEdit}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
>
            Modifier
</button>
</div>
      )}
</div>
  );
}