import React, { useState, useEffect } from "react";

const Timer = ({ startTimer, onTimeStoped }) => {
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (startTimer) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      setIntervalId(interval);
    } else {
      clearInterval(intervalId);
      handleEndTime(timer);
    }
  }, [startTimer]);

  const handleEndTime = () => {
    onTimeStoped(timer);
  };

  return (
    <div className="fixed flex justify-center items-center z-10 top-12 right-0 bg-black h-12 w-[30%] color-slate-500">
      Time: {timer}
    </div>
  );
};

export default Timer;
