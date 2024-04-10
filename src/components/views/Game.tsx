import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { Character, User } from "types";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    <div className="player id">id: {user.id}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const Person = ({ character }: { character: Character }) => (
  <div className="character container">
    <div className="characer id">{character.id}</div>
    <div className="characer image">{character.image}</div>
    <div className="character name">{character.name}</div>
  </div>
);

Person.propTypes = {
  person: PropTypes.object,
};

const Game = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();

  const [userPick, setUserPick] = useState<Number>(null);
  const [question, setQuestion] = useState<Number>(null);

  const foldCharacter = (): void => {};

  const sendQuestion = (): void => {};

  const getQuestion = (): void => {};

  const guessCharacter = (): void => {};

  return (
    <BaseContainer className="game container">
      <BaseContainer className="game characterContainer">
        <div className="game character-item">1</div>
        <div className="game character-item">2</div>
        <div className="game character-item">3</div>
        <div className="game character-item">4</div>
        <div className="game character-item">5</div>
        <div className="game character-item">6</div>
        <div className="game character-item">7</div>
        <div className="game character-item">8</div>
        <div className="game character-item">9</div>
        <div className="game character-item">10</div>
        <div className="game character-item">11</div>
        <div className="game character-item">12</div>
        <div className="game character-item">13</div>
        <div className="game character-item">14</div>
        <div className="game character-item">15</div>
        <div className="game character-item">16</div>
        <div className="game character-item">17</div>
        <div className="game character-item">18</div>
        <div className="game character-item">19</div>
        <div className="game character-item">20</div>

      </BaseContainer>
      <BaseContainer className="game log">
        <BaseContainer className="game log chat"></BaseContainer>
          <input></input>
          <Button disabled={!question}>Send</Button>
      </BaseContainer>
      
    </BaseContainer>
  );
};

export default Game;
