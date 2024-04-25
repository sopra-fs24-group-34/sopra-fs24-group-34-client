import React from "react";
import PropTypes from "prop-types";
import "styles/views/Game-components/Character.scss";

const ModalPickInformation = (characterUrl) => {
  return (
    <>
      <p> You picked</p>
      <div className="character container">
        <img className="character container img" src={characterUrl}>
          {" "}
        </img>
      </div>
    </>
  );
};
ModalPickInformation.proptypes = {
  characterUrl: PropTypes.String,
};

export default ModalPickInformation;
