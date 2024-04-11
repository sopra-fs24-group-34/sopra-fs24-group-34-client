import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import CharacterGrid from "components/ui/CharacterGrid"; // import for later usage
import ChatLog from "components/ui/ChatLog"; // import for later usage
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { Button } from "components/ui/Button";


const Game = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();
  const [hasPicked, setHasPicked] = useState<Boolean>(false);

  const pickCharacter = async (id) => {
    try {
      setHasPicked(true);
      const response = await api.post(`/something`, { id }); // LiamK21: IDK if post/put; change URI
    } catch (error) {
      alert(
        `Something went wrong choosing your pick: \n${handleError(error)}`
      );
    }
  }

  const interactCharacter = (id) => {
    return (
      <BaseContainer>
        <Button
        onClick={() => foldCharacter(id)}>
          Fold
        </Button>
        <Button
        onClick={() => guessCharacter(id)}>
          Guess
        </Button>
      </BaseContainer>
    )
  }
  
  // Can be put into "Character" or "CharacterGrid"
  const foldCharacter = (id) => {};

  // Should probably stay here
  const guessCharacter = (id) => {};

  /* general return
  return (
    <BaseContainer className="game container">
      <CharacterGrid pick={hasPicked ? interactCharacter : pickCharacter}/>
      <ChatLog />
    </BaseContainer>
  );*/

  //Smail "Chat" return
  return (
    <BaseContainer className="game container">
      <ChatLog />
    </BaseContainer>
  );

  // Dario "CharacterGrid" return
  return (
    <BaseContainer className="game container">
      <CharacterGrid pick={hasPicked ? interactCharacter : pickCharacter}/>
    </BaseContainer>
  );
};

export default Game;
