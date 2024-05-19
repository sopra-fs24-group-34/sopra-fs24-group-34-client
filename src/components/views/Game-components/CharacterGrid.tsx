import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
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
  cancelSubscription,
  getStompClient,
  makeSubscription,
  sendMessage,
  waitForConnection,
} from "../WebSocketService";
import ModalTimeout from "./modalContent/ModalTimeout";

const CharacterGrid = ({ persons }) => {
  const navigate = useNavigate();
  const gameId = Number(localStorage.getItem("gameId"));
  const playerId = Number(localStorage.getItem("playerId"));
  //nedim-j: data.gameStatus can be CHOOSING, GUESSING, END
  const [gameStatus, setGameStatus] = useState<String>("CHOOSING");
  const [visibleCharacters, setVisibleCharacters] = useState<Boolean[]>(
    persons.map((person) => true)
  );
  const [modalState, setModalState] = useState({
    isOpen: true,
    content: <ModalFirstInstructions />,
  });
  let timeoutThreshold = 10;
  //const [stompClient, setStompClient] = useState(getStompClient());

  useEffect(() => {
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
          if (header === "round-update") {
            if (data.guess === true && data.gameStatus === "END") {
              if (data.playerId === playerId) {
                localStorage.setItem("result", "won");
              } else {
                localStorage.setItem("result", "lost");
              }
              cancelSubscription(`/games/${gameId}`, subscription);
              navigate("/endscreen");
            }

            //nedim-j: is there a lock in the backend which prevents us from playing on?
            if (data.strikes === 3 && data.gameStatus === "END") {
              if (data.playerId === playerId) {
                localStorage.setItem("result", "lost");
              } else {
                localStorage.setItem("result", "won");
              }
              //cancelGameSubscriptions();
              cancelSubscription(`/games/${gameId}`, subscription);
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
                content: <ModalGuessInformation strikes={data.strikes} />,
              });
            }
          } else if(header === "user-timeout") {
            //make timeout-modal with timer running down
            timeoutThreshold = data;
            setModalState({
              isOpen: true,
              content: <ModalTimeout timeoutThreshold={timeoutThreshold}/>
            });
          } else if(header === "user-rejoined") {
            //close modal and stop timer
            setModalState({ isOpen: false, content: null });
          } else if(header === "user-disconnected") {
            //close game, set result as tied, navigate to endscreen
            localStorage.setItem("result", "tied");
            cancelSubscription(`/games/${gameId}`, subscription);
            navigate("/endscreen");
          }
        };

        const subscription = await makeSubscription(`/games/${gameId}`, callback);

        return () => {
          cancelSubscription(`/games/${gameId}`, subscription);
        };
      }
    }
    ws();
  }, []);

  async function pickCharacter(characterId, idx) {
    try {
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
      setGameStatus("IDLE");
    } catch (error) {
      alert(
        `Something went wrong choosing your character: \n${handleError(error)}`
      );
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
      {persons.map((character, idx) => (
        <Character
          key={character.id}
          character={character}
          visibleCharacter={visibleCharacters[idx]}
          gameStatus={gameStatus}
          pickCharacter={() => pickCharacter(character.id, idx)}
          foldCharacter={() => foldCharacter(idx)}
          guessCharacter={() => guessCharacter(character.id, idx)}
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
};

export default CharacterGrid;
