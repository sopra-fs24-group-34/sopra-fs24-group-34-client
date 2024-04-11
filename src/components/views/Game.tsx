import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
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

  const [isQuestion, setIsQuestion] = useState<Boolean>(true); // LiamK21: Must be different
  const [characters, setCharacters] = useState<string>(null);
  const [userPick, setUserPick] = useState<Number>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [chat, setChat] = useState(null);

  // In "CharacterGrid"
  const getcharacters = async () => {
    try {
      const response = await api.get(`/images/random`);
      setCharacters(response.data);
    } catch (error) {
      alert(
        `Something went wrong fetching the characters: \n${handleError(error)}`
      );
    }
  };

  // In "ChatLog"
  const QField = () => {
    return (
      <div>
        <QuestionField
          value={prompt}
          onChange={(q: string) => setPrompt(q)}
        ></QuestionField>
        <Button disabled={!prompt} onClick={() => updateChat()}>
          Send
        </Button>
      </div>
    );
  };

  // In "ChatLog"
  const BoolField = () => {
    return (
      <div>
        <Button
          onClick={() => {
            setPrompt("yes");
            updateChat();
          }}
        >
          Yes
        </Button>
        <Button
          onClick={() => {
            setPrompt("no");
            updateChat();
          }}
        >
          No
        </Button>
      </div>
    );
  };

  // Can be put into "Character" or "CharacterGrid"
  const foldCharacter = (): void => {};

  // In "ChatLog"
  const updateChat = async () => {
    try {
      const response = await api.post(`/something`); // LiamK21: IDK if post/put; change URI
      setChat(response.data);
    } catch (error) {
      alert(
        `Something went wrong fetching the characters: \n${handleError(error)}`
      );
    }
  };

  // Should probably stay here
  const guessCharacter = (): void => {};

  // LiamK21: The return statement needs <Basecontainer > <CharacterGrid> <gameLog>
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
        <BaseContainer className="game log chat">lkjlfdsa</BaseContainer>
        {isQuestion ? QField() : BoolField()}
      </BaseContainer>
    </BaseContainer>
  );
};

export default Game;
