import React from "react";
import { useNavigate } from "react-router-dom";

const EndGame = () => {
  const navigate = useNavigate();

  const goToMenu = () => {
    navigate("/");
  };
  return (
    <div className="fixed flex justify-center items-center gap-4 z-10 top-12 left-0 bg-black h-12 w-[30%] color-slate-500">
      <button onClick={goToMenu} className="your-button-classes">
        Go to Menu
      </button>
    </div>
  );
};

export default EndGame;
