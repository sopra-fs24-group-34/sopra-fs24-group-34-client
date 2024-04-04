import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

export const LobbyGuard = () => {
  
  if (localStorage.getItem("token")) {  // nedim-j: implement checking for lobby token as well
        
    return <Outlet />;
  }
  
  return <Navigate to="/login" replace />;
  
};

LobbyGuard.propTypes = {
  children: PropTypes.node
};