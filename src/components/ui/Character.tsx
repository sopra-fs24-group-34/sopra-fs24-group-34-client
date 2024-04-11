import React from "react";
import "../../styles/ui/Character.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";

// To make it work, delete <img> and key=
const Character = ({id, url, func }) => {
  <Button
  onClick={() => func(id)}>
  <div key={id} className="character">
    <img src={url}></img>
  </div>
  </Button>
};

Character.propTypes = {
  id: PropTypes.number,
  url: PropTypes.string,
};

export default Character;
