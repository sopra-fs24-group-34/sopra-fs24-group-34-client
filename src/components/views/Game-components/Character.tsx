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
  hihglight,
}) => {
  // functionality to display an overlay on top of character
  const interactCharacter = () => {
    if (gameStatus === "CHOOSING") {
      return (
        <div className="character overlay">
          <button
            className="character-button"
            onClick={() => pickCharacter()}
            style={{ color: "yellow" }}
          >
            Pick
          </button>
        </div>
      );
    }

    return (
      <div className="character overlay">
        <button
          className="character-button"
          onClick={() => foldCharacter()}
          style={{ color: "limegreen" }}
        >
          Fold
        </button>
        <button
          className="character-button"
          onClick={() => guessCharacter()}
          style={{ color: "pink" }}
        >
          Guess
        </button>
      </div>
    );
  };

  return (
    <div
      className={`character container ${hihglight ? "highlight" : ""}`}
      key={character.id}
    >
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
  hihglight: PropTypes.Boolean,
};

export default Character;
