import React from "react";

const FeatureToGuess = (props) => {
  return <div className="fixed flex justify-center items-center z-10 bottom-0 left-0 bg-black h-12 w-full color-slate-500">{props.guess}</div>;
};

export default FeatureToGuess;
