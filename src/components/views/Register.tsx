import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { RegisterLogo } from "../ui/RegisterLogo";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        type={props.label === "Password" ? "password" : "text"}
        className="login input"
        placeholder="Enter here.."
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

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/register", requestBody);

      // Store the token into the local storage.
      localStorage.setItem("userToken", response.data.token);
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("profilePicture", response.data.profilePicture);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/menu");
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const doBack = () => {
    navigate("/landingPage");
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div
          className="login form"
          onKeyDown={(e) => {
            if (e.key === "Enter" && username && password) {
              doRegister();
            }
          }}
        >
          <h1 className="login h1">Registration</h1>
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
        </div>
        <div className="login button-form">
          <div className="login button-container">
            <Button
              style={{ marginRight: "10px" }}
              width="100%"
              onClick={doBack}
            >
              Back
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              disabled={!username || !password}
              width="100%"
              onClick={() => doRegister()}
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
export default Register;
