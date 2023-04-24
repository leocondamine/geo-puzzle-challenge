import React from "react";
import styles from "../style";

const FeatureToGuess = ({ guess }) => {
  return (
    <div
      className={`${styles.frameStyle} fixed bottom-4 left-[20%] z-10 flex h-16 w-[60%]`}
    >
      {guess}
    </div>
  );
};

export default FeatureToGuess;
