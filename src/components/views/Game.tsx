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
import GameModalContent from "./GameModalContent";
import ModalDisplay from "./Game-components/modalContent/ModalDisplay";
import { disconnectWebSocket, getStompClient, sendMessage, waitForConnection, makeSubscription, cancelSubscription } from "./WebSocketService";
import { doHandleError } from "../../helpers/errorHandler";
import { toastContainerError } from "./Toasts/ToastContainerError";

const Game = () => {
  const [characters, setCharacters] = useState<string[]>([]);
  const [hasAccepted, setHasAccepted] = useState<Boolean>(false);
  const gameId = localStorage.getItem("gameId");
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);


  const [modalState, setModalState] = useState({
    isOpen: true,
    content: <GameModalContent />,
  });
  const [stompClient, setStompClient] = useState(getStompClient());

  // useEffect to fetch images from DB
  const fetchCharacters = async () => {
    setLoading(true);
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
    const initializeWebSocket = async () => {

      setIsCreator(JSON.parse(localStorage.getItem("isCreator")));
      await fetchCharacters();
      await waitForConnection();

      const callback = (message) => {
        const body = JSON.parse(message.body);
        handleIncomingMessage(body);
      };
      const subscription = await makeSubscription(`/games/${gameId}`, callback);

      return () => {
        cancelSubscription(`/games/${gameId}`, subscription);
        disconnectWebSocket();
      };
    };

    initializeWebSocket();
  }, []);


  const handleIncomingMessage = (body) => {
    const eventType = body["event-type"];

    if (eventType === "acceptCharacters") {
      fetchCharacters();
      setHasAccepted(true);
    }
  };
  const handleAcceptCharacters = () => {
    const gameId = String(localStorage.getItem("gameId"));
    if (stompClient) {
      sendMessage("/app/acceptCharacters", JSON.stringify({ gameId }));
    }
  };
  // function to display an overlay which should replace a character
  const ReplaceCharacter = (idx, id) => {
    return (
      <div className="character overlay">
        <button
          className="character-button"
          onClick={() => RemoveCharacter(idx, id)}
        >
          Replace
        </button>
      </div>
    );
  };

  // function to remove and set a new character at that place
  // No idea if this is correct (might need a reload)
  const RemoveCharacter = async (idx, imageId) => {
    setLoading(true);
    try {
      /* const response = await api.delete(`/games/${gameId}/images/${imageId}`);
      setCharacters((prevCharacters) => {
        const newCharacters = [...prevCharacters];
        newCharacters[idx] = response.data;

      return newCharacters;
    }); */
      await api.delete(`/games/${gameId}/images/${imageId}`);
      const response = await api.get(`/games/${gameId}/images`);
      setCharacters(response.data);
    } catch (error) {
      toast.error(doHandleError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, content: null });
  };

  // Returns either the grid to potentially replace characters or the actual game
  return (
    <BaseContainer className="game container">
      <ToastContainer {...toastContainerError} />
      {hasAccepted ? (
        <>
          <CharacterGrid persons={characters} />
          <ChatLog />
        </>
      ) : (
        <>
          <div className="character-grid">
            {characters.map((character, idx) => (
              <div className="character container" key={character.id}>
                <img
                  className="character container img"
                  src={character.url}
                  alt={`character-${idx}`}
                ></img>
                {isCreator && (
                  <div className="character overlay">
                    {ReplaceCharacter(idx, character.id)}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            className="accept-character-button"
            onClick={handleAcceptCharacters}
            disabled={!isCreator}
          >
            {isCreator ? "Accept characters" :"Waiting for host to accept characters"}
          </button>
        </>
      )}
      {
        <ModalDisplay
          isOpen={modalState.isOpen}
          content={modalState.content}
          handleClose={handleCloseModal}
        />
      }
    </BaseContainer>
  );
};

export default Game;
