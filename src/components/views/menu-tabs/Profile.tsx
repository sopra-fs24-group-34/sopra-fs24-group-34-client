import React, { useEffect, useState } from "react";
import { json, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import "styles/views/menu-tabs/Profile.scss";
import { Spinner } from "components/ui/Spinner";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { User } from "types";
import defaultImage from "images/puck.jpeg";
import Image1 from "images/Cat.jpeg";
import Image2 from "images/Dog.jpeg";
import { doHandleError } from "../../../helpers/errorHandler";
import { toastContainerError } from "../Toasts/ToastContainerError";
import { Toast } from "react-toastify/dist/components";

const imageUrls = [defaultImage, Image1, Image2];
// dario: add more images as needed (but first import them)
// code is only written for jpeg

const Invitation = ({ creatorId, profilePicture, username, lobbyId, func }) => (
  <>
    <div className="friend-container">
      <BaseContainer className="friend-picture">
        <img src={profilePicture} alt="Profile" />
      </BaseContainer>
      <div className="value">{username}</div>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        marginBottom: "15px",
      }}
    >
      <Button
        style={{
          backgroundColor: "green",
          marginRight: "10px",
        }}
        onClick={() => func(true, creatorId, lobbyId)}
      >
        Join
      </Button>
      <Button
        style={{ backgroundColor: "red" }}
        onClick={() => func(false, creatorId, lobbyId)}
      >
        Decline
      </Button>
    </div>
  </>
);

Invitation.propTypes = {
  creatorId: PropTypes.num,
  profilePicture: PropTypes.string,
  username: PropTypes.string,
  lobbyId: PropTypes.num,
  func: PropTypes.func,
};

const Profile = ({ user }: { user: User }) => {
  // nedim-j: rewrite to get token & id from menu
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const userId = Number(localStorage.getItem("userId"));

  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username);
  const [editedPassword, setEditedPassword] = useState(user.password);
  const [profilePicture, setProfilePicture] = useState(defaultImage); // Highlighted change
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lobbyInvitations, setLobbyInvitations] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    getUser();

    const storedProfilePicture = localStorage.getItem("profilePicture");
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    }
  }, []);

  useEffect(() => {
    async function fetchLobbyInvitations() {
      try {
        const response = await api.get(`users/${userId}/lobbies/invitations`);

        setLobbyInvitations(response.data);
        console.log("GET lobbyInvitations: ", response);
      } catch (error) {
        toast.error(doHandleError(error));
      }
    }
    fetchLobbyInvitations();
  }, [reload]);

  const sendEdit = async () => {
    setLoading(true);
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
      toast.error(doHandleError(error));
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${userId}`);
      console.log("GET response: ", response);
      setEditedUsername(response.data.username);
      setEditedPassword(response.data.password); //dario: needed, else password field is first time used empty
      setLoading(false);
    } catch (error) {
      toast.error(doHandleError(error));
    }
  };

  const deleteUser = async () => {
    setLoading(true);
    try {
      await api.delete(`/users/${userId}/delete`);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      toast.error(doHandleError(error));
    } finally {
      setLoading(false);
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

  if (loading) {
    return <Spinner />;
  }
  const answerLobbyInvitation = async (
    answer: boolean,
    creatorId: number,
    lobbyId: number
  ) => {
    try {
      const requestBody = JSON.stringify({
        creatorId: creatorId,
        invitedUserId: userId,
        lobbyId: lobbyId,
        answer: answer,
      });

      await api.put("/lobbies/invitation/answer", requestBody);
      if (answer) {
        await api.put(`/lobbies/join/${lobbyId}/${userId}`);
        localStorage.setItem("lobbyId", lobbyId.toString());

        navigate("/lobby");
      }
      setReload(!reload);
    } catch (error) {
      toast.error(doHandleError(error));
    }
  };

  return (
    <>
      <div className="profile">
        <ToastContainer {...toastContainerError} />
        <div className="profile-wrapper">
          <div className="container">
            <BaseContainer
              className="picture"
              onClick={handleProfilePictureClick}
            >
              <img src={profilePicture} alt="Profile" />
              {isEditing && <div className="changeTextOverlay">Switch</div>}
            </BaseContainer>

            <BaseContainer className="details">
              <BaseContainer className="item">
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

              <BaseContainer className="item">
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
            <Button
              className="editButton"
              onClick={() => sendEdit()}
              disabled={!editedUsername || !editedPassword}
            >
              Save
            </Button>
          ) : (
            <div className="button-container">
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <Button className="delete-button" onClick={() => deleteUser()}>
                Delete Account
              </Button>
            </div>
          )}
        </div>

        <div className="invitations-container">
          <h1>Lobby invitations</h1>
          <ul className="list">
            {lobbyInvitations.map((invitation) => (
              <div
                key={invitation.creatorId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Invitation
                  creatorId={invitation.creatorId}
                  profilePicture={invitation.creatorIcon}
                  username={invitation.creatorUsername}
                  lobbyId={invitation.lobbyId}
                  func={answerLobbyInvitation}
                />
              </div>
            ))}
          </ul>
        </div>
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
