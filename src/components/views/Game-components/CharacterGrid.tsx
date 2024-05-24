import React, { useEffect, useState } from "react";
import { handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/views/Game-components/CharacterGrid.scss";
import PropTypes from "prop-types";
import BaseContainer from "../../ui/BaseContainer";
import Character from "./Character";
import ModalDisplay from "./modalContent/ModalDisplay";
import ModalFirstInstructions from "./modalContent/ModalFirstInstructions";
import ModalGuessInformation from "./modalContent/ModalGuessInformation";
import ModalPickInformation from "./modalContent/ModalPickInformation";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import {
  cancelGameSubscriptions,
  cancelSubscription,
  connectWebSocket,
  disconnectWebSocket,
  getStompClient,
  makeSubscription,
  sendMessage,
  waitForConnection,
} from "../WebSocketService";
import ModalTimeout from "./modalContent/ModalTimeout";
import { toastContainerError } from "../Toasts/ToastContainerError";

const CharacterGrid = ({
  persons,
  hasSentMessage,
  setHasSentMessage,
  updateInstruction,
  updateModal,
  currentTurnPlayerId,
  setCurrentTurnPlayerId,
}) => {
  const navigate = useNavigate();
  const gameId = Number(localStorage.getItem("gameId"));
  const playerId = Number(localStorage.getItem("playerId"));
  const [roundNumber, setRoundNumber] = useState(0);
  const [lastChance, setLastChance] = useState(false);
  const [maxStrikes, setMaxStrikes] = useState(
    Number(localStorage.getItem("maxStrikes"))
  );
  //nedim-j: data.gameStatus can be CHOOSING, GUESSING, END
  const [gameStatus, setGameStatus] = useState<String>("CHOOSING");
  const storedCharacterId = Number(localStorage.getItem("selectedCharacter"));
  const [selectedCharacter, setSelectedCharacter] = useState(
    !isNaN(storedCharacterId) && storedCharacterId !== 0
      ? storedCharacterId
      : null
  );
  const [visibleCharacters, setVisibleCharacters] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    content: <ModalFirstInstructions />,
  });
  let timeoutThreshold = 10;

  useEffect(() => {
    async function ws() {
      await waitForConnection();

      const callback = function (message) {
        const body = JSON.parse(message.body);
        const header = body["event-type"];
        const data = body.data;

        if (data.gameStatus === "END") {
          if (
            (data.guess === true && data.playerId === playerId) ||
            (data.guess === false && data.playerId !== playerId)
          ) {
            localStorage.setItem("result", "won");
          } else {
            localStorage.setItem("result", "lost");
          }
          cancelGameSubscriptions();
          //cancelSubscription(`/games/${gameId}`, subscription);
          navigate("/endscreen");
        } else if (
          data.guess === false &&
          data.gameStatus !== "END" &&
          data.playerId === playerId &&
          data.strikes !== 0
        ) {
          toast.warning(`Incorrect guess! ${data.strikes} / ${maxStrikes}`, {
            containerId: "grid",
          });
          updateModal({
            isOpen: false,
            content: (
              <ModalGuessInformation
                strikes={data.strikes}
                maxStrikes={maxStrikes}
              />
            ),
          });
        } else if (header === "round0") {
          if (data.roundNumber === 1) {
            setGameStatus("GUESSING");
            setCurrentTurnPlayerId(data.currentTurnPlayerId);
            instructionUpdate(data);
          }
        } else if (header === "turn-update") {
          setCurrentTurnPlayerId(data.currentTurnPlayerId);
          setHasSentMessage(false);
          if (!lastChance) {
            instructionUpdate(data);
          }
        } else if (header === "round-update") {
          setCurrentTurnPlayerId(data.currentTurnPlayerId);
          setRoundNumber(data.roundNumber);
          setHasSentMessage(false);
          if (!lastChance) {
            instructionUpdate(data);
          }
        } else if (data.gameStatus === "LASTCHANCE") {
          setLastChance(true);
          if (data.playerId !== playerId) {
            updateInstruction("Oppenent guessed correctly.Your last try!");
          } else {
            updateInstruction("Correct Guess! Oppenent has one last try");
          }
        } else if (data.gameStatus === "TIE") {
          localStorage.setItem("result", "tie");
          cancelGameSubscriptions();
          navigate("/endscreen");
        } else if (header === "user-timeout") {
          //make timeout-modal with timer running down
          timeoutThreshold = data;
          setModalState({
            isOpen: true,
            content: <ModalTimeout timeoutThreshold={timeoutThreshold} />,
          });
        } else if (header === "user-rejoined") {
          //close modal and stop timer
          setModalState({ isOpen: false, content: null });
        } else if (header === "user-disconnected") {
          //close game, set result as tied, navigate to endscreen
          localStorage.setItem("result", "tied");
          cancelGameSubscriptions();
          //cancelSubscription(`/games/${gameId}`, subscription);
          navigate("/endscreen");
        } else if (header === "update-game-state") {

          setRoundNumber(data.roundNumber);
          if (data.currentTurnPlayerId) {
            setCurrentTurnPlayerId(data.currentTurnPlayerId);
          }
          if (selectedCharacter === null) {
            setGameStatus("CHOOSING");
          } else if (data.event === "CHOOSING") {
            setGameStatus("WAITING_FOR_OTHER_PLAYER");
          } else {
            setGameStatus(data.event);
          }
        } else {
          console.error("Unhandled WS event: ", header, data);
        }
      };

      const subscription = await makeSubscription(`/games/${gameId}`, callback);
    }

    if (persons.length > 0 && playerId && gameId) {
      setVisibleCharacters(Array(persons.length).fill(true)); // Initialize as visible
      ws();
    }
  }, [persons]);

  const instructionUpdate = (data) => {
    if (data.currentTurnPlayerId === playerId) {
      updateInstruction("Your turn! Guess or use the chat");
    } else {
      updateInstruction("Opponents turn");
    }
  };

  async function pickCharacter(characterId, idx) {
    try {
      const playerId = Number(localStorage.getItem("playerId"));

      const guessPostDTO = {
        gameid: gameId,
        playerid: playerId,
        imageid: characterId,
      };
      const requestBody = JSON.stringify({
        guessPostDTO: guessPostDTO,
      });
      sendMessage("/app/chooseImage", requestBody);

      updateModal({
        isOpen: false,
        content: <ModalPickInformation />,
      });
      setGameStatus("WAITING_FOR_OTHER_PLAYER");
      setSelectedCharacter(characterId);
      localStorage.setItem("selectedCharacter", characterId);
      updateInstruction("Waiting for other player to pick a character");
    } catch (error) {
      toast.error(handleError(error), { containerId: "grid" });
    }
  }

  // Func to fold / unfold a character
  const foldCharacter = (characterIndex) => {
    setVisibleCharacters((prevVisibleCharacters) => {
      const newVisibleCharacters = [...prevVisibleCharacters];
      newVisibleCharacters[characterIndex] =
        !newVisibleCharacters[characterIndex];

      return newVisibleCharacters;
    });
  };

  // Func to guess a character
  const guessCharacter = async (characterId, idx) => {
    if (playerId !== currentTurnPlayerId) {
      toast.error("It's not your turn to guess!", { containerId: "grid" });

      return;
    }
    if (hasSentMessage) {
      // check if a message has been sent
      toast.error("You cannot make a guess after sending a message!", {
        containerId: "grid",
      });

      return;
    }
    const guessPostDTO = {
      gameid: gameId,
      playerid: playerId,
      imageid: characterId,
    };
    const requestBody = JSON.stringify({
      guessPostDTO: guessPostDTO,
    });
    sendMessage("/app/guessImage", requestBody);
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, content: null });
  };

  useEffect(() => {
    displayGame();
  }, [gameStatus]);

  // Returns the grid with 20 characters. Each character receives the functionality.
  function displayGame() {
    return (
      <>
        <ToastContainer containerId="grid" {...toastContainerError} />
        <BaseContainer className="character-grid">
          {persons.map((character, idx) => (
            <Character
              key={character.id}
              character={character}
              visibleCharacter={visibleCharacters[idx]}
              gameStatus={gameStatus}
              pickCharacter={() => pickCharacter(character.id, idx)}
              foldCharacter={() => foldCharacter(idx)}
              guessCharacter={
                playerId === currentTurnPlayerId && !hasSentMessage
                  ? () => guessCharacter(character.id, idx)
                  : () => {}
              }
              highlight={character.id === selectedCharacter ? true : false}
              currentTurnPlayerId={currentTurnPlayerId}
              playerId={playerId}
              hasSentMessage={hasSentMessage}
            />
          ))}
          <ModalDisplay
            isOpen={modalState.isOpen}
            content={modalState.content}
            handleClose={handleCloseModal}
          />
        </BaseContainer>
      </>
    );
  }

  return displayGame();
};

CharacterGrid.propTypes = {
  persons: PropTypes.array,
  updateInstruction: PropTypes.func,
  hasSentMessage: PropTypes.bool,
  setHasSentMessage: PropTypes.func,
  updateModal: PropTypes.func,
  currentTurnPlayerId: PropTypes.number,
  setCurrentTurnPlayerId: PropTypes.func,
};

export default CharacterGrid;
