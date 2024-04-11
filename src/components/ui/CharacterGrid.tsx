import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import "../../styles/ui/CharacterGrid.scss";
import PropTypes from "prop-types";
import BaseContainer from "./BaseContainer";
import Character from "./Character";

const CharacterGrid = () => {
  const [characters, setCharacters] = useState();

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
  
  return (
  <BaseContainer className="character-grid">
    {Object.entries(characters).map(([id, url]) => (
      <Character key={id} url={url}
      />
    ))}

  </BaseContainer>
  )
};

export default CharacterGrid;