import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import { User } from "types";

const Lobby = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const lobbyId = localStorage.getItem("lobbyId");

  useEffect(() => {
    async function fetchData() {
      try {
        //nedim-j: probably other approach needed, consider LobbyController in backend
        const lobbyResponse = await api.post(`/lobbies/join/${lobbyId}`);
        console.log(lobbyResponse);

        const settingsResponse = await api.get(`/lobbies/settings/${lobbyId}`);
        console.log(settingsResponse);

        const friendsResponse = await api.get(`/users/${userId}/friends`);
        console.log(friendsResponse);

        await new Promise((resolve) => setTimeout(resolve, 200));

      } catch (error) {
        console.error(
          `Something went wrong while fetching data: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching data! See the console for details."
        );
      }
    }

    //fetchData();
  }, []);

  return (
    <BaseContainer className="lobby container">
      <BaseContainer className="view">
        <ul>
          <li>
            <BaseContainer className="settings">Settings</BaseContainer>
          </li>
          <li>
            <BaseContainer className="main">
              <div className="lobby-code">Code</div>
              <div className="players">Players</div>
              <div className="button-row">
                Buttons
                <Button
                  style={{ marginTop: "10px" }}
                  onClick={() => navigate("/game")}
                >
                  Start Game
                </Button>
                <Button
                  style={{ marginTop: "10px" }}
                  onClick={() => navigate("/menu")}
                >
                  Return to Menu
                </Button>
              </div>
            </BaseContainer>
          </li>
          <li>
            <BaseContainer className="friends-container">
              <div className="friends">Friends</div>
              <div className="username-adder">Add by Username</div>
            </BaseContainer>
          </li>
        </ul>
      </BaseContainer>
    </BaseContainer>
  );
};

export default Lobby;
