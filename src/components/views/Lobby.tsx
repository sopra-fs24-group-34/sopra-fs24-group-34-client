import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import { User, Lobby } from "types";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    {/**nedim-j: add kick button? */}
  </div>
);

const LobbyPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const lobbyId = localStorage.getItem("lobbyId");
  const [users, setUsers] = useState<User[]>(null);
  //const [data, setData] = useState(""); //nedim-j: refresh page, WIP

  useEffect(() => {
    async function fetchData() {
      try {
        //nedim-j: will get network errors at the moment
        /*
        const settingsResponse = await api.get(`/lobbies/settings/${lobbyId}`);
        console.log(settingsResponse);

        const friendsResponse = await api.get(`/users/${userId}/friends`);
        console.log(friendsResponse);
        */

        const lobbiesResponse = await api.get("/lobbies/");
        console.log(lobbiesResponse);
        await new Promise((resolve) => setTimeout(resolve, 200));

        // nedim-j: Find the lobby with the desired ID in /lobbies
        // create proper endpoint
        const lobbiesArray = Object.values(lobbiesResponse.data);
        const lobbyIdAsNum = parseInt(lobbyId);
        const lobby = lobbiesArray.find(
          (lobby) => lobby.id === lobbyIdAsNum
        ) as Lobby;

        console.log(lobbiesArray);
        console.log(lobby);

        // nedim-j: get profile names for creator and invited player
        const creatorResponse = await api.get(`/users/${lobby.creator_userid}`);
        const creatorUser = creatorResponse.data;

        let invitedUser = null;
        if (lobby.invited_userid !== null) {
          const invitedResponse = await api.get(
            `/users/${lobby.invited_userid}`
          );
          invitedUser = invitedResponse.data;
        }

        const usersArray = [];
        usersArray.push(creatorUser);
        if (invitedUser !== null) {
          usersArray.push(invitedUser);
        }

        setUsers(usersArray);

      } catch (error) {
        console.error(
          `Something went wrong while fetching data: \n${handleError(error)}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching data! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  let players;

  if (users) {
    players = (
      <ul className="players list">
        {users.map((user: User) => (
          <li key={user.id}>
            <Player user={user} />
          </li>
        ))}
      </ul>
    );
  }

  function handleReturn() {
    localStorage.removeItem("lobbyId");
    //setData("New Data");
    navigate("/menu");
  }

  return (
    <BaseContainer className="lobby container">
      <BaseContainer className="view">
        <ul>
          <li>
            <BaseContainer className="settings">
              <h1>Settings</h1>
              <div>
                <p>Time per round:</p>
                <input
                  className="input"
                  type="text"
                  value="something"
                  onChange={(e) => e} //add function
                />
                <Button className="button" onClick={() => navigate("/lobby")}>
                  {/* add functionality */}
                  Reset settings
                </Button>
              </div>
            </BaseContainer>
          </li>
          <li>
            <BaseContainer className="main">
              <h2>Lobby ID:</h2>
              <BaseContainer className="code-container">
                <div className="code">{lobbyId}</div>
              </BaseContainer>
              <h2>Players</h2>
              <BaseContainer className="players">{players}</BaseContainer>
              <div className="button-row">
                <Button className="button" onClick={() => navigate("/game")}>
                  Start Game
                </Button>
                <Button
                  className="button"
                  style={{ marginBottom: "10px" }}
                  onClick={() => handleReturn()}
                >
                  Return to Menu
                </Button>
              </div>
            </BaseContainer>
          </li>
          <li>
            <BaseContainer className="friends-container">
              <h1>Friends</h1>
              <div className="friends"></div>
              <div className="username-adder">
                <input
                  className="input"
                  type="text"
                  value="Add by username"
                  onChange={(e) => e} //add function
                />
              </div>
            </BaseContainer>
          </li>
        </ul>
      </BaseContainer>
    </BaseContainer>
  );
};

export default LobbyPage;