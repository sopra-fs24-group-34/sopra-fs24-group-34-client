import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import CharacterGrid from "components/ui/CharacterGrid"; // import for later usage
import ChatLog from "components/ui/ChatLog"; // import for later usage
import "styles/views/Game.scss";
import { Button } from "components/ui/Button";


const Game = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  

  return (
    <BaseContainer className="game container">
      <CharacterGrid />
      <ChatLog />
    </BaseContainer>
  );

  /*
  return (
  <div>
    <Character id={id} url={url} func={() => setShowInteract(true)} />
    {showInteract && (
      <div className="modal">
        <div className="modal-content">
          <interactCharacter id={id} onClose={() => setShowInteract(false)} />
        </div>
      </div>
    )}
  </div>
); */
};

export default Game;
