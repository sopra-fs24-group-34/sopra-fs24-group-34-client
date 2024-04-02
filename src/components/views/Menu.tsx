import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Menu.scss";
import { User } from "types";
import Profile from "./menu-tabs/Profile";
import Leaderboard from "./menu-tabs/Leaderboard";
import Friends from "./menu-tabs/Friends";

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
    navigate("/login");
  };

  const createLobby = (): void => {
    navigate("/lobby");
  }

  return (
    <BaseContainer className="menu container">

        <div className="buttonbar">
          <Button style={{ flex: '8', marginRight: '1em' }} onClick={() => createLobby()}>
            Create new Lobby
          </Button>
          <Button style={{ flex: '2' }} onClick={() => logout()}>
            Logout
          </Button>
        </div>

        <nav className="menu navbar">
          <ul>
            <li className={activeTab === "profile" ? "active" : ""}><a href="#" onClick={() => handleTabChange("profile")}>Profile</a></li>
            <li className={activeTab === "leaderboard" ? "active" : ""}><a href="#" onClick={() => handleTabChange("leaderboard")}>Leaderboard</a></li>
            <li className={activeTab === "friends" ? "active" : ""}><a href="#" onClick={() => handleTabChange("friends")}>Friends</a></li>
          </ul>
        </nav>

      <BaseContainer className="view">
        {activeTab === "profile" && <Profile user={{
          id: 0,
          username: "",
          status: "",
          password: ""
        }} />}
        {activeTab === "leaderboard" && <Leaderboard />}
        {activeTab === "friends" && <Friends />}
      </BaseContainer>
      
    </BaseContainer>
  );
};

export default Menu;
