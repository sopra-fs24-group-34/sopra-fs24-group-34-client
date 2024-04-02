import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Menu from "../../views/Menu";
import PropTypes from "prop-types";

const MenuRouter = () => {
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Routes>

        <Route path="" element={<Menu />} />

        <Route path="dashboard" element={<Menu />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />

      </Routes>
   
    </div>
  );
};
/*
* Don't forget to export your component!
 */

MenuRouter.propTypes = {
  base: PropTypes.string
}

export default MenuRouter;
