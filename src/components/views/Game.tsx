import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseContainer from "components/ui/BaseContainer";
import CharacterGrid from "./Game-components/CharacterGrid";
import ChatLog from "./Game-components/ChatLog";
import ModalDisplay from "./Game-components/modalContent/ModalDisplay";
import ModalFirstInstructions from "./Game-components/modalContent/ModalFirstInstructions";
import "styles/views/Game.scss";
import "styles/views/Game-components/CharacterGrid.scss";
import {
  connectWebSocket,
} from "./WebSocketService";
import { doHandleError } from "../../helpers/errorHandler";
import { toastContainerError } from "./Toasts/ToastContainerError";

const Game = () => {
  const [characters, setCharacters] = useState<string[]>([]);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [Instructions, setInstructions] = useState<String>("Pick a character");
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    content: <ModalFirstInstructions />,
  });
  const [hasSentMessage, setHasSentMessage] = useState(false); // state for the charactergrid/chatlog

  const fetchImages = async () => {
    const stompClient = await connectWebSocket();
    setLoading(true);
    const gameId = await localStorage.getItem("gameId");
    try {
      const response = await api.get(`/games/${gameId}/images`);
      setCharacters(response.data);
    } catch (error) {
      toast.error(doHandleError(error), { containerId: "game" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsCreator(JSON.parse(localStorage.getItem("isCreator")));
    setCurrentTurnPlayerId(Number(localStorage.getItem("currentTurnPlayerId"))); // Initialize from localStorage
    fetchImages();
  }, []);

  // useEffect to fetch images from DB

  const handleOpenModal = () => {
    setModalState({ isOpen: true, content: modalState["content"] });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, content: modalState["content"] });
  };

  return (
    <BaseContainer className="game container">
      <ToastContainer containerId="game" {...toastContainerError} />
      <div className="header">
        <div className="instructions">
          <h1>Current Instruction: {Instructions}</h1>
        </div>
        <Button className="help-button" onClick={() => handleOpenModal()}>
          &#63;
        </Button>
      </div>
      <div className="game">
        <CharacterGrid
          persons={characters}
          hasSentMessage={hasSentMessage} // pass down the state
          setHasSentMessage={setHasSentMessage} // pass down the state setter
          updateInstruction={setInstructions}
          updateModal={setModalState}
          currentTurnPlayerId={currentTurnPlayerId} // pass current turn player ID
          setCurrentTurnPlayerId={setCurrentTurnPlayerId}
        />
        <ChatLog
          hasSentMessage={hasSentMessage} // pass down the state
          setHasSentMessage={setHasSentMessage} // pass down the state setter
          currentTurnPlayerId={currentTurnPlayerId} // pass current turn player ID

        />
        <ModalDisplay
          isOpen={modalState.isOpen}
          content={modalState.content}
          handleClose={handleCloseModal}
        />
      </div>
    </BaseContainer>
  );
};

export default Game;
