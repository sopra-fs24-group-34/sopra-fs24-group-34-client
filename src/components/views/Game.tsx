import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import BaseContainer from "components/ui/BaseContainer";
import CharacterGrid from "./Game-components/CharacterGrid"; 
import ChatLog from "./Game-components/ChatLog"; 
import "styles/views/Game.scss";

const Game = () => {
  const [characters, setCharacters] = useState<string[]>([]);
  const [hasAccepted, setHasAccepted] = useState<Boolean>(false);

  // useEffect to fetch images from DB
  useEffect(() => {
    const fetchImages = async () => {
      try {
        await api.post("/images/saving");
        await api.post("/images/saving");
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
  }, []); 

  // function to display an overlay which should replace a character
  const ReplaceCharacter = (idx, id) => {
    return (
      <div className="character overlay">
        <button
          className="character-button"
          onClick={() => RemoveCharacter(idx, id)}
        >
          Replace
        </button>
      </div>
    );
  };

  // function to remove and set a new character at that place
  // No idea if this is correct (might need a reload)
  const RemoveCharacter = async (idx, id) => {
    const response = await api.delete(`images/${id}`);
    setCharacters((prevCharacters) => {
      const newCharacters = [...prevCharacters];
      newCharacters[idx] = response.data;

      return newCharacters;
    });
  };

  // Returns either the grid to potentially replace characters or the actual game
  return (
    <BaseContainer className="game container">
      {hasAccepted ? (
        <>
          <CharacterGrid persons={characters} />
          <ChatLog/>
        </>
      ) : (
        <>
          <div className="character-grid">
            {characters.map((character, idx) => (
              <div className="character container" key={character.id}>
                <img
                  className="character container img"
                  src={character.url}
                ></img>
                <div className="character overlay">
                  {ReplaceCharacter(idx, character.id)}
                </div>
              </div>
            ))}
          </div>
          <button
            className="accept-character-button"
            onClick={() => setHasAccepted(true)}
          >
            Accept characters
          </button>
        </>
      )}
    </BaseContainer>
  );
};

export default Game;
