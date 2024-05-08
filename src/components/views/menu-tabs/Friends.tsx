import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { User } from "types";
import "styles/views/menu-tabs/Friends.scss";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    {/*<div className="player id">id: {user.id}</div>*/}
  </div>
);
  
const Friends = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>(null);
  const userId = localStorage.getItem("userId");
    
  useEffect(() => {
        
    async function fetchData() {
      try {
        const response = await api.get(`/users/${userId}/friends`);
        console.log("GET response: ", response);
    
        // Get the returned users and update the state.
        setUsers(response.data);

        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);
    
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${
            handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the friends! \
          See the console for details.");
      }
    }
    fetchData();}, []);
   
  let content = <Spinner />;
    
  if (users) {
    content = (
      <div className="friends">
        <ul className="user-list">
          {users.map((user: User) => (
            <li key={user.id}>
              <Player user={user} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
      
  return (
    <div className="friends">
      <BaseContainer className="container">
      </BaseContainer>
      {content} 
    </div>
  );
};

export default Friends;
