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

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    <div className="player id">id: {user.id}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const Endscreen = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const usersString = localStorage.getItem("users");
        if (usersString) {
          const usersArray: User[] = JSON.parse(usersString);
          setUsers(usersArray);
        }
        setResult("You won");
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
              <Player user={user} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const logout = (): void => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userTd");
    navigate("/landingPage");
  };

  function handleRegister() {
    throw new Error("Function not implemented.");
  }

  return (
    <BaseContainer className="endscreen container">
      <header>
        <h1>{result}</h1>
      </header>
      <BaseContainer className="players">{players}</BaseContainer>
      <div className="buttonlist">
        <ul>
          <li>
            <Button className="buttons" onClick={() => handleRegister()}>
              Register
              <span style={{ marginLeft: "10px" }}>
                <LogoutLogo width="25px" height="25px" />
              </span>
            </Button>
          </li>
          <li>
            <Button className="buttons" onClick={() => logout()}>
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
