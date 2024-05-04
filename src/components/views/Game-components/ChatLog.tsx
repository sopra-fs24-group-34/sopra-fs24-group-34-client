import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import "../../../styles/views/Game-components/ChatLog.scss";
import PropTypes from "prop-types";
import BaseContainer from "../../ui/BaseContainer";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

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
  const gameId = localStorage.getItem("gameId");
  const userId = localStorage.getItem("userId");
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isQuestion, setIsQuestion] = useState<Boolean>(true);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    async function ws() {
      const socket = new SockJS("http://localhost:8080/ws");
      const stompClient = Stomp.over(socket);
      setStompClient(stompClient);

      await stompClient.connect({}, () => {
        console.log("Connected to WebSocket");
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      await stompClient.subscribe(`/games/${gameId}/chat`, (message) => {
        const body = JSON.parse(message.body);
        const header = body["event-type"];
        console.log("Header: ", header);
        const data = body.data;

        console.log("Received message:", data);
        setMessages((prevMessages) => [...prevMessages, data.message]);
      });

      /*
      const channel = pusherClient.subscribe(`gameRound${gameId}`);

      channel.bind("new_message", (response) => {
        console.log("Received message:", response);
        setMessages((prevMessages) => [...prevMessages, response]);
      });
      */

      return () => {
        disconnectWebsocket();
      };
    }
    ws();
  }, []);

  function disconnectWebsocket() {
    console.log("LEFT Game PAGE i hope");
    if (stompClient !== null) {
      stompClient.disconnect();
      setStompClient(null);
    }
  }

  /*
    pusherService.subscribeToChannel(
      `gameRound${gameId}`,
      "new_message",
      (data) => {
        //console.log("Received information:", data);
        //nedim-j: define first in backend, what gets returned. String with state not ideal, as we probably want more info exchanged than that
        console.log("Received message:", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    );
    
    return () => {
      pusherService.unsubscribeFromChannel(`gameRound${gameId}`);
    };
  }, []);*/

  const updateChat = async () => {
    try {
      const request = JSON.stringify({message: prompt, gameId: gameId, userId: userId});

      //console.log("MESSAGE: ", prompt);
      console.log("CHAT REQUEST: ", request);
      //await api.post(`/game/${gameId}/chat/${userId}`, request); // LiamK21: IDK if post/put; change URI
      stompClient.send("/app/sendMessage", {}, request);
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
