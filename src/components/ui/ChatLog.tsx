import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import "../../styles/ui/ChatLog.scss";
import PropTypes from "prop-types";
import BaseContainer from "./BaseContainer";

// Defines the structure of the question field
const QuestionField = (props) => {
  return (
    <div className="game-log field">
      <input
        type="text"
        className="game-log input"
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

const ChatLog = () => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isQuestion, setIsQuestion] = useState<Boolean>(true);

  // Creates the question field as functional component
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

  // Creates the button-answer field as functional component
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

  // Updates the game log (always used after )
  const updateChat = async () => {
    try {
      await api.post(`/game/${1}`, { prompt }); // LiamK21: IDK if post/put; change URI
      const response = await api.get(`/game/${1}`);
      setMessages(response.data);
    } catch (error) {
      alert(
        `Something went wrong fetching the game chat: \n${handleError(error)}`
      );
    }
  };
  // function to display the current field; does not work
  const displayField = () => {
    // needs a call to server
    if (isQuestion) {
      setIsQuestion(!isQuestion);

      return QField();
    }
    setIsQuestion(!isQuestion);
    
    return BoolField();
  };

  return (
    <BaseContainer className="game-log">
      <BaseContainer className="game-log chat">
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </BaseContainer>
      <div>{isQuestion ? QField() : BoolField()}</div>
    </BaseContainer>
  );
};

export default ChatLog;
