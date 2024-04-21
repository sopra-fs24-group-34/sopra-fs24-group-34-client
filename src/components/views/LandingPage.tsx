import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/LandingPage.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { LoginLogo } from "../ui/LoginLogo";
import { RegisterLogo } from "../ui/RegisterLogo";

const FormField = (props) => {
  return (
    <div className="landingPage field">
      <label className="landingPage label">{props.label}</label>
      <input
        type={props.label === "Password" ? "password" : "text"}
        className="landingPage input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [lobbyCode, setLobbyCode] = useState(null);

  const doJoinLobby = async () => {
    try {
      const requestGuestBody = JSON.stringify({
        username: "Guest",
        password: "12345",
      });

      const responseCreateGuest = await api.post(
        "/guestuser/create",
        requestGuestBody
      );
      
      await api.put(
        `/lobbies/join/${lobbyCode}/${responseCreateGuest.data.id}`
      );

      localStorage.setItem("userToken", responseCreateGuest.data.token);
      localStorage.setItem("userId", responseCreateGuest.data.id);
      localStorage.setItem("lobbyId", lobbyCode);

      navigate("/lobby");
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const doLogin = () => {
    navigate("/login");
  };

  const doRegister = () => {
    navigate("/register");
  };

  return (
    <BaseContainer>
      <div className="landingPage container">
        <div className="landingPage form">
          <FormField
            label="Lobby Code"
            value={lobbyCode}
            onChange={(code) => setLobbyCode(code)}
          />
          <div className="landingPage button-container">
            <Button disabled={!lobbyCode} width="100%" onClick={doJoinLobby}>
              Join
            </Button>
          </div>
        </div>
        <div className="landingPage button-form">
          <div className="landingPage button-container">
            <Button
              style={{ marginRight: "10px" }}
              width="100%"
              onClick={doLogin}
            >
              Sign-In
              <span style={{ marginLeft: "10px" }}>
                <LoginLogo width="25px" height="25px" />
              </span>
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              width="100%"
              onClick={doRegister}
            >
              Register
              <span style={{ marginLeft: "10px" }}>
                <RegisterLogo width="24px" height="24px" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default LandingPage;
