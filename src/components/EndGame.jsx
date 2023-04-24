import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style";

const EndGame = () => {
  const navigate = useNavigate();

  const goToMenu = () => {
    navigate("/");
  };
  return (
    <div className={`flex ${styles.fullscreen} ${styles.center}`}>
      <div className={`flex ${styles.frameStyle} h-[80%] w-[80%]`}>
        <div>leader board coming soon ...</div>
        <button
          onClick={goToMenu}
          className="text-2xl duration-300 ease-in-out hover:scale-110"
        >
          Go to Menu
        </button>
      </div>
    </div>
  );
};

export default EndGame;
