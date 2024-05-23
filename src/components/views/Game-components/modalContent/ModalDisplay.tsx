import React from "react";
import PropTypes from "prop-types";
import "styles/views/Game-components/Character.scss";

const ModalDisplay = ({ isOpen, content, handleClose }) => {

  return isOpen ? (
    <div className="modal-overlay show" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Current Instructions</h2>
          <span className="close-btn" onClick={handleClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">{content}</div>
      </div>
    </div>
  ) : null;
};

ModalDisplay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  content: PropTypes.node,
  handleClose: PropTypes.func.isRequired,
};

export default ModalDisplay;
