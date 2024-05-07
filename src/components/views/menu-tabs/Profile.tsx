import React, { useEffect, useState } from "react";
import { json, useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import "styles/views/menu-tabs/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { User } from "types";
import defaultImage from "images/puck.jpeg";
import Image1 from "images/Cat.jpeg";
import Image2 from "images/Dog.jpeg";

const imageUrls = [defaultImage, Image1, Image2];
// dario: add more images as needed (but first import them)
// code is only written for jpeg


const Profile = ({ user }: { user: User }) => {
  // nedim-j: rewrite to get token & id from menu
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const userId = localStorage.getItem("userId");

  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username);
  const [editedPassword, setEditedPassword] = useState(user.password);
  const [profilePicture, setProfilePicture] = useState(defaultImage); // Highlighted change
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    getUser();

    const storedProfilePicture = localStorage.getItem("profilePicture");
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    }
}, []);

  const sendEdit = async () => {
    setIsEditing(false);
    try {
      const requestBody = JSON.stringify({
        id: userId,
        username: editedUsername,
        password: editedPassword,
        token: userToken,
        profilePicture: profilePicture,
      });
      await api.put(`/users/${userId}`, requestBody);

      await getUser();
    } catch (error) {
      setEditedUsername(user.username);
      alert(
        `Something went wrong during updating the profile: \n${handleError(
          error
        )}`
      );
    }
  };

  const getUser = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      console.log("GET response: ", response);
      setEditedUsername(response.data.username);

    } catch (error) {
      alert(`Something went wrong fetching the user: \n${handleError(error)}`);
    }
  };

  const deleteUser = async () => {
    try {
      await api.delete(`/user/${userId}/delete`);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      alert(`Something went wrong deleting the user: \n${handleError(error)}`);
    }
  };

  const handleProfilePictureClick = () => {
    if (isEditing) {
      setShowImagePicker(true);
    }
  };
  const handleImageSelect = (selectedImage: string) => {
    setProfilePicture(selectedImage);
    localStorage.setItem("profilePicture", selectedImage);
    setShowImagePicker(false);
  };


  return (
    <>
      <div className="profile">
        <div className="container">
          <BaseContainer className="picture" onClick={handleProfilePictureClick}>
            <img src={profilePicture} alt="Profile"
                 style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
            {isEditing && (
                <div className="changeTextOverlay">Switch</div>
            )}
          </BaseContainer>

          <BaseContainer className="details">
            <BaseContainer className="item" style={{ marginTop: "1em" }}>
              <div className="label">Username:</div>
              {isEditing ? (
                <input
                  className="profile-input"
                  type="text"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                />
              ) : (
                <div className="value">{editedUsername}</div>
              )}
            </BaseContainer>

            <BaseContainer className="item" style={{ marginBottom: "1em" }}>
              <div className="label">Password: </div>
              {isEditing ? (
                <input
                  className="profile-input"
                  type="password"
                  value={editedPassword}
                  onChange={(e) => setEditedPassword(e.target.value)}
                />
              ) : (
                <div className="value">********</div>
              )}
            </BaseContainer>
          </BaseContainer>
        </div>

        {isEditing ? (
          <Button className="editButton" onClick={() => sendEdit()}>
            Save
          </Button>
        ) : (
          <>
            <Button
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button className="delete-button" onClick={() => deleteUser()}>
              Delete Account
            </Button>
          </>
        )}
      </div>

      {showImagePicker && (
          <div className="popup-overlay">
            <div className="popup">
              <button className="close" onClick={() => setShowImagePicker(false)}>
                &times;
              </button>
              <h2>Choose Profile Picture</h2>
              <div className="imageGrid">
                {imageUrls.map((imageUrl, index) => (
                    <div className="imageContainer" key={index}>
                      <img
                          src={imageUrl}
                          alt={`Image ${index + 1}`}
                          className="image"
                          onClick={() => handleImageSelect(imageUrl)}
                      />
                    </div>
                ))}
              </div>
            </div>
          </div>
      )}
    </>
  );
};

export default Profile;
