import React from "react";
import "../../styles/ui/Character.scss";
import PropTypes from "prop-types";

const Character = (props) => (
  <div key={props.id} className="character">
    <img src={props.url}></img>
  </div>
);

Character.propTypes = {
  id: PropTypes.number,
  url: PropTypes.string,
};

export default Character;