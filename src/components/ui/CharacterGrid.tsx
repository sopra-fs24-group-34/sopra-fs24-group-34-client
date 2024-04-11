import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import "../../styles/ui/CharacterGrid.scss";
import BaseContainer from "./BaseContainer";
import Character from "./Character";

const CharacterGrid = () => {
  const [characters, setCharacters] = useState();

  // This can also be deleted for demonstration
  useEffect(async () => {
    try {
      const response = await api.get(`/images/random`);
      setCharacters(response.data);
    } catch (error) {
      alert(
        `Something went wrong fetching the characters: \n${handleError(error)}`
      );
    }
  }, []); // Fetch data on component mount

  //to make it work, delete jsx code ({..}) and only <Character/>
  return (
    <BaseContainer className="character-grid">
      {Object.entries(characters).map(([id, url]) => (
        <Character key={id} url={url} />
      ))}
    </BaseContainer>
  );
};

export default CharacterGrid;
