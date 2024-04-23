import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import "../../../styles/views/Game-components/Character.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import PusherService from "../PusherService";

// Each Character receives an id (idx in array) and an img (value in array)
const Character = ({ id, url }) => {
  const navigate = useNavigate();
  const gameId = localStorage.getItem("gameId");
  const playerId = localStorage.getItem("playerId");
  //This (or another state) needs to be updated by the server to know that both users picked
  const [currentRound, setCurrentRound] = useState<String>("Pick");
  const [visibleCharacter, setvisibleCharacter] = useState<Boolean>(true);

  // This state depends, either we pass it as parameter or use it
  const imageId = id;
  const pusherService = new PusherService();

  useEffect(() => {
    pusherService.subscribeToChannel(
      `gameRound${gameId}`,
      "round-update",
      (response) => {
        console.log("Received information:", response);
        setCurrentRound(response);
        if (currentRound === "Game-end") {
          navigate("endscreen")
        }
      }
    ); 

    return () => {
      pusherService.unsubscribeFromChannel("game");
    };
  }, []);
  // Func to pick a character at the beginning
  const pickCharacter = async () => {
    try {
      const send = JSON.stringify({ gameId,  playerId, imageId})
      await api.put("/game/character/choose", {gameId, playerId, imageId} ); // LiamK21: change URI¨
    } catch (error) {
      alert(`Something went wrong choosing your pick: \n${handleError(error)}`);
    }
  };

  // Func to display further functions on the character
  const interactCharacter = () => {
    if (currentRound === "Pick") {
      return (
        <div className="character overlay">
          <button className="character-button" onClick={() => pickCharacter()}>
            Pick
          </button>
        </div>
      );
    }

    return (
      <div className="character overlay">
        <button className="character-button" onClick={() => foldCharacter()}>
          Fold
        </button>
        <button className="character-button" onClick={() => guessCharacter()}>
          Guess
        </button>
      </div>
    );
  };

  // Func to fold / unfold a character
  const foldCharacter = () => {
    setvisibleCharacter(!visibleCharacter);
  };

  // Func to guess a character
  const guessCharacter = async () => {
    const send = JSON.stringify({gameId, playerId, imageId})
    const response = await api.post("/game/character/guess", {gameId, playerId, imageId});
    if (response.data) {
      setCurrentRound("Game-ended")
    }

  };

  return (
    <div
      className={`character ${visibleCharacter ? "container" : "fold"}`}
      key={id}
    >
      <img className="character container img" src={url}></img>
      {visibleCharacter ? (
        <div className="character overlay">{interactCharacter()}</div>
      ) : (
        <div className="character fold">{interactCharacter()}</div>
      )}
    </div>
  );
};

Character.propTypes = {
  id: PropTypes.number,
  url: PropTypes.string,
  func: PropTypes.func,
};

export default Character;
