import React from "react";
import "styles/views/Lobby.scss";

const ModalFirstInstructions = () => {
  return (
    <p>
      You made it to the game!
      <div className="empty line"> </div>
      On the left hand side of your screen the characters are displayed. First,
      you need to pick one for your opponent to guess. Then you can start
      guessing your opponents character. On the right hand side you can find the
      Chat, where you and your opponent ask each other questions to figure out
      your picks. After asking the question and receiving an satisfactory answer, click on switch turn.
      IMPORTANT: you can either use the chat or guess in one turn!
      <div className="empty line"> </div>
      Have fun!
    </p>
  );
};

export default ModalFirstInstructions;
