import React from "react";
import PropTypes from "prop-types";
import "styles/views/Game-components/Character.scss";
import "styles/views/Lobby.scss";

const ModalGuessInformation = ({ strikes }) => {
  return (
    <>
      <p>Your guess is wrong!
        <div className="empty line"></div>
        You have {strikes} strikes left
      </p>
    </>
  );
};

ModalGuessInformation.propTypes = {
  characterUrl: PropTypes.String,
  strikes: PropTypes.Number,
};

export default ModalGuessInformation;
