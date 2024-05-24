import React, { useEffect, useState } from "react";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Endscreen.scss";
import { User } from "types";
import { LogoutLogo } from "components/ui/LogoutLogo";
import { disconnectWebSocket, getStompClient } from "./WebSocketService";
import { closeLobby } from "./Lobby";
import { changeStatus } from "./Menu";
import { doHandleError } from "../../helpers/errorHandler";
import { toastContainerError } from "./Toasts/ToastContainerError";

const Player = ({
  user,
  result,
  isCurrentUser,
}: {
  user: User;
  result: string;
  isCurrentUser: boolean;
}) => {
  let resultClass = "";
  if (isCurrentUser) {
    resultClass = result;
  } else {
    if (result === "tie") {
      resultClass = "tie"
    } else {
      resultClass = result === "won" ? "lost" : "won";
    }
  }

  return (
    <div className="player container">
      <div className="player username">{user.username}</div>
      <div className={`player result ${resultClass}`}>
        {resultClass.toUpperCase()}
      </div>
    </div>
  );
};

Player.propTypes = {
  user: PropTypes.object,
  result: PropTypes.string.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
};

const Endscreen = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [gameResult, setGameResult] = useState<string>("won");
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const creator = localStorage.getItem("isCreator");
        const userId = localStorage.getItem("userId");
        setIsCreator(JSON.parse(creator));

        const usersString = localStorage.getItem("users");
        if (usersString) {
          const usersArray: User[] = JSON.parse(usersString);
          const guestUser = usersArray.find(user => user.id === Number(userId) && user.username.startsWith("Guest"));
          setIsGuest(!!guestUser);
          setUsers(usersArray);
        }

        setGameResult(localStorage.getItem("result"));
      } catch (error) {
        toast.error(doHandleError(error));
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();

    setStompClient(getStompClient());

    return () => {
      if (stompClient) {
        disconnectWebSocket();
      }
    };
  }, []);

  let players = <Spinner />;

  if (users) {
    players = (
      <div className="players">
        <ul className="user-list">
          {users.map((user: User) => (
            <li key={user.id}>
              <Player
                user={user}
                result={gameResult}
                isCurrentUser={
                  user.id === Number(localStorage.getItem("userId"))
                }
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function handleBack() {
    closeLobby();
    localStorage.removeItem("lobbyId");
    localStorage.removeItem("gameId");
    localStorage.removeItem("users");
    localStorage.removeItem("playerId");
    localStorage.removeItem("isCreator");
    localStorage.removeItem("result");
    localStorage.removeItem("maxStrikes");
    localStorage.removeItem("timePerRound");
    localStorage.removeItem("selectedCharacter");
    disconnectWebSocket();
  };

  function handleToRegister() {
    disconnectWebSocket();
    navigate("/register");
  }

  function handleToMenu() {
    handleBack();
    navigate("/menu");
  }

  function handleToLandingPage() {
    localStorage.clear();
    disconnectWebSocket();
    navigate("/landingPage");
  }

  function handleToLobby() {
    changeStatus("INLOBBY_PREPARING");
    localStorage.removeItem("gameId");
    localStorage.removeItem("users");
    localStorage.removeItem("playerId");
    localStorage.removeItem("isCreator");
    localStorage.removeItem("result");
    localStorage.removeItem("maxStrikes");
    localStorage.removeItem("timePerRound");
    localStorage.removeItem("selectedCharacter");
    navigate("/lobby");
  }

  return (
    <BaseContainer className="endscreen container">
      <header>
        <div className="gameresult">You {gameResult}</div>
      </header>
      <BaseContainer className="players">{players}</BaseContainer>
      <div className="buttonlist">
        <ul>
          <li>
            {!isCreator && isGuest && (
              <Button className="buttons" onClick={() => handleToRegister()}>
                Register
                <span style={{ marginLeft: "10px" }}>
                  <LogoutLogo width="25px" height="25px" />
                </span>
              </Button>
            )}
          </li>
          <li>
            <Button className="buttons" onClick={() => handleToLobby()}>
              Back to Lobby
              <span style={{ marginLeft: "10px" }}>
                <LogoutLogo width="25px" height="25px" />
              </span>
            </Button>
          </li>
          <li>
            {isCreator || !isGuest ? (
              <Button className="buttons" onClick={() => handleToMenu()}>
                Return to Menu
                <span style={{ marginLeft: "10px" }}>
                  <LogoutLogo width="25px" height="25px" />
                </span>
              </Button>
            ) : (
              <Button className="buttons" onClick={() => handleToLandingPage()}>
                Return to Landing Page
                <span style={{ marginLeft: "10px" }}>
                  <LogoutLogo width="25px" height="25px" />
                </span>
              </Button>
            )}
          </li>
        </ul>
      </div>

      <BaseContainer className="view"></BaseContainer>
      <ToastContainer {...toastContainerError}/>
    </BaseContainer>
  );
};

export default Endscreen;
