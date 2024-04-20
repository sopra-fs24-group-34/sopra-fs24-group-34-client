import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import { User, Lobby } from "types";
import PusherService from "./PusherService";

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
  const pusherService = new PusherService();

  useEffect(() => {
    const userId = localStorage.getItem("id");
    const lobbyId = localStorage.getItem("lobbyId");

    if (userId && lobbyId) {
      fetchData(userId, lobbyId);
      pusherService.subscribeToChannel(
        "lobby-events",
        "user-joined",
        (data: any) => {
          setUsers((prevUsers) => [...prevUsers, data]);
        }
      );
      console.log("Users after subscription: ", users);
    }

    return () => {
      pusherService.unsubscribeFromChannel("lobby-events");
    };
  }, []);

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
      console.log("Creator User: ", creatorResponse);

      //nedim-j: find better solution for checking if one is the host
      if (parseInt(userId) === creatorUser.id) {
        setIsCreator(true);
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
    if (users !== null && users !== undefined) {
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
  }, [users]);

  function handleReturn() {
    pusherService.unsubscribeFromChannel("lobby-events");
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

  function handleStart() {
    const lobbyId = localStorage.getItem("lobbyId");
    async function startGame() {
      try {
        let userCreator = null;
        let userInvited = null;

        if (users && users.length > 0) {
          userCreator = users[0];
          if (users.length > 1) {
            userInvited = users[1];
          }
        }
        const requestStart = JSON.stringify({
          id: parseInt(lobbyId),
          user_creator: userCreator,
          user_invited: userInvited,
        });
        //console.log("REQUEST START: ", requestStart);
        //await api.delete(`/lobbies/${lobbyId}/start`, requestStart);
        //nedim-j: need to check if function in backend is correct.
        //maybe other endpoint better suited, maybe post "/lobbies/{lobbyId}/startgame"
        navigate("/game");
      } catch (error) {
        console.error(
          `Something went wrong while starting game: \n${handleError(error)}`
        );
      }
    }
    startGame();
  }

  function handleReady() {
    /**nedim-j: implement */
  }

  function renderActionButtons() {
    if (isCreator) {
      return (
        <Button className="lobby button" onClick={() => handleStart()}>
          Start Game
        </Button>
      );
    } else {
      return (
        <Button className="lobby button" onClick={() => handleReady()}>
          Ready
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
    </BaseContainer>
  );
};

export default LobbyPage;
