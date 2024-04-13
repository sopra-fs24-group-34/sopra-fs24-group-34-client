import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import "../../styles/ui/CharacterGrid.scss";
import BaseContainer from "./BaseContainer";
import { Button } from "components/ui/Button";
import Character from "./Character";

const CharacterGrid = () => {
  const [characters, setCharacters] = useState<string[]>();
  const [hasPicked, setHasPicked] = useState<Boolean>(false);
  const [showInteract, setShowInteract] = useState<Boolean>(false);
  const [characterId, setCharacterId] = useState<number>(null);

  // can be deleted for simple testing purposes
  useEffect(async () => {
    try {
      const response = await api.get(`/images/random`); // frontend sends length
      setCharacters(response.data); //characters is an array/list
    } catch (error) {
      alert(
        `Something went wrong fetching the characters: \n${handleError(error)}`
      );
    }
  }, []); // Fetch data on component mount

  const pickCharacter = async (id) => {
    try {
      setHasPicked(true);
      const response = await api.post(`/something`, { id }); // LiamK21: change URI
    } catch (error) {
      alert(
        `Something went wrong choosing your pick: \n${handleError(error)}`
      );
    }
  }

  /*const interactCharacter = (id, onClose) => {
    return (
      <BaseContainer>
        <Button onClick={() => foldCharacter(id)}>Fold</Button>
        <Button onClick={() => guessCharacter(id)}>Guess</Button>
        <Button onClick={onClose}>Close</Button>
      </BaseContainer>
    );
  };*/

  const foldCharacter = (id) => {};

  // Should probably stay here
  const guessCharacter = (id) => {};

  const handleCharacterButtonClick = () => {
    if (!hasPicked) {
      pickCharacter(characterId)
    }
    else {
      setCharacterId(characterId);
      setShowInteract(true);
    }
  };

  return ( //The "1" is replaced by the actual id/idx from below
    <BaseContainer className="character-grid">
      <Character func={() => {setCharacterId(1); handleCharacterButtonClick()}} /> 
      {showInteract && (
      <dialog className="modal">
        <div className="modal-content">
              <Button onClick={() => foldCharacter(characterId)}>Fold</Button>
              <Button onClick={() => guessCharacter(characterId)}>Guess</Button>
              <Button onClick={() => setShowInteract(false)}>Close</Button>
        </div>
      </dialog>
    )}
    </BaseContainer>
  );


  /*return (
    <BaseContainer className="character-grid">
      {characters.map(([idx, url]) => ( //change to array map
        <Character key={idx} url={url} func={CharButton} />
      ))}
    </BaseContainer>
  );*/
};

export default CharacterGrid;
