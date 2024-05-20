import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { RegisterLogo } from "../ui/RegisterLogo";
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

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const userId = localStorage.getItem("userId");
  const userToken = localStorage.getItem("userToken");
  const lobbyId = localStorage.getItem("lobbyId");
  const [loading, setLoading] = useState(false);

  async function doRegister() {
    try {
      setLoading(true);
      if (username.toUpperCase().includes("GUEST")) {
        toast.error("Username cannot contain 'guest'");
        
        return;
      }
      else if (username === " " || password === " ") {
        toast.error("Username and password cannot be empty");
        
        return;

      }

      const requestBody = JSON.stringify({ username, password });

      if (userId === null && userToken === null) {
        const response = await api.post("/register", requestBody);

        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("profilePicture", response.data.profilePicture);
      } else {
        const profilePicture = localStorage.getItem("profilePicture");
        const requestBody = JSON.stringify({
          id: userId,
          username: username,
          password: password,
          token: userToken,
          status: "ONLINE",
          profilePicture: profilePicture,
        });

        await api.put(`/users/${userId}`, requestBody);
      }

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/menu");
    } catch (error) {
      toast.error(doHandleError(error));
    } finally {
      setLoading(false);
    }
  }

  async function doBack() {
    if (userId !== null && userToken !== null && lobbyId !== null) {
      navigate("/endscreen");
    } else {
      localStorage.clear();
      navigate("/landingPage");
    }
  }

  return (
    <BaseContainer>
      <ToastContainer {...toastContainerError} />
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
              style={{ marginRight: "10px", width:"100%" }}
              onClick={doBack}
            >
              Back
            </Button>
            {loading ? (
              <Spinner />
            ) : (
              <Button
                style={{ marginLeft: "10px", width:"100%" }}
                disabled={(!username || !password)}
                onClick={() => doRegister()}
              >
                Register
                <span style={{ marginLeft: "10px" }}>
                  <RegisterLogo width="24px" height="24px" />
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
export default Register;
