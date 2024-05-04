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

const CharacterGrid = ({ persons }) => {
  const navigate = useNavigate();
  const gameId = Number(localStorage.getItem("gameId"));
  const playerId = Number(localStorage.getItem("playerId"));
  //nedim-j: data.roundStatus can be CHOOSING, GUESSING, END
  const [currentRound, setCurrentRound] = useState<String>("CHOOSING");
  const [visibleCharacters, setVisibleCharacters] = useState<Boolean[]>(
    persons.map((person) => true)
  );
  const [modalState, setModalState] = useState({
    isOpen: true,
    content: <ModalFirstInstructions />,
  });
  const [stompClient, setStompClient] = useState(null);

  //nedim-j: websockets
  useEffect(() => {
    async function ws() {

      if (playerId && gameId) {
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);
        setStompClient(stompClient);

        await stompClient.connect({}, () => {
          console.log("Connected to WebSocket");
        });

        await new Promise((resolve) => setTimeout(resolve, 500));
        await stompClient.subscribe(`/games/${gameId}`, (message) => {
          const body = JSON.parse(message.body);
          const header = body["event-type"];
          console.log("Header: ", header);
          const data = body.data;

          setCurrentRound(data.roundStatus);
          if (data.guess === true && data.roundStatus === "END") {
            if (data.playerId === playerId) {
              localStorage.setItem("result", "won");
            } else {
              localStorage.setItem("result", "lost");
            }
            navigate("/endscreen");
          }

          if (data.strikes === 3 && data.roundStatus === "END") {
            if (data.playerId === playerId) {
              localStorage.setItem("result", "lost");
            } else {
              localStorage.setItem("result", "won");
            }
            navigate("/endscreen");
          }
        });
      }

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
  // Leave commented out for the moment
  useEffect(() => {
    pusherService.subscribeToChannel(
      `gameRound${gameId}`,
      "round-update",
      (data) => {
        console.log("Received information:", data);
        //nedim-j: define first in backend, what gets returned. String with state not ideal, as we probably want more info exchanged than that
        setCurrentRound(data.roundStatus);
        if (data.guess === true && data.roundStatus === "END") {
          if (data.playerId === playerId) {
            localStorage.setItem("result", "won");
          } else {
            localStorage.setItem("result", "lost");
          }
          navigate("/endscreen");
        }

        if (data.strikes === 3 && data.roundStatus === "END") {
          if (data.playerId === playerId) {
            localStorage.setItem("result", "lost");
          } else {
            localStorage.setItem("result", "won");
          }
          navigate("/endscreen");
        }
      }
    );

    return () => {
      pusherService.unsubscribeFromChannel(`gameRound${gameId}`);
    };
  }, []);

  */

  const pickCharacter = async (characterId, idx) => {
    try {
      const send = JSON.stringify({
        gameid: gameId,
        playerid: playerId,
        imageid: characterId,
      });
      //setCurrentRound("GUESSING");
      console.log("PICKCHARACTER:", send);
      await api.put("/game/character/choose", send);
      setModalState({
        isOpen: true,
        content: <ModalPickInformation />,
      });
    } catch (error) {
      alert(`Something went wrong choosing your pick: \n${handleError(error)}`);
    }
  };

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
    const send = JSON.stringify({
      gameid: gameId,
      playerid: playerId,
      imageid: characterId,
    });
    const response = await api.post("/game/character/guess", send);
    setModalState({
      isOpen: true,
      content: <ModalGuessInformation strikes={response.data.strikes} />,
    });
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
          currentRound={currentRound}
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
