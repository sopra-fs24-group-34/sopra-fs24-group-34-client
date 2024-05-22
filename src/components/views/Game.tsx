import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseContainer from "components/ui/BaseContainer";
import CharacterGrid from "./Game-components/CharacterGrid";
import ChatLog from "./Game-components/ChatLog";
import "styles/views/Game.scss";
import "styles/views/Game-components/CharacterGrid.scss";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import {
  connectWebSocket,
  disconnectWebSocket,
  getStompClient,
} from "./WebSocketService";
import { doHandleError } from "../../helpers/errorHandler";
import { toastContainerError } from "./Toasts/ToastContainerError";

const Game = () => {
  const [characters, setCharacters] = useState<string[]>([]);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [Instructions, setInstructions] = useState<String>("Pick a character");
  const [hasSentMessage, setHasSentMessage] = useState(false);  // state for the charactergrid/chatlog

  const fetchImages = async () => {
    const stompClient = await connectWebSocket();
    setLoading(true);
    const gameId = await localStorage.getItem("gameId");
    try {
      const response = await api.get(`/games/${gameId}/images`);
      setCharacters(response.data);
    } catch (error) {
      toast.error(doHandleError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsCreator(JSON.parse(localStorage.getItem("isCreator")));
    fetchImages();
  }, []);

  // useEffect to fetch images from DB

  return (
    <BaseContainer className="game container">
      <ToastContainer {...toastContainerError} />
      <div className="instructions">
        <h1>Current Instruction: {Instructions}</h1>
      </div>
      <div className="game">
        <CharacterGrid
          persons={characters}
          hasSentMessage={hasSentMessage}  // pass down the state
          setHasSentMessage={setHasSentMessage}  // pass down the state setter
          updateInstruction={setInstructions}
        />
        <ChatLog
          hasSentMessage={hasSentMessage}  // pass down the state
          setHasSentMessage={setHasSentMessage}  // pass down the state setter
          updateInstruction={setInstructions}
        />
      </div>
    </BaseContainer>
  );
};

export default Game;
