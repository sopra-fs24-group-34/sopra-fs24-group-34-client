import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { LoginLogo } from "../ui/LoginLogo";
import { Spinner } from "../ui/Spinner";
import { doHandleError } from "../../helpers/errorHandler";
import { toastContainerError } from "./Toasts/ToastContainerError";

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

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    try {
      setLoading(true);
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/login", requestBody);
      console.log("Profile: ", response);

      // Store the token into the local storage.
      localStorage.setItem("userToken", response.data.token);
      localStorage.setItem("userId", response.data.id);

      // Login successfully worked --> navigate to the route /menu in the MenuRouter
      navigate("/menu");
    } catch (error) {
      if (error.response.status === 401) {
        toast.error("Username or password is incorrect. Please try again.");
      } else {
        toast.error(doHandleError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const doBack = () => {
    navigate("/landingPage");
  };

  return (
    <BaseContainer>
      <ToastContainer {...toastContainerError} />
      <div className="login container">
        <div
          className="login form"
          onKeyDown={(e) => {
            if (e.key === "Enter" && username && password) {
              doLogin();
            }
          }}
        >
          <h1 className="login h1">Login</h1>
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
              style={{ marginRight: "10px", width: "100%" }}
              onClick={doBack}
            >
              Back
            </Button>
            {loading ? (
              <Spinner />
            ) : (
              <Button
                style={{ marginLeft: "10px", width: "100%" }}
                disabled={!username || !password}
                onClick={() => doLogin()}
              >
                Sign-In
                <span style={{ marginLeft: "10px" }}>
                  <LoginLogo width="25px" height="25px" />
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
