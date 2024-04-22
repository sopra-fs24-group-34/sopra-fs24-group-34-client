import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Game from "../../views/Game";
import PropTypes from "prop-types";

const GameRouter = () => {
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Routes>

        <Route path="" element={<Game />} />

      </Routes>
   
    </div>
  );
};

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
