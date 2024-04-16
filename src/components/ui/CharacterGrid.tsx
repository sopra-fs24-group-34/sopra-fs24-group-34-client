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

  // Leave commented for designing purposes
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await api.get(`/images/random`);
  //       setCharacters(response.data);
  //     } catch (error) {
  //       alert(`Something went wrong fetching the characters: \n${handleError(error)}`);
  //     }
  //   };

  //   fetchData();
  // }, []); // Fetch data on component mount

  const pickCharacter = async () => {
    try {
      setHasPicked(true);
      await api.post(`/game/pick`, { characterId }); // LiamK21: change URI¨
    } catch (error) {
      alert(`Something went wrong choosing your pick: \n${handleError(error)}`);
    }
  };

  const interactCharacter = () => {
    return (
      <BaseContainer>
        <Button onClick={() => foldCharacter(characterId)}>Fold</Button>
        <Button onClick={() => guessCharacter(characterId)}>Guess</Button>
      </BaseContainer>
    );
  };

  const foldCharacter = (id) => {};

  // Should probably stay here
  const guessCharacter = (id) => {};

  const handleCharacterButtonClick = () => {
    if (!hasPicked) {
      pickCharacter();
    } else {
      interactCharacter();
    }
  };

  return (
    //The "1" is replaced by the actual id/idx from below
    <BaseContainer className="character-grid">
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
      <Character/>
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
