import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import "../../styles/ui/CharacterGrid.scss";
import BaseContainer from "./BaseContainer";
import Character from "./Character";

const CharacterGrid = ({CharButton}) => {
  const [characters, setCharacters] = useState<string[]>();

  // This can also be deleted for demonstration
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

  //to make it work, delete jsx code ({..}) and only <Character/>
  return (
    <BaseContainer className="character-grid">
      {characters.map(([idx, url]) => ( //change to array map
        <Character id={idx} url={url} func={CharButton} />
      ))}
    </BaseContainer>
  );
};

export default CharacterGrid;
