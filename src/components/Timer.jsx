import React, { useState, useEffect } from "react";

const Timer = ({ startTimer }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (startTimer) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [startTimer]);

  return (
    <div className="fixed flex justify-center items-center z-10 top-12 right-0 bg-black h-12 w-[30%] color-slate-500">
      Time: {timer}
    </div>
  );
};

export default Timer;
