import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import "../../../styles/views/Game-components/CharacterGrid.scss";
import PropTypes from "prop-types";
import BaseContainer from "../../ui/BaseContainer";
import TestCharacter from "./TestCharacter";
import PusherService from "../PusherService";

const TestGrid = ({ persons }) => {
  const navigate = useNavigate();
  const gameId = localStorage.getItem("gameId");
  const userId = localStorage.getItem("userId");

  const [currentRound, setCurrentRound] = useState<String>("Pick");
  const [visibleCharacters, setVisibleCharacters] = useState<Boolean[]>(
    persons.map((person) => true)
  );
  const pusherService = new PusherService();

  useEffect(() => {
    pusherService.subscribeToChannel(
      `gameRound${gameId}`,
      "round-update",
      (response) => {
        console.log("Received information:", response);
        setCurrentRound(response);
        if (currentRound === "Game-end") {
          navigate("endscreen");
        }
      }
    );

    return () => {
      pusherService.unsubscribeFromChannel("game");
    };
  }, []);

  const pickCharacter = async (characterId) => {
    try {
      const send = JSON.stringify({
        gameid: gameId,
        playerid: userId,
        imageid: characterId,
      });
      await api.put("/game/character/choose", send); 
    } catch (error) {
      alert(`Something went wrong choosing your pick: \n${handleError(error)}`);
    }
  };

  // Func to fold / unfold a character
  const foldCharacter = (characterIndex) => {
    setVisibleCharacters((prevVisibleCharacters) => {
      const newVisibleCharacters = [...prevVisibleCharacters];
      newVisibleCharacters[characterIndex] =
        !newVisibleCharacters[characterIndex];
      return newVisibleCharacters;
    });
  };

  // Func to guess a character
  const guessCharacter = async (characterId) => {
    const send = JSON.stringify({
      gameid: gameId,
      playerid: userId,
      imageid: characterId,
    });
    const response = await api.post("/game/character/guess", send);
    if (response.data) {
      setCurrentRound("Game-ended");
    }
  };

  if (!persons) {
    return <div>Loading...</div>;
  }

  return (
    <BaseContainer className="character-grid">
      {persons.map((character, idx) => (
        <TestCharacter
          key={character.id}
          character={character}
          visibleCharacter={visibleCharacters[idx]}
          currentRound={currentRound}
          pickCharacter={() => pickCharacter(character.id)}
          foldCharacter={() => foldCharacter(idx)}
          guessCharacter={() => guessCharacter(character.id)}
        />
      ))}
    </BaseContainer>
  );
};

TestGrid.propTypes = {
  persons: PropTypes.array,
};

export default TestGrid;
