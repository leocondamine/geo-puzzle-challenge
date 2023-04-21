import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style";

const EndGame = () => {
  const navigate = useNavigate();

  const goToMenu = () => {
    navigate("/");
  };
  return (
    <div
      className={`${styles.fullscreenCenter} ${styles.flexDisposition} ${styles.colors}`}
    >
      <div>leader board coming soon ...</div>
      <button onClick={goToMenu} className="">
        Go to Menu
      </button>
    </div>
  );
};

export default EndGame;
