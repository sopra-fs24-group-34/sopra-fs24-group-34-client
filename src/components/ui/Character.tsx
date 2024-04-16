import React, { useState } from "react";
import "../../styles/ui/Character.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";

// Each Character receives an id (idx in array) and an img (value in array)
const Character = ({}) => {
  //This (or another state) needs to be updated by the server to know that both users picked
  const [hasPicked, setHasPicked] = useState<Boolean>(true);
  const [visibleCharacter, setvisibleCharacter] = useState<Boolean>(true);
  // This state depends, either we pass it as parameter or use it
  const [characterId, setCharacterId] = useState<number>(null);

  // Func to pick a character at the beginning
  const pickCharacter = async () => {
    try {
      setHasPicked(true);
      await api.post(`/game/pick`, { characterId }); // LiamK21: change URI¨
    } catch (error) {
      alert(`Something went wrong choosing your pick: \n${handleError(error)}`);
    }
  };

  // Func to display further functions on the character
  const interactCharacter = () => {
    if (!hasPicked) {
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
