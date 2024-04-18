import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import "../../../styles/views/Game-components/ChatLog.scss";
import "../../styles/ui/ChatLog.scss";
import PropTypes from "prop-types";
import BaseContainer from "../../ui/BaseContainer";
import PusherService from "./PusherService";

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
  const [gameId, setGameId] = useState<number>(null);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isQuestion, setIsQuestion] = useState<Boolean>(true);
  const pusherService = new PusherService();

  useEffect(() => {
      pusherService.subscribeToChannel("chat_channel", "new_message", (response) => {
        console.log("Received message:", response);
        setMessages(() => [...messages, response]);
    }); 
  
      return () => {
        pusherService.unsubscribeFromChannel("chat_channel");
      };
    }, []);

  // This should be the actual one
  // useEffect(() => {
  //   pusherService.subscribeToChannel(`GameChat${gameId}`, "new-message", (response) => {
  //     console.log("Received message:", response);
  //     // setMessages(() => [...messages, response]);
  //     setMessages(response); // LiamK21: depends on what is received
  // }); 

  //   return () => {
  //     pusherService.unsubscribeFromChannel("chat");
  //   };
  // }, []);

  // Updates the game log (needs to be changed)
  const updateChat = async () => {
    try {
      await api.post(`/game/${gameId}/chat/${localStorage.getItem("id")}`, {
        prompt}); // LiamK21: IDK if post/put; change URI
    } catch (error) {
      alert(
        `Something went wrong fetching the game chat: \n${handleError(error)}`
      );
    }
  };

  // Creates the question field as functional component
  const QField = () => {
    return (
      <div className="chat-log-input-container">
        <QuestionField
          value={prompt}
          onChange={(q: string) => setPrompt(q)}
        ></QuestionField>
        <button
          className="chat-log-send-button"
          disabled={!prompt}
          onClick={() => updateChat()}
        >
          Send
        </button>
      </div>
    );
  };

  // Creates the button-answer field as functional component
  const BoolField = () => {
    return (
      <div>
        <button
          className="chat-log-send-button"
          style={{ backgroundColor: "green" }}
          onClick={() => {
            setPrompt("yes");
            updateChat();
          }}
        >
          Yes
        </button>
        <button
          className="chat-log-send-button"
          style={{ backgroundColor: "red" }}
          onClick={() => {
            setPrompt("no");
            updateChat();
          }}
        >
          No
        </button>
      </div>
    );
  };


  return (
    <BaseContainer className="game-log">
      <BaseContainer className="game-log chat">
        {messages.map((message, index) => (
          <div className="text" key={index}>
            {message}
          </div>
        ))}
      </BaseContainer>
      <div className="chat-log-input-container">
        {isQuestion ? QField() : BoolField()}
      </div>
    </BaseContainer>
  );
};

export default ChatLog;
