import React, { useEffect, useState, useRef } from "react";
import { api, handleError } from "helpers/api";
import "../../../styles/views/Game-components/ChatLog.scss";
import PropTypes from "prop-types";
import BaseContainer from "../../ui/BaseContainer";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { getStompClient, makeSubscription, sendMessage, waitForConnection } from "../WebSocketService";

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


const ChatLog = ({ hasSentMessage, setHasSentMessage, updateInstruction }) => {
  const gameId = localStorage.getItem("gameId");
  const userId = localStorage.getItem("userId");
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isQuestion, setIsQuestion] = useState<Boolean>(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function ws() {

      const callback = function (message) {
        const body = JSON.parse(message.body);
        const header = body["event-type"];
        const data = body.data;

        console.log("Header: ", header, "\nReceived message: ", data.message);
        setMessages((prevMessages) => [...prevMessages, data.message]);
      };
      const subscription = await makeSubscription(`/games/${gameId}/chat`, callback);
    }

    ws();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const updateChat = async () => {
    try {
      const requestBody = JSON.stringify({
        message: prompt,
        gameId: gameId,
        userId: userId,
      });
      setHasSentMessage(true);
      sendMessage("/app/sendMessage", requestBody);
    } catch (error) {
      alert(
        `Something went wrong fetching the game chat: \n${handleError(error)}`
      );
    }
    setPrompt(""); // smailalijagic: clear textfield once message was sent
  };

  const switchTurn = () => {
      sendMessage("/app/switchTurn", JSON.stringify({ gameId: gameId }));
  }


        // Creates the question field as functional component
  const QField = () => {
    return (
      <div className="chat-log-input-container">
        <QuestionField
          value={prompt}
          onChange={(q: string) => setPrompt(q)}
        ></QuestionField>
          <div className="chat-log-button-container">

          <button
          className="chat-log-send-button"
          disabled={!prompt}
          onClick={() => updateChat()}
        >
          Send
        </button>
        {hasSentMessage && (
          <button
          className="chat-log-send-button"
          onClick={switchTurn}
          >
          Switch Turn
          </button>
        )}
          </div>
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
      <div
        className="chat-log-input-container"
        onKeyDown={(e) => {
          if (e.key === "Enter" && prompt) {
            updateChat();
          }
        }}
      >
        {isQuestion ? QField() : BoolField()}
      </div>
    </BaseContainer>
  );
};

ChatLog.propTypes = {
  updateInstruction: PropTypes.func,
  hasSentMessage: PropTypes.boolean,
  setHasSentMessage: PropTypes.func,
};

export default ChatLog;
