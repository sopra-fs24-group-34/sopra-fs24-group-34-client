import React from "react";
import "styles/views/Lobby.scss";

const ModalFirstInstructions = () => {
  return (
    <p>
      Before starting the game you may need to replace certain characters.
      <div className="empty line"> </div>
      By hovering over a character, a button appears which replaces the current
      character picture with a new one. If you think the characters are all
      good, you can click the "Accept Characters" button on the right.
      <div className="empty line"> </div>
      Have fun!
    </p>
  );
};

export default ModalFirstInstructions;
