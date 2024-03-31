import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/LandingPage.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {LoginLogo} from "../ui/LoginLogo";
import {LogoutLogo} from "../ui/LogoutLogo";
import {RegisterLogo} from "../ui/RegisterLogo";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        type={props.label === "Password" ? "password" : "text"}
        className="login input"
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
      const requestBody = JSON.stringify({ lobbyCode });
      const response = await api.post("/something", requestBody); // must be defined

      // Store the token into the local storage.
      localStorage.setItem("token", response.token);
      localStorage.setItem("id", response.id);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
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
      <div className="login container">
        <div className="login form">
          <FormField
            label="Lobby Code"
            value={lobbyCode}
            onChange={(code) => setLobbyCode(code)}
          />
          <div className="login button-container">
          <Button
              disabled={!lobbyCode}
              width="100%"
              onClick={doJoinLobby}
            >
              Join
            </Button>
          </div>
        </div>
        <div className="login button-form">
          <div className="login button-container">
          <Button
              width="100%"
              onClick={doLogin}
            >
              Login  
              <span ><LoginLogo left-margin="40px" width="24px" height="24px"/></span>
            </Button>
            <Button
              width="100%"
              onClick={doRegister}
            >
              Register
              <span ><LoginLogo left-margin="40px" width="24px" height="24px"/></span>
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
