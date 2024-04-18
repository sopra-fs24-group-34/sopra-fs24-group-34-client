import React, { useEffect, useState } from "react";
import "../../../styles/views/Game-components/CharacterGrid.scss";
import BaseContainer from "../../ui/BaseContainer";
import Character from "./Character";

const CharacterGrid = () => {
  const [characters, setCharacters] = useState<string[]>();

  // Leave commented for designing purposes
  // useEffect(() => {
  //   const fetchImages = async () => {
  //     try {
  //       const response = await api.get("/images/random");
  //       setCharacters(response.data);
  //     } catch (error) {
  //       alert(`Something went wrong fetching the characters: \n${handleError(error)}`);
  //     }
  //   };

  //   fetchImages();
  // }, []); // Fetch data on component mount

  return (
    //The "1" is replaced by the actual id/idx from below
    <BaseContainer className="character-grid">
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
      <Character />
    </BaseContainer>
  );

  /*return (
    <BaseContainer className="character-grid">
      {characters.map(([idx, url]) => ( 
        <Character key={idx} url={url} />
      ))}
    </BaseContainer>
  );*/
};

export default CharacterGrid;
