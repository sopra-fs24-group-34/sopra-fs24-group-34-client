import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import { User } from "types";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    {/*<div className="player id">id: {user.id}</div>*/}
  </div>
);

const Lobby = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const lobbyId = localStorage.getItem("lobbyId");
  const [users, setUsers] = useState<User[]>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        //nedim-j: will get network errors at the moment
        /*
        const lobbyResponse = await api.post(`/lobbies/join/${lobbyId}`);
        //console.log(lobbyResponse);

        const settingsResponse = await api.get(`/lobbies/settings/${lobbyId}`);
        console.log(settingsResponse);

        const friendsResponse = await api.get(`/users/${userId}/friends`);
        console.log(friendsResponse);
        */
        await new Promise((resolve) => setTimeout(resolve, 200));

        //setUsers(lobbyResponse.data);
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

  //nedim-j: continue adding player containers
  let content;

  if (users) {
    content = (
      <div className="lobby">
        <ul className="lobby user-list">
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
              <h2>Lobby code:</h2>
              <BaseContainer className="code-container">
                123-456-789
              </BaseContainer>
              <h2>Players</h2>
              <BaseContainer className="players"></BaseContainer>
              <div className="button-row">
                <Button className="button" onClick={() => navigate("/game")}>
                  Start Game
                </Button>
                <Button
                  className="button"
                  style={{ marginBottom: "10px" }}
                  onClick={() => navigate("/menu")}
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

export default Lobby;
