import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import CharacterGrid from "components/ui/CharacterGrid"; // import for later usage
import ChatLog from "components/ui/ChatLog"; // import for later usage
import "styles/views/Game.scss";

const Game = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate

  // Leave commented for designing purposes
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await api.post(`/game/create`); //or something like that
  //     } catch (error) {
  //       alert(`Something went wrong fetching the characters: \n${handleError(error)}`);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
