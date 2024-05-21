import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
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

const CharacterGrid = ({ persons, updateInstruction }) => {
  const navigate = useNavigate();
  const gameId = Number(localStorage.getItem("gameId"));
  const playerId = Number(localStorage.getItem("playerId"));
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<String>(null);
  const [roundNumber, setRoundNumber] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [maxStrikes, setMaxStrikes] = useState(Number(localStorage.getItem("maxStrikes")));
  const [timePerRound, setTimePerRound] = useState(Number(localStorage.getItem("timePerRound")));
  //nedim-j: data.gameStatus can be CHOOSING, GUESSING, END
  const [gameStatus, setGameStatus] = useState<String>("CHOOSING");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [visibleCharacters, setVisibleCharacters] = useState<Boolean[]>(
    persons.map((person) => true)
  );
  const [modalState, setModalState] = useState({
    isOpen: true,
    content: <ModalFirstInstructions />,
  });
  let timeoutThreshold = 10;

  useEffect(() => {
    setSelectedCharacter(localStorage.getItem("selectedCharacter"));
    async function ws() {
      if (playerId && gameId) {
        await waitForConnection();

        const callback = function (message) {
          const body = JSON.parse(message.body);
          const header = body["event-type"];
          console.log("Header: ", header);
          const data = body.data;

          setGameStatus(data.gameStatus);
          console.log(data);

          if (header === "round0") {
            if (data.roundNumber === 1) {
              setGameStatus("GUESSING");
              setCurrentTurnPlayerId(data.currentTurnPlayerId);
            }
          }
          //never called
          if (header === "turnUpdate") {
            console.log("Turn update: ", data);
            setCurrentTurnPlayerId(data);
          }

          if (header === "round-update") {
            setCurrentTurnPlayerId(data.roundDTO.currentTurnPlayerId);
            setRoundNumber(data.roundDTO.roundNumber);
            setStrikes(data.strikes);

            if (data.gameStatus === "END") {
              if ((data.guess === true && data.playerId === playerId) || (data.guess === false && data.playerId !== playerId)) {
                localStorage.setItem("result", "won");
              } else {
                localStorage.setItem("result", "lost");
              }
            
              cancelGameSubscriptions();
              //cancelSubscription(`/games/${gameId}`, subscription);
              navigate("/endscreen");
            }

            if (
              data.guess === false &&
              data.gameStatus !== "END" &&
              data.playerId === playerId &&
              data.strikes !== 0
            ) {
              setModalState({
                isOpen: true,
                content: <ModalGuessInformation strikes={data.strikes} maxStrikes={maxStrikes} />,
              });
            }
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

          } else if(header === "update-game-state") {
            console.log("Reconnected: ", data);
            setCurrentTurnPlayerId(data.currentTurnPlayerId);
            setRoundNumber(data.roundNumber);
          }
        };

        const subscription = await makeSubscription(
          `/games/${gameId}`,
          callback
        );

        return () => {

          cancelSubscription(`/games/${gameId}`, subscription);
          disconnectWebSocket();
        };
      }
    }
    ws();
  }, []);

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

      setModalState({
        isOpen: true,
        content: <ModalPickInformation />,
      });
      setGameStatus("WAITING_FOR_OTHER_PLAYER");
      setSelectedCharacter(characterId);
      localStorage.setItem("selectedCharacter", characterId);
      updateInstruction("Waiting for other player to pick a character");
    } catch (error) {
      toast.error(handleError(error), { containerId: "2" });
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
      alert("It's not your turn to guess!");

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
    /*
    setModalState({
      isOpen: true,
      content: <ModalGuessInformation strikes={response.data.strikes} />,
    });
    */
  };

  if (!persons) {
    return <div>Loading...</div>;
  }

  const handleCloseModal = () => {
    setModalState({ isOpen: false, content: null });
  };

  // Returns the grid with 20 characters. Each character receives the functionality.
  return (
    <BaseContainer className="character-grid">
      <ToastContainer containerId="2" {...toastContainerError} />
      {persons.map((character, idx) => (
        <Character
          key={character.id}
          character={character}
          visibleCharacter={visibleCharacters[idx]}
          gameStatus={gameStatus}
          pickCharacter={() => pickCharacter(character.id, idx)}
          foldCharacter={() => foldCharacter(idx)}
          guessCharacter={
            playerId === currentTurnPlayerId
              ? () => guessCharacter(character.id, idx)
              : () => {}
          }
          highlight={character.id === selectedCharacter ? true : false}
          currentTurnPlayerId={currentTurnPlayerId}
          playerId={playerId}
        />
      ))}
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

CharacterGrid.propTypes = {
  persons: PropTypes.array,
  updateInstruction: PropTypes.func,
};

export default CharacterGrid;
