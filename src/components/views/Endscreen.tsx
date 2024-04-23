import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Endscreen.scss";
import { User } from "types";
import { LogoutLogo } from "components/ui/LogoutLogo";

const Player = ({ user, result }: { user: User; result: string }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    <div className="player result">{result}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const Endscreen = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [gameResult, setGameResult] = useState<string>("won");
  const [isCreator, setIsCreator] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const creator = localStorage.getItem("isCreator");
        setIsCreator(JSON.parse(creator));

        const usersString = localStorage.getItem("users");
        if (usersString) {
          const usersArray: User[] = JSON.parse(usersString);
          setUsers(usersArray);
        }

        //nedim-j: need pusher & api call to determine who really won
        const randomResult = Math.random() < 0.5 ? "won" : "lost";
        setGameResult(randomResult);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);

  /*
  useEffect(() => {
    async function fetchUserData() {
      try {
        //nedim-j: set proper api call
        //const userId = localStorage.getItem("userId");
        //const response = await api.get(`/users/${userId}`);
        //nedim-j: where to get other users id from ?
        //setUsers(response.data);
        setUsers(localStorage.getItem("users"));
        console.log("USERS: ", users);

        //nedim-j: add api call
        setResult("You won");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);
  */

  let players = <Spinner />;

  /*
    if (users !== null && users !== undefined) {
      players = (
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
    }
    */
  if (users) {
    players = (
      <div className="players">
        <ul className="user-list">
          {users.map((user: User) => (
            <li key={user.id}>
              <Player user={user} result={gameResult} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const handleBack = (): void => {
    localStorage.removeItem("lobbyId");
    localStorage.removeItem("gameId");
    localStorage.removeItem("users");
    localStorage.removeItem("playerId");
    localStorage.removeItem("isCreator");
    //localStorage.removeItem("userTd");
    //nedim-j: add api call
  };

  function handleToRegister() {
    handleBack();
    throw new Error("Function not implemented.");
  }

  function handleToLobby() {
    localStorage.removeItem("gameId");
    navigate("/lobby")
  }

  return (
    <BaseContainer className="endscreen container">
      <header>
        <h1>You {gameResult}</h1>
      </header>
      <BaseContainer className="players">{players}</BaseContainer>
      <div className="buttonlist">
        <ul>
          <li>
            {!isCreator && (
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
            <Button
              className="buttons"
              onClick={() => {
                handleBack();
                navigate("/menu");
              }}
            >
              Return to Menu
              <span style={{ marginLeft: "10px" }}>
                <LogoutLogo width="25px" height="25px" />
              </span>
            </Button>
          </li>
        </ul>
      </div>

      <BaseContainer className="view"></BaseContainer>
    </BaseContainer>
  );
};

export default Endscreen;
