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

const FormField = (props) => {
  const initialValue = /^[0-9\b]+$/.test(props.value) ? props.value : "";

  return (
    <input
      type="text"
      className="buttonbar join input"
      placeholder="Enter Lobby code..."
      value={initialValue}
      onChange={(e) => {
        const re = /^[0-9\b]+$/; // regular expression to allow only numbers and backspace
        if (e.target.value === "" || re.test(e.target.value)) {
          props.onChange(e.target.value);
        }
      }}
    />
  );
};

FormField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Menu = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("leaderboard");
  const [loading, setLoading] = useState(false);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const logout = (): void => {
    setLoading(true);
    try {
      localStorage.clear();
      navigate("/landingPage");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Something went wrong during logout! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createLobby = async () => {
    setLoading(true);
    const userId = localStorage.getItem("userId");
    try {
      const response = await api.post(`/lobbies/create/${userId}`);
      localStorage.setItem("lobbyId", response.data);
      localStorage.setItem("lobbyId", response.data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(response);
      console.log(response);

      navigate("/lobby");
    } catch (error) {
      console.error(
        `Something went wrong while creating the lobby: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while creating the lobby! See the console for details."
      );
    } finally {
      setLoading(false);
    }
  }

  const [lobbyCode, setLobbyCode] = useState(null);
  async function doJoinLobby() {
    setLoading(true);

    try {

      const userId = localStorage.getItem("userId");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await api.put(`/lobbies/join/${lobbyCode}/${userId}`);

      localStorage.setItem("lobbyId", lobbyCode);

      navigate("/lobby");
    } catch (error) {
      alert(
        `Something went wrong during the lobby join: \n${handleError(error)}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <BaseContainer className="menu container">
      {loading && <Spinner />}
      <div className="buttonbar">
        <Button className="createLobby" onClick={() => createLobby()}
          disabled={loading}>
          {loading ? <Spinner /> : "Create new Lobby"}
        </Button>

        <div
          className="buttonbar join"
          onKeyDown={(e) => {
            if (e.key === "Enter" && lobbyCode) {
              doJoinLobby();
            }
          }}
        >
          <FormField
            className="buttonbar join input"
            label="Lobby Code"
            value={lobbyCode}
            onChange={(code) => setLobbyCode(code)}
          />
          <Button
            className="buttonbar join join-button"
            disabled={!lobbyCode || loading}
            onClick={doJoinLobby}
          >
            {loading ? <Spinner /> : "Join"}
          </Button>
        </div>

        <Button className="buttonbar logout" onClick={() => logout()}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Logout"}
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
              password: "",
              status: "",
              totalwins: 0,
              totalplayed: 0,
              profilePicture: "",
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
