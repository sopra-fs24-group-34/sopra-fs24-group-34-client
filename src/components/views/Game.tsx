import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import CharacterGrid from "./Game-components/CharacterGrid"; // import for later usage
import ChatLog from "./Game-components/ChatLog"; // import for later usage
import "styles/views/Game.scss";
import TestGrid from "./Game-components/testGrid";

const Game = () => {
  const [characters, setCharacters] = useState<string[]>([]);

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
  }, []); // Fetch data on component mount

  return (
    <BaseContainer className="game container">
      {console.log(characters)}
      <TestGrid persons={characters} />
      <ChatLog />
    </BaseContainer>
  );

};

export default Game;
