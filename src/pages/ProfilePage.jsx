import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [editable, setEditable] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setEditable(!editable);
  };

  const handleSave = () => {
    console.log("Saving profile data:", profileData);
    if (image) console.log("Profile image uploaded:", image);
    setEditable(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 sm:mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
        <button
          onClick={handleEditToggle}
          className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700"
        >
          {editable ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={preview || "/avatar-placeholder.png"}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover border-2 border-blue-600"
          />
          {editable && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              title="Change Profile Picture"
            />
          )}
        </div>
        <div className="text-center sm:text-left">
          <p className="text-lg font-semibold text-gray-800">{currentUser?.name || "Unknown User"}</p>
          <p className="text-sm text-gray-600">{currentUser?.email || "No email available"}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Username</label>
          {editable ? (
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-md text-gray-900 bg-gray-100 p-2 rounded-md">{profileData.name}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          {editable ? (
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-md text-gray-900 bg-gray-100 p-2 rounded-md">{profileData.email}</p>
          )}
        </div>

        {editable && (
          <button
            onClick={handleSave}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
