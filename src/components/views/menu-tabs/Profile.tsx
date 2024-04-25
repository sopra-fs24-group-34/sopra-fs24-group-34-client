import React, { useEffect, useState } from "react";
import { json, useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import "styles/views/menu-tabs/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { User } from "types";

const Profile = ({ user }: { user: User }) => {
  // nedim-j: rewrite to get token & id from menu
  const userToken = localStorage.getItem("userToken");
  const userId = localStorage.getItem("userId");

  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username);
  const [editedPassword, setEditedPassword] = useState(user.password);

  useEffect(() => {
    getUser();
  }, []);

  const sendEdit = async () => {
    setIsEditing(false);
    try {
      const requestBody = JSON.stringify({
        id: userId,
        username: editedUsername,
        password: editedPassword,
        token: userToken,
      });
      await api.put(`/users/${userId}`, requestBody);

      getUser();
    } catch (error) {
      setEditedUsername(user.username);
      alert(
        `Something went wrong during updating the profile: \n${handleError(error)}`
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

  return (
    <>
      <div className="profile">
        <div className="container">
          <BaseContainer className="picture">picture</BaseContainer>

          <BaseContainer className="details">
            <BaseContainer className="item" style={{ marginTop: "1em" }}>
              <div className="label">Username: </div>
              {isEditing ? (
                <input
                  className="input"
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
                  className="input"
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
          <Button className="editButton" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>
    </>
  );
};

export default Profile;
