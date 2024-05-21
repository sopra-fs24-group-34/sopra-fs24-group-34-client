import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

export const GameGuard = () => {
  if (localStorage.getItem("userToken")) {
    if (localStorage.getItem("gameId")) {
      return <Outlet />;
    }
    
    return <Navigate to="/menu" replace />;
  }

  return <Navigate to="/login" replace />;
};

GameGuard.propTypes = {
  children: PropTypes.node,
};
