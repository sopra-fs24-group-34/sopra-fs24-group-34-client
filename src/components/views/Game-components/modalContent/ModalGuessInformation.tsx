import React from "react";
import PropTypes from "prop-types";
import "styles/views/Game-components/Character.scss";
import "styles/views/Lobby.scss";

const ModalGuessInformation = ({ strikes, maxStrikes }) => {
  return (
    <>
      <p>Your guess is wrong!
        <div className="empty line"></div>
        You have {strikes} / {maxStrikes} strikes left
      </p>
    </>
  );
};

ModalGuessInformation.propTypes = {
  characterUrl: PropTypes.string,
  strikes: PropTypes.number,
  maxStrikes: PropTypes.number,
};

export default ModalGuessInformation;
