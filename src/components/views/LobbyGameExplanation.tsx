import React from "react";
import "styles/views/Lobby.scss";

const LobbyGameExplanation = () => {
  return (
    <>
      <h2>How the game works:</h2>
      <p>
        {" "}
        &apos;Guess Who?&apos; is a turn based 1 vs 1 game, where each player
        picks a random character from a given set of characters and tries to
        figure out their opponent&apos;s pick. To narrow down the pool of
        possible characters each player may ask a yes-no-question regarding the
        character&apos;s physical features.
        <div className="empty-line"></div>
        If you think a character is not your opponent&apos;s pick you can fold
        it to have a better overview. If you think a character is your
        opponent&apos;s choice, you can make a guess.
        <div className="empty-line"></div>
        But careful! You only have a limited number of guesses.
      </p>
    </>
  );
};

export default LobbyGameExplanation;
