import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/views/Game-components/Character.scss";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import PusherService from "../PusherService";

// Each Character receives an id (idx in array) and an img (value in array)
const TestCharacter = ({
  character,
  visibleCharacter,
  pickCharacter,
  foldCharacter,
  guessCharacter,
  currentRound
}) => {

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
    <div
      className={`character ${visibleCharacter ? "container" : "fold"}`}
      key={character.id}
    >
      <img className="character container img" src={character.url}></img>
      {visibleCharacter ? (
        <div className="character overlay">{interactCharacter()}</div>
      ) : (
        <div className="character fold">{interactCharacter()}</div>
      )}
    </div>
  );
};

TestCharacter.propTypes = {
  character: PropTypes.obj,
  visibleCharacter: PropTypes.Func,
  pickCharacter: PropTypes.Func,
  foldCharacter: PropTypes.Func,
  guessCharacter: PropTypes.Func,
  currentRound: PropTypes.String
};

export default TestCharacter;
