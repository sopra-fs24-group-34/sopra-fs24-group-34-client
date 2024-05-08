import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Game from "../../views/Game";
import PropTypes from "prop-types";

const GameRouter = () => {
  return (
    <>
      <Routes>

        <Route path="" element={<Game />} />

      </Routes>
   
    </>
  );
};

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
