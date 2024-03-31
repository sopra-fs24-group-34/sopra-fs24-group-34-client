import React, { useEffect, useState } from "react";
import {json, useNavigate, useParams} from "react-router-dom";
import { api, handleError } from "helpers/api";
import "styles/views/menu-tabs/Profile.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { User } from "types";

const Player = ({ user }: { user: User }) => {
    const userToken = localStorage.getItem("token");
    const [isEditing, setIsEditing] = useState(false);
    const [editedUsername, setEditedUsername] = useState(user.username);

  
    const sendEdit = async () => {
      setIsEditing(false);
      try {
        const requestBody = JSON.stringify({ id:user.id, username: editedUsername, token: userToken });
        await api.put("/users", requestBody);
        const getUpdate = async () => {
          const response2 = await api.get(`/users/${user.id}`);
          console.log("GET response on Edit", response2);
          setEditedUsername(response2.data.username);
          
        }
        getUpdate();
  
      } catch (error) {
        setEditedUsername(user.username); // in case user not authorized to change or username taken
        alert(
          `Something went wrong during updating the profile: \n${handleError(error)}`
        );
      }
    };
  
    return(
      <div className="player container">
        <div className="player details">
          <div className="player label">Username:</div>
          {isEditing ? (
            <input className="profilepage input"
              type="text"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
            />
          ) : (
            <div className="player value">
              {editedUsername}
            </div>
            )}
          </div>
  
        <div className="player details">
          <div className="player label">Online Status:</div>
          <div className="player value">{user.status}</div>
        </div> 
  
          <div className="player details">
          {isEditing ? (
            <Button width="100%"
              onClick={() => 
              sendEdit()}>
              Save
            </Button>
          
          ) : (
            <Button width="100%"
              onClick={() => 
                setIsEditing(true)}>
              Edit
            </Button>
          )}
          </div>
      </div>
    
    );
  };

const Profile = () => {
  return (

    
    <>
    <h2>Profile Page</h2>
    <div className="profile">



          <BaseContainer className="picture">
              s
          </BaseContainer>

          <BaseContainer className="details">
              <div className="label">Username: </div>
              <BaseContainer className="item">
                 uname
              </BaseContainer>
              <div>Password: </div>
              <BaseContainer className="item">
                pass
              </BaseContainer>
          </BaseContainer>

      </div>
      </>
  );
};

export default Profile;