import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import "styles/views/PreGame.scss";
import "styles/views/Game-components/CharacterGrid.scss";
import GameModalContent from "./GameModalContent";
import ModalDisplay from "./Game-components/modalContent/ModalDisplay";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import {
  cancelSubscription,
  connectWebSocket,
  disconnectWebSocket,
  getStompClient,
  makeSubscription,
  sendMessage,
} from "./WebSocketService";
import { doHandleError } from "../../helpers/errorHandler";
import { toastContainerError } from "./Toasts/ToastContainerError";

const PreGame = () => {
  const [characters, setCharacters] = useState<string[]>([]);
  const gameId = localStorage.getItem("gameId");
  const userId = localStorage.getItem("userId");
  const userToken = localStorage.getItem("userToken");
  const lobbyId = localStorage.getItem("lobbyId");
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [modalState, setModalState] = useState({
    isOpen: false,
    content: <GameModalContent />,
  });
  const [stompClient, setStompClient] = useState(getStompClient());

  useEffect(() => {
    setIsCreator(JSON.parse(localStorage.getItem("isCreator")));
    async function ws() {
      if (userId && lobbyId && (isCreator === true || isCreator === false)) {
        const stompClient = await connectWebSocket();

        const callback = function (message) {
          const body = JSON.parse(message.body);
          const header = body["event-type"];
          const data = body.data;
          console.log("Header: ", header);
          console.log("Data: ", data);

          if (header === "game-started") {
            cancelSubscription(`/lobbies/${lobbyId}`, subscription);
            navigate("/game");
          } else if (header === "user-left") {
            console.log("User left: ", data.id);
            //nedim-j: if someone leaves, the game is cancelled, remaining players are redirected to the menu, localstorage: everything apart from userId and usertoken is cleared
            //handle for guests!!!
            handleCancelledGame();
            navigate("/menu");
          } else if (header === "game-cancelled") {
            console.log("Game cancelled");
            handleCancelledGame();
            navigate("/menu");
          } else {
            console.log("Unknown message from WS");
            localStorage.clear();
            navigate("/landingPage");
          }
        };

        const subscription = await makeSubscription(
          `/lobbies/${lobbyId}`,
          callback
        );
      }
    }

    ws();
  }, []);

  // useEffect to fetch images from DB
  useEffect(() => {
    const fetchImages = async () => {
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

  const handleOpenModal = () => {
    setModalState({ isOpen: true, content: <GameModalContent /> });
  };

  const handleAcceptCharacters = async () => {
    setLoading(true);
    try {
      const auth = {
        id: userId,
        token: userToken,
      };

      const requestBody = JSON.stringify({
        lobbyId: lobbyId,
        gameId: gameId,
        authenticationDTO: auth,
      });

      sendMessage("/app/startGame", requestBody);

      navigate("/game");
    } catch (error) {
      toast.error(doHandleError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelledGame = async () => {
    localStorage.removeItem("lobbyId");
    localStorage.removeItem("gameId");
    localStorage.removeItem("users");
    localStorage.removeItem("playerId");
    localStorage.removeItem("isCreator");
    localStorage.removeItem("result");
    localStorage.removeItem("maxStrikes");
    localStorage.removeItem("timePerRound");
    localStorage.removeItem("selectedCharacter");
    disconnectWebSocket();
  };

  // Returns either the grid to potentially replace characters or the actual game
  return (
    <>
      {isCreator ? (
        <BaseContainer className="pregame container">
          <ToastContainer {...toastContainerError} />
          <div className="header">
            <div className="instructions">
              <h1>Current Instruction: Remove unsuited characters</h1>
            </div>
            <Button className="help-button" onClick={() => handleOpenModal()}>
              ?
            </Button>
          </div>

          <div className="game">
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
            <div className="button">
              <Button
                className="accept-character-button"
                onClick={() => handleAcceptCharacters()}
              >
                Accept characters
              </Button>
            </div>

            <ModalDisplay
              isOpen={modalState.isOpen}
              content={modalState.content}
              handleClose={handleCloseModal}
            />
          </div>
        </BaseContainer>
      ) : (
        <div>
          <Spinner />
          <div className="pregame waiting-container">
            <h1>Waiting for the creator to accept the characters</h1>
          </div>
        </div>
      )}
    </>
  );
};

export default PreGame;
