import React, { useState, useEffect } from "react";
import "../../../styles/views/Game-components/Character.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import PusherService from "./PusherService";

// Each Character receives an id (idx in array) and an img (value in array)
const Character = ({}) => {
  const [gameId, setGameId] = useState<Number>(null);
  //This (or another state) needs to be updated by the server to know that both users picked
  const [currentRound, setCurrentRound] = useState<String>("Pick");
  const [visibleCharacter, setvisibleCharacter] = useState<Boolean>(true);

  // This state depends, either we pass it as parameter or use it
  const [characterId, setCharacterId] = useState<number>(null);
  const pusherService = new PusherService();

  useEffect(() => {
    pusherService.subscribeToChannel(`gameRound${gameId}`, "round-update", (response: string) => {
      console.log("Received information:", response);
      setCurrentRound(response);
      
  }); // LiamK21: change function

    return () => {
      pusherService.unsubscribeFromChannel("game");
    };
  }, []);
  // Func to pick a character at the beginning
  const pickCharacter = async () => {
    try {
      //setCurrentRound(true);
      await api.post(`/game/pick`, { characterId }); // LiamK21: change URI¨
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
    const response = await api.post(`/game/guess/${characterId}`); // LiamK21: something like that
  };

  return (
    <div className={`character ${visibleCharacter ? "container" : "fold"}`}>
      <img
        className="character container img"
        src="https://www.anthropics.com/portraitpro/img/page-images/homepage/v22/what-can-it-do-2A.jpg"
      ></img>
      {visibleCharacter ? (
        <div className="character overlay">{interactCharacter()}</div>
      ) : (
        <div className="character fold">{interactCharacter()}</div>
      )}
    </div>
  );
  /* Here, interactCharacter might need a parameter id to work
  This is the actual return statement:
  return (
  <div className="character container" key={id}>
    <img src={url}></img>
      <div className"character overlay">
        {interactCharacter()}
      </div>
  </div>);*/
};

Character.propTypes = {
  //id: propTypes.number,
  //url: propTypes.string,
  func: PropTypes.func,
};

export default Character;
