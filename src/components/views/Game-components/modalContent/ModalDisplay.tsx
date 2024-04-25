import React, { useState } from "react";
import PropTypes from "prop-types";
import "styles/views/Game-components/Character.scss";

const ModalDisplay = ({ content }) => {
  const [showModal, setShowModal] = useState<Boolean>(false);
  const [modalContent, setModalContent] = useState(content);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div
      className={`modal-overlay ${showModal ? "show" : ""}`}
      onClick={() => toggleModal()}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Current Instructions</h2>
          <span
            className="close-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleModal();
            }}
          >
            &times;
          </span>
        </div>
        <div className="modal-body">{modalContent}</div>
      </div>
    </div>
  );
};

ModalDisplay.propTypes = {
  content: PropTypes.JSX
};

export default ModalDisplay;
