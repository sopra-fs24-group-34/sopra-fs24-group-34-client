import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ModalTimeout = ({ timeoutThreshold }) => {
  const [timeLeft, setTimeLeft] = useState(timeoutThreshold);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return (
    <div className="modal-timeout">
      <h2>Timeout</h2>
      <p>Users timeoud out. {timeLeft} seconds left before ending game!</p>
    </div>
  );
};

ModalTimeout.propTypes = {
  timeoutThreshold: PropTypes.number.isRequired,
};

export default ModalTimeout;
