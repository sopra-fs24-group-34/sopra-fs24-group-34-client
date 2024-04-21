import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import CharacterGrid from "./Game-components/CharacterGrid"; // import for later usage
import ChatLog from "./Game-components/ChatLog"; // import for later usage
import "styles/views/Game.scss";

const Game = () => {
  
  return (
    <BaseContainer className="game container">
      <CharacterGrid />
      <ChatLog />
    </BaseContainer>
  );

};

export default Game;
