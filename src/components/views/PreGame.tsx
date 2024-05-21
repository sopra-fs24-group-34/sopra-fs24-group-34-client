import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import {
  connectWebSocket,
  disconnectWebSocket,
  getStompClient,
} from "./WebSocketService";
import { doHandleError } from "../../helpers/errorHandler";
import { toastContainerError } from "./Toasts/ToastContainerError";

const PreGame = () => {
  const [characters, setCharacters] = useState<string[]>([]);
  const gameId = localStorage.getItem("gameId");
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const [modalState, setModalState] = useState({
    isOpen: true,
    content: <GameModalContent />,
  });
  const [stompClient, setStompClient] = useState(getStompClient());

  // useEffect to fetch images from DB
  useEffect(() => {
    setIsCreator(JSON.parse(localStorage.getItem("isCreator")));
    const fetchImages = async () => {
      const stompClient = await connectWebSocket();
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

    fetchImages();
  }, []);

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
  const RemoveCharacter = async (idx, imageId) => {
    setLoading(true);
    try {
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

  const handleAcceptCharacters = async () => {
    setLoading(true);
    try {
      await api.post(`/games/${gameId}/acceptCharacters`);
      Navigate("/game");
    } catch (error) {
      toast.error(doHandleError(error));
    } finally {
      setLoading(false);
    }
  }

  // Returns either the grid to potentially replace characters or the actual game
  return (
    <BaseContainer className="game container">
      <ToastContainer {...toastContainerError} />
      {isCreator ? (
        <>
          <div className="character-grid">
            {characters.map((character, idx) => (
              <div className="character container" key={character.id}>
                <img
                  className="character container img"
                  src={character.url}
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
            onClick={() => handleAcceptCharacters()}
          >
            Accept characters
          </button>
          <ModalDisplay
            isOpen={modalState.isOpen}
            content={modalState.content}
            handleClose={handleCloseModal}
          />
        </>
      ) : (
        <div>
          <Spinner />
          <p>Waiting for the creator to accept the characters</p>
        </div>
      )}
    </BaseContainer>
  );
};

export default PreGame;
