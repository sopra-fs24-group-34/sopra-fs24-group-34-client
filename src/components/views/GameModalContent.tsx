import React from "react";
import "styles/views/Lobby.scss";

const GameModalContent = () => {
  return (
    <p>
      Before starting the game you may need to replace certain characters.
      <div className="empty line"> </div>
      By hovering over a character, a button appears which replaces the current
      character picture with a new one. If you think the characters are all
      good, you can click the &apos;Accept Characters&apos; button on the right.
      <div className="empty line"> </div>
      Have fun!
    </p>
  );
};

export default GameModalContent;
