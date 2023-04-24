import React, { useState, useEffect } from "react";
import styles from "../style";

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
    <div
      className={`${styles.frameStyle} fixed right-4 top-20 z-10 flex h-12 w-[30%]`}
    >
      Time : {timer}
    </div>
  );
};

export default Timer;
