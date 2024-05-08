import React from "react";
import PropTypes from "prop-types";
import "styles/views/Game-components/Character.scss";

const ModalPickInformation = () => {
  return (
    <>
      <p>
        {" "}
        Your pick was successful
        <div className="empty line"> </div>
        As soon as your opponent made his pick you can in turn ask each other
        questions and answer them.
      </p>
    </>
  );
};


export default ModalPickInformation;
