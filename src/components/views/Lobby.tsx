import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import {
  cancelSubscription,
  connectWebSocket,
  disconnectWebSocket,
  getStompClient,
  makeSubscription,
  sendMessage,
  waitForConnection,
} from "./WebSocketService";
import { toastContainerSuccess } from "./Toasts/ToastContainerSuccess";
import { toastContainerError } from "./Toasts/ToastContainerError";
import { doHandleError } from "helpers/errorHandler";
import { changeStatus } from "./Menu";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
  </div>
);

const Friend = ({ key, profilePicture, username, func }) => (
  <div
    key={key}
    style={{
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "center",
    }}
  >
    <div className="friend-container">
      <BaseContainer className="friend-picture">
        <img src={profilePicture} alt="Profile" />
      </BaseContainer>
      <div className="friend-value">{username}</div>
    </div>
    <Button
      style={{ backgroundColor: "green", marginBottom: "15px" }}
      onClick={() => {
        func(username);
      }}
    >
      Invite
    </Button>
  </div>
);

Friend.propTypes = {
  key: PropTypes.num,
  profilePicture: PropTypes.string,
  username: PropTypes.string,
  func: PropTypes.func,
};

const LobbyPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [playersInLobby, setPlayers] = useState(null);
  const [invitableFriends, setInvitableFriends] = useState([]);
  const [invitedFriend, setInvitedFriend] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [userStatus, setUserStatus] = useState("INLOBBY_PREPARING");
  const [maxStrikes, setMaxStrikes] = useState(3);
  const userId = localStorage.getItem("userId");
  const lobbyId = localStorage.getItem("lobbyId");

  useEffect(() => {
    async function ws() {
      if (userId && lobbyId && (isCreator === true || isCreator === false)) {
        await fetchData();
        const stompClient = await connectWebSocket();

        const callback = function (message) {
          const body = JSON.parse(message.body);
          const header = body["event-type"];
          const data = body.data;
          console.log("Header: ", header);

          if (header === "user-joined") {
            console.log("Invited User: ", data);
            setUsers((prevUsers) => [...prevUsers, data]);
          } else if (header === "game-started") {
            localStorage.setItem("gameId", data.gameId);
            //nedim-j: should be fine? small limitation, but the following requests require authentication header anyway
            const isCr = JSON.parse(localStorage.getItem("isCreator"));

            if (isCr === true) {
              localStorage.setItem("playerId", data.creatorPlayerId);
            } else if (isCr === false) {
              localStorage.setItem("playerId", data.invitedPlayerId);
            }

            localStorage.setItem("maxStrikes", data.maxStrikes);

            cancelSubscription(`/lobbies/${lobbyId}`, subscription);
            navigate("/pregame");

          } else if (header === "user-left") {
            console.log("User left: ", data.id);
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.id !== data.id)
            );
          } else if (header === "user-statusUpdate") {
            setUsers((prevUsers) => {
              const updatedUsers = [...prevUsers];
              const index = updatedUsers.findIndex(
                (user) => user.id === data.id
              );
              if (index !== -1) {
                updatedUsers[index] = data;
              }

              return updatedUsers;
            });
          } else if (header === "lobby-closed") {
            console.log(data);
            handleReturn();
          } else {
            console.log("Unknown message from WS");
          }
        };

        const subscription = await makeSubscription(
          `/lobbies/${lobbyId}`,
          callback
        );
      }
    }

    ws();
  }, []);

  async function fetchData() {
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
        setIsCreator(false);
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
      navigate("/menu");
      toast.error(doHandleError(error), { containerId: "2" });
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

    const fetchInvitableFriends = async () => {
      try {
        const response = await api.get(`users/${userId}/friends/online`);
        console.log("GET friends: ", response);
        setInvitableFriends(response.data);
      } catch (error) {
        toast.error(doHandleError(error), { containerId: "2" });
      }
    };
    loadPlayers();
    fetchInvitableFriends();
  }, [users]);

  async function handleReturn() {
    if (isCreator) {
      const lobbyId = localStorage.getItem("lobbyId");
      if (lobbyId !== null || lobbyId !== undefined) {
        closeLobby();
      }
      localStorage.removeItem("lobbyId");
      localStorage.removeItem("isCreator");
      localStorage.removeItem("users");
      await changeStatus("online");
      disconnectWebSocket();
      navigate("/menu");
    } else {
      //nedim-j: probably delete call to users?
      localStorage.clear();
      disconnectWebSocket();
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
          maxStrikes: maxStrikes,
        };
        const auth = {
          id: userId,
          token: userToken,
        };

        const requestBody = JSON.stringify({
          lobbyId: lobbyId,
          gamePostDTO: gamePostDto,
          authenticationDTO: auth,
        });

        //await stompClient.send("/app/startGame", {}, requestBody);
        sendMessage("/app/startGame", requestBody);
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
      const requestBody = JSON.stringify({
        readyStatus: readyStatus,
        lobbyId: lobbyId,
        userId: userId,
      });

      //stompClient.send("/app/updateReadyStatus", {}, request);
      sendMessage("/app/updateReadyStatus", requestBody);
      toast.info("Ready status updated successfully!", { containerId: "1" });
    } catch (error) {
      toast.error(doHandleError(error), { containerId: "2" });
    }
  }

  function renderActionButtons() {
    if (isCreator && users) {
      const currentUserId = localStorage.getItem("userId");

      const invitedUser = users.find(
        (user) => user.id !== parseInt(currentUserId)
      );

      if (invitedUser && invitedUser.status === "INLOBBY_READY") {
        return (
          <Button
            className="lobby button"
            disabled={
              !(
                0 < Number(maxStrikes) &&
                Number(maxStrikes) < 11
              )
            }
            onClick={() => handleStart()}
          >
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

      if (userStatus === "INLOBBY_PREPARING" || userStatus === "ONLINE") {
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

  const inviteFriend = async (userName) => {
    try {
      const requestBody = JSON.stringify({
        creatorId: userId,
        invitedUserName: userName,
        lobbyId: lobbyId,
      });

      console.log("Request body: ", requestBody);
      await api.post("lobbies/invite", requestBody);

      toast.info("Friend invited successfully!", { containerId: "1" });
    } catch (error) {
      toast.error(doHandleError(error), { containerId: "2" });
    }
  };

  return (
    <BaseContainer className="lobby container">
      <div className="view">
        <ToastContainer containerId="1" {...toastContainerSuccess} />
        <ToastContainer containerId="2" {...toastContainerError} />
        <ul>
          <li>
            <BaseContainer className="settings">
              <h1>Settings</h1>
              <div>
                <p>Number of Strikes (1 - 10):</p>
                <input
                  className="input"
                  type="number"
                  min="1"
                  max="10"
                  value={maxStrikes}
                  readOnly={!isCreator}
                  onChange={(e) => setMaxStrikes(e.target.value)} //add function
                />
                {isCreator && (
                  <Button
                    className="lobby button"
                    onClick={() => {
                      setMaxStrikes(3);
                    }}
                  >
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
              <h1>Lobby ID:</h1>
              <BaseContainer className="code-container">
                <div className="code">
                  {/*lobbyId*/ localStorage.getItem("lobbyId")}
                </div>
              </BaseContainer>
              <h1>Players</h1>
              <BaseContainer className="players">
                {playersInLobby}
              </BaseContainer>
              <div className="button-row">
                {renderActionButtons()}
                <Button className="lobby button" onClick={() => handleReturn()}>
                  Return to Menu
                </Button>
              </div>
            </BaseContainer>
          </li>
          <li>
            <BaseContainer className="friends-container">
              <h1>Invitable Friends</h1>
              <ul className="list">
                {invitableFriends.map((friend) => (
                  <Friend
                    key={friend.friendId}
                    profilePicture={friend.friendIcon}
                    username={friend.friendUsername}
                    func={inviteFriend}
                  />
                ))}
              </ul>
            </BaseContainer>
          </li>
        </ul>
      </div>
      {showExplanation && (
        <LobbyGameExplanation func={() => setShowExplanation()} />
      )}
    </BaseContainer>
  );
};

export async function closeLobby() {
  const lobbyId = localStorage.getItem("lobbyId");
  const userId = localStorage.getItem("userId");
  const userToken = localStorage.getItem("userToken");

  try {
    const requestBody = JSON.stringify({
      lobbyId: lobbyId,
      authenticationDTO: {
        id: userId,
        token: userToken,
      },
    });

    //stompClient.send("/app/closeLobby", {}, requestBody);
    sendMessage("/app/closeLobby", requestBody);
  } catch (error) {
    console.error(
      `Something went wrong while closing lobby: \n${handleError(error)}`
    );
  }
}

export default LobbyPage;
