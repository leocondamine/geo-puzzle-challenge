import React, { useState, useEffect } from "react";

const Timer = ({ timerOn, onFetchTimer }) => {
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
      onFetchTimer && onFetchTimer(fetchTimerValue());
    }
  }, [timerOn, onFetchTimer]);

  const fetchTimerValue = () => {
    console.log(timer);
    return timer;
  };

  useEffect(() => {
    fetchTimerValue();
  }, [onFetchTimer]);

  return (
    <div className="color-slate-500 fixed right-0 top-12 z-10 flex h-12 w-[30%] items-center justify-center bg-black">
      Time: {timer}
    </div>
  );
};

export default Timer;
