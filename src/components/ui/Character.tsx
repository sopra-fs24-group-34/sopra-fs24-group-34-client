import React from "react";
import "../../styles/ui/Character.scss";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";


const Character = ({ func}) => {
  console.log(func)
  return (
  <Button
    onClick={() => func()}>
    <div  className="character">
    </div>
    </Button>)
/*
  <Button
  onClick={() => func(id)}>
  <div key={id} className="character">
    <img src={url}></img>
  </div>
  </Button>*/
};

Character.propTypes = {
  func: PropTypes.function
}

export default Character;
