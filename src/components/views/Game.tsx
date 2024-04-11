import React from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import CharacterGrid from "components/ui/CharacterGrid"; // import for later usage
import ChatLog from "components/ui/ChatLog"; // import for later usage
import PropTypes from "prop-types";
import "styles/views/Game.scss";

const QuestionField = (props) => {
  return (
    <div className="game field">
      <input
        type="text"
        className="game input"
        placeholder="Enter your question here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

QuestionField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Game = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();

  // Can be put into "Character" or "CharacterGrid"
  const foldCharacter = (): void => {};

  // Should probably stay here
  const guessCharacter = (): void => {};

  return (
    <BaseContainer className="game container">
      <CharacterGrid />
      <ChatLog />
    </BaseContainer>
  );
};

export default Game;
