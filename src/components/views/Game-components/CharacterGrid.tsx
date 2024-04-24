import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import "../../../styles/views/Game-components/CharacterGrid.scss";
import PropTypes from "prop-types";
import BaseContainer from "../../ui/BaseContainer";
import Character from "./Character";
import PusherService from "../PusherService";

const CharacterGrid = ({ persons }) => {
  const navigate = useNavigate();
  const gameId = Number(localStorage.getItem("gameId"));
  const playerId = Number(localStorage.getItem("playerId"));

  const [currentRound, setCurrentRound] = useState<String>("Pick");
  const [visibleCharacters, setVisibleCharacters] = useState<Boolean[]>(
    persons.map((person) => true)
  );
  const [showModal, setShowModal] = useState<Boolean>(false);

  const pusherService = new PusherService();

  // Leave commented out for the moment
  useEffect(() => {
    pusherService.subscribeToChannel(
      `gameRound${gameId}`,
      "round-update",
      (data) => {
        console.log("Received information:", data);
        //nedim-j: define first in backend, what gets returned. String with state not ideal, as we probably want more info exchanged than that
        //setCurrentRound(response);
        if (data.guess === true) {
          if(data.playerId === playerId) {
            localStorage.setItem("result", "won");
          } else {
            localStorage.setItem("result", "lost");
          }
          navigate("/endscreen");
        }
      }
    );

    return () => {
      pusherService.unsubscribeFromChannel("game");
    };
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const pickCharacter = async (characterId) => {
    try {
      console.log(
        "GAMEID",
        gameId,
        "USERID",
        playerId,
        "CHARACTERID",
        characterId
      );
      const send = JSON.stringify({
        gameid: gameId,
        playerid: playerId,
        imageid: characterId,
      });
      setCurrentRound("Guess");
      console.log("PICKCHARACTER:", send);
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
      playerid: playerId,
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

  // Returns the grid with 20 characters. Each character receives the functionality.
  return (
    <BaseContainer className="character-grid">
      {persons.map((character, idx) => (
        <Character
          key={character.id}
          character={character}
          visibleCharacter={visibleCharacters[idx]}
          currentRound={currentRound}
          pickCharacter={() => pickCharacter(character.id)}
          foldCharacter={() => foldCharacter(idx)}
          guessCharacter={() => guessCharacter(character.id)}
        />
      ))}
      <div
        className={`modal-overlay ${showModal ? "show" : ""}`}
        onClick={() => toggleModal()}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Current Instructions</h2>
            <span className="close-btn" onClick={() => toggleModal()}>
              &times;
            </span>
          </div>
          <div className="modal-body">
            {/* Your modal content */}
            <p>
              This is the modal content. What happens if i extend this thing 
            </p>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

CharacterGrid.propTypes = {
  persons: PropTypes.array,
};

export default CharacterGrid;
