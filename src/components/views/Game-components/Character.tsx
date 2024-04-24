import React from "react";
import "../../../styles/views/Game-components/Character.scss";
import PropTypes from "prop-types";

// Each Character receives a character object together with functionality
const Character = ({
  character,
  visibleCharacter,
  pickCharacter,
  foldCharacter,
  guessCharacter,
  currentRound,
}) => {
  // functionality to display an overlay on top of character
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

  return (
    <div className={"character container"} key={character.id}>
      <img className="character container img" src={character.url}></img>
      {visibleCharacter ? (
        <div className="character overlay">{interactCharacter()}</div>
      ) : (
        <div className="character container fold">{interactCharacter()}</div>
      )}
    </div>
  );
};

Character.propTypes = {
  character: PropTypes.obj,
  visibleCharacter: PropTypes.Func,
  pickCharacter: PropTypes.Func,
  foldCharacter: PropTypes.Func,
  guessCharacter: PropTypes.Func,
  currentRound: PropTypes.String,
};

export default Character;
