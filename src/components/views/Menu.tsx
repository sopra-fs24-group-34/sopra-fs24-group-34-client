import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Menu.scss";
import { User } from "types";
import Profile from "./menu-tabs/Profile";
import Leaderboard from "./menu-tabs/Leaderboard";
import Friends from "./menu-tabs/Friends";
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

const Menu = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("leaderboard");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    navigate("/landingPage");
  };

  const createLobby = (): void => {
    async function makeRequest() {
      try {
        const response = await api.post("/lobbies/create"); //nedim-j: define exact endpoint & need of body with backend

        await new Promise((resolve) => setTimeout(resolve, 200));

        localStorage.setItem("lobbyId", response.data);

        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while creating the lobby: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while creating the lobby! See the console for details."
        );
      }
    }

    makeRequest();

    navigate("/lobby");
  };

  return (
    <BaseContainer className="menu container">
      <div className="buttonbar">
        <Button
          style={{ flex: "8", marginRight: "1em" }}
          onClick={() => createLobby()}
        >
          Create new Lobby
        </Button>
        <Button style={{ flex: "2" }} onClick={() => logout()}>
          Logout
          <span style={{ marginLeft: "10px" }}>
            <LogoutLogo width="25px" height="25px" />
          </span>
        </Button>
      </div>
      <nav className="menu navbar">
        <ul>
          <li className={activeTab === "profile" ? "active" : ""}>
            <a href="#" onClick={() => handleTabChange("profile")}>
              Profile
            </a>
          </li>
          <li className={activeTab === "leaderboard" ? "active" : ""}>
            <a href="#" onClick={() => handleTabChange("leaderboard")}>
              Leaderboard
            </a>
          </li>
          <li className={activeTab === "friends" ? "active" : ""}>
            <a href="#" onClick={() => handleTabChange("friends")}>
              Friends
            </a>
          </li>
        </ul>
      </nav>
      <BaseContainer className="view">
        {activeTab === "profile" && (
          <Profile
            user={{
              id: 0,
              username: "",
              status: "",
              password: "",
            }}
          />
        )}
        {activeTab === "leaderboard" && <Leaderboard />}
        {activeTab === "friends" && <Friends />}
      </BaseContainer>
    </BaseContainer>
  );
};

export default Menu;
