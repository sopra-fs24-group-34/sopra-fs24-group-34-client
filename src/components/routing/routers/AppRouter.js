import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MenuGuard } from "../routeProtectors/MenuGuard";
import MenuRouter from "./MenuRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { RegisterGuard } from "../routeProtectors/RegisterGuard";
import Login from "../../views/Login";
import LandingPage from "../../views/LandingPage";
import Register from "../../views/Register";
import { LobbyGuard } from "../routeProtectors/LobbyGuard";
import LobbyRouter from "./LobbyRouter";
import GameRouter from "./GameRouter";
import { GameGuard } from "../routeProtectors/GameGuard";
import Endscreen from "../../views/Endscreen";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/menu".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /menu renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game/" element={<GameGuard />}>
          <Route path="/game/" element={<GameRouter base="/game" />} />
        </Route>

        <Route path="/menu/" element={<MenuGuard />}>
          <Route path="/menu/" element={<MenuRouter base="/menu" />} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/landingPage" element={<LandingPage />}></Route>

        <Route path="/endscreen" element={<Endscreen />}></Route>

        <Route path="/lobby/*" element={<LobbyGuard />}>
          <Route path="/lobby/*" element={<LobbyRouter base="/lobby" />} />
        </Route>

        <Route path="/" element={<Navigate to="/landingPage" replace />} />

        <Route path="/register" element={<RegisterGuard />}>
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
