import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Lobby from "../../views/Lobby";
import PropTypes from "prop-types";

const LobbyRouter = () => {
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Routes>

        <Route path="" element={<Lobby />} />

      </Routes>
   
    </div>
  );
};

LobbyRouter.propTypes = {
  base: PropTypes.string
}

export default LobbyRouter;
