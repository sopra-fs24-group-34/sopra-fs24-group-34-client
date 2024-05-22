import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import PreGame from "../../views/PreGame";
import PropTypes from "prop-types";

const PreGameRouter = () => {
  return (
    <>
      <Routes>

        <Route path="" element={<PreGame />} />

      </Routes>
   
    </>
  );
};

PreGameRouter.propTypes = {
  base: PropTypes.string
}

export default PreGameRouter;
