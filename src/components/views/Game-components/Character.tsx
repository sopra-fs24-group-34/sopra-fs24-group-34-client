import React from "react";
import "../../../styles/views/Game-components/Character.scss";
import PropTypes from "prop-types";

// Each Character receives a character object together with functionality
const Character = ({
  key,
  character,
  visibleCharacter,
  pickCharacter,
  foldCharacter,
  guessCharacter,
  gameStatus,
}) => {
  // functionality to display an overlay on top of character
  const interactCharacter = () => {
    if (gameStatus === "CHOOSING") {
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
  key: PropTypes.number,
  character: PropTypes.obj,
  visibleCharacter: PropTypes.Func,
  pickCharacter: PropTypes.Func,
  foldCharacter: PropTypes.Func,
  guessCharacter: PropTypes.Func,
  gameStatus: PropTypes.String,
};

export default Character;
