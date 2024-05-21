import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import PreGame from "../../views/PreGame";
import PropTypes from "prop-types";

const GameRouter = () => {
  return (
    <>
      <Routes>

        <Route path="" element={<PreGame />} />

      </Routes>
   
    </>
  );
};

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
