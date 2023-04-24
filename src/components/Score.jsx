import React from "react";
import styles from "../style";

const Score = ({ score }) => {
  if (score.totalTries === 0) {
    return (
      <div
        className={`${styles.frameStyle} fixed right-4 top-4 z-10 flex h-12 w-[30%]`}
      >
        Let's go !!!
      </div>
    );
  }
  return (
    <div
      className={`${styles.frameStyle} fixed right-4 top-4 z-10 flex h-12 w-[30%]`}
    >
      Score : {parseInt((score.rows / score.totalTries) * 100)}
    </div>
  );
};

export default Score;
