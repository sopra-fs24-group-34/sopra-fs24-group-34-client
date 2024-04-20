import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import "../../../styles/views/Game-components/CharacterGrid.scss";
import BaseContainer from "../../ui/BaseContainer";
import Character from "./Character";

const CharacterGrid = () => {
  const [characters, setCharacters] = useState<string[]>();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const x = await api.post("/images/saving", {
          params: {
            count: 20, // Pass the count parameter to fetch 20 images
          },
        });
        const response = await api.get("/images", {
          params: {
            count: 20, // Pass the count parameter to fetch 20 images
          },
        });
        setCharacters(response.data);
      } catch (error) {
        alert(
          `Something went wrong fetching the characters: \n${handleError(
            error
          )}`
        );
      }
    };

    fetchImages();
  }, []); // Fetch data on component mount

  if (!characters) {
    return <div>Loading...</div>;
  }
  
  return (
    <BaseContainer className="character-grid">
      {characters.map((character) => (
        <Character key={character.id} id={character.id} url={character.url} />
      ))}
    </BaseContainer>
  );
};

export default CharacterGrid;
