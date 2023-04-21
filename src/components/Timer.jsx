import React, { useState, useEffect } from "react";

const Timer = ({ timerOn, onTimeStoped }) => {
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (timerOn) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      setIntervalId(interval);
    } else {
      clearInterval(intervalId);
      handleTimeScore(timer);
    }
  }, [timerOn]);

  const handleTimeScore = () => {
    onTimeStoped(timer);
  };

  return (
    <div className="color-slate-500 fixed right-0 top-12 z-10 flex h-12 w-[30%] items-center justify-center bg-black">
      Time: {timer}
    </div>
  );
};

export default Timer;
