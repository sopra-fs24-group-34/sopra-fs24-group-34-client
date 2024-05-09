import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import { User, Lobby } from "types";
import LobbyGameExplanation from "./LobbyGameExplanation";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
  </div>
);

const LobbyPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(null);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [playersInLobby, setPlayers] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [userStatus, setUserStatus] = useState("INLOBBY_PREPARING");

  useEffect(() => {
    async function ws() {
      const userId = localStorage.getItem("userId");
      const lobbyId = localStorage.getItem("lobbyId");

      if (userId && lobbyId) {
        fetchData(userId, lobbyId);

        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);
        setStompClient(stompClient);

        await stompClient.connect({}, () => {
          console.log("Connected to WebSocket");
        });

        await new Promise((resolve) => setTimeout(resolve, 500));
        await stompClient.subscribe(`/lobbies/${lobbyId}`, (message) => {
          const body = JSON.parse(message.body);
          const header = body["event-type"];
          const data = body.data;
          console.log("Header: ", header);
          if (header === "user-joined") {
            console.log("Invited User: ", data);
            setUsers((prevUsers) => [...prevUsers, data]);
          } else if (header === "game-started") {
            const pId = localStorage.getItem("playerId");
            if (parseInt(pId) !== data.creatorId) {
              localStorage.setItem("gameId", data.gameId);
              localStorage.setItem("playerId", data.invitedPlayerId);
              navigate("/game"); // Redirect to game page
            }
          } else if (header === "user-statusUpdate") {
            setUsers((prevUsers) => {
              const updatedUsers = [...prevUsers];
              const index = updatedUsers.findIndex(
                (user) => user.id === data.id
              ); // Assuming each user has a unique id
              if (index !== -1) {
                updatedUsers[index] = data; // Replace the existing user with the updated data
              }
              return updatedUsers;
            });
          }
        });
      }

      return () => {
        disconnectWebsocket();
      };
    }

    ws();
  }, []);

  function disconnectWebsocket() {
    console.log("LEFT Lobby PAGE i hope");
    if (stompClient !== null) {
      stompClient.disconnect();
      setStompClient(null);
    }
  }

  async function fetchData(userId, lobbyId) {
    try {
      //nedim-j: will get network errors at the moment
      /*
        const settingsResponse = await api.get(`/lobbies/settings/${lobbyId}`);
        console.log(settingsResponse);

        const friendsResponse = await api.get(`/users/${userId}/friends`);
        console.log(friendsResponse);
        */

      await new Promise((resolve) => setTimeout(resolve, 200));
      console.log("LobbyId: ", lobbyId);
      const lobbyResponse = (await api.get(`/lobbies/${lobbyId}`)).data;
      console.log("Lobby: ", lobbyResponse);

      // nedim-j: get profile names for creator and invited player
      const creatorResponse = await api.get(
        `/users/${lobbyResponse.creator_userid}`
      );
      const creatorUser = creatorResponse.data;
      console.log("Creator User: ", creatorUser);
      setUserStatus(creatorUser.status);

      //nedim-j: find better solution for checking if one is the host
      if (parseInt(userId) === creatorUser.id) {
        setIsCreator(true);
        localStorage.setItem("isCreator", JSON.stringify(true));
      } else {
        localStorage.setItem("isCreator", JSON.stringify(false));
      }

      let invitedUser = null;
      if (lobbyResponse.invited_userid !== null) {
        const invitedResponse = await api.get(
          `/users/${lobbyResponse.invited_userid}`
        );
        invitedUser = invitedResponse.data;
      }

      const initialUsers = [creatorUser];
      if (invitedUser !== null) {
        initialUsers.push(invitedUser);
      }

      setUsers(initialUsers);
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

  //Set players to render
  useEffect(() => {
    async function loadPlayers() {
      if (users !== null && users !== undefined) {
        console.log("USEEEEEEERS: ", users);
        localStorage.setItem("users", JSON.stringify(users));
        const playersComponent = (
          <ul className="players list">
            {users.map(
              (user: User) =>
                user &&
                user.id !== undefined &&
                user.username !== undefined && (
                  <li key={user.id}>
                    <Player user={user} />
                  </li>
                )
            )}
          </ul>
        );
        setPlayers(playersComponent);
      }
    }
    loadPlayers();
  }, [users]);

  async function handleReturn() {
    const lobbyId = localStorage.getItem("lobbyId");

    async function closeLobby() {
      try {
        let userCreator = null;
        let userInvited = null;

        if (users && users.length > 0) {
          userCreator = users[0];
          if (users.length > 1) {
            userInvited = users[1];
          }
        }

        const requestDelete = JSON.stringify({
          id: parseInt(lobbyId),
          user_creator: userCreator,
          user_invited: userInvited,
        });
        //console.log("REQUEST DELETE: ", requestDelete);
        //await api.delete(`/lobbies/${lobbyId}/start`, requestDelete); //nedim-j: make correct endpoint. seems to require a body atm

        disconnectWebsocket();
      } catch (error) {
        console.error(
          `Something went wrong while fetching data: \n${handleError(error)}`
        );
      }
    }

    //nedim-j: again, find better solution for checking if one is the host
    if (isCreator) {
      closeLobby();
      localStorage.removeItem("lobbyId");
      navigate("/menu");
    } else {
      //nedim-j: probably delete call to users?
      localStorage.removeItem("lobbyId");
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      navigate("/landingPage");
    }
  }

  async function handleStart() {
    const lobbyId = localStorage.getItem("lobbyId");
    const userId = localStorage.getItem("userId");
    const userToken = localStorage.getItem("userToken");

    try {
      //nedim-j: add ready status to if clause
      if (users && users.length === 2) {
        handleReady("INLOBBY_READY");
        const lobby = await api.get(`/lobbies/${lobbyId}/`);

        const gamePostDto = {
          creator_userid: lobby.data.creator_userid,
          invited_userid: lobby.data.invited_userid,
        };
        const auth = {
          id: userId,
          token: userToken,
        };

        const requestBody = JSON.stringify({
          gamePostDTO: gamePostDto,
          authenticationDTO: auth,
        });

        const response = await api.post(`/game/${lobbyId}/start`, requestBody);
        localStorage.setItem("gameId", response.data.gameId);
        localStorage.setItem("playerId", response.data.creatorPlayerId);
        console.log("RESPONSE GAME: ", response);

        disconnectWebsocket();

        navigate("/game");
      }
    } catch (error) {
      console.error(
        `Something went wrong while starting game: \n${handleError(error)}`
      );
    }
  }

  async function handleReady(readyStatus: string) {
    /**nedim-j: implement */
    const lobbyId = localStorage.getItem("lobbyId");
    const userId = localStorage.getItem("userId");
    const userToken = localStorage.getItem("userToken");

    try {
      const request = JSON.stringify({
        readyStatus: readyStatus,
        lobbyId: lobbyId,
        userId: userId,
      });

      stompClient.send("/app/updateReadyStatus", {}, request);
    } catch (error) {
      alert(`Something went wrong with ready-status: \n${handleError(error)}`);
    }
  }

  function renderActionButtons() {
    if (isCreator && users) {
      const currentUserId = localStorage.getItem("userId");
      //const storedUsers = JSON.parse(localStorage.getItem("users"));

      if(users) {}
      const invitedUser = users.find(
        (user) => user.id !== parseInt(currentUserId)
      );

      if (invitedUser && invitedUser.status === "INLOBBY_READY") {
        return (
          <Button className="lobby button" onClick={() => handleStart()}>
            Start Game
          </Button>
        );
      } else {
        return (
          <Button className="lobby button" disabled>
            Waiting for opponent
          </Button>
        );
      }
    } else {
      let buttonText;
      let newStatus;

      if (userStatus === "INLOBBY_PREPARING") {
        buttonText = "Ready";
        newStatus = "INLOBBY_READY";
      } else if (userStatus === "INLOBBY_READY") {
        buttonText = "Not ready";
        newStatus = "INLOBBY_PREPARING";
      }

      return (
        <Button
          className="lobby button"
          onClick={() => {
            setUserStatus(newStatus);
            handleReady(newStatus);
          }}
        >
          {buttonText}
        </Button>
      );
    }
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
                  readOnly={!isCreator}
                  onChange={(e) => e} //add function
                />
                {isCreator && (
                  <Button
                    className="lobby button"
                    onClick={() => navigate("/lobby")}
                  >
                    {/**add functionality */}
                    Reset settings
                  </Button>
                )}
                <Button
                  className="lobby button"
                  onClick={() => setShowExplanation(true)}
                >
                  View Game Explanation
                </Button>
              </div>
            </BaseContainer>
          </li>
          <li>
            <BaseContainer className="main">
              <h2>Lobby ID:</h2>
              <BaseContainer className="code-container">
                <div className="code">
                  {/*lobbyId*/ localStorage.getItem("lobbyId")}
                </div>
              </BaseContainer>
              <h2>Players</h2>
              <BaseContainer className="players">
                {playersInLobby}
              </BaseContainer>
              <div className="button-row">
                {renderActionButtons()}
                <Button
                  className="lobby button bottom"
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
                  readOnly={!isCreator}
                  onChange={(e) => e} //add function
                />
              </div>
            </BaseContainer>
          </li>
        </ul>
      </BaseContainer>
      {showExplanation && (
        <div className="popup-overlay">
          <div className="popup">
            <span className="close" onClick={() => setShowExplanation(false)}>
              &times;
            </span>
            <LobbyGameExplanation />
          </div>
        </div>
      )}
    </BaseContainer>
  );
};

export default LobbyPage;
