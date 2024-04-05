import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import { User } from "types";

const Lobby = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    navigate("/login");
  };

  return (
    <BaseContainer className="lobby container">
      <div className="buttonbar">
        <Button style={{ flex: "8", marginRight: "1em" }} onClick={() => navigate("/menu")}>
          Return to Menu
        </Button>
        <Button style={{ flex: "2" }} onClick={() => logout()}>
          Logout
        </Button>
      </div>
        
      implement

    </BaseContainer>
  );
};

export default Lobby;
