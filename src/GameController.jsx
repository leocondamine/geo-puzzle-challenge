import React, { useEffect, useState } from "react";
import MapDisplay from "./components/MapDisplay";

const GameController = () => {
  const [selectedFeature, setSelectedFeature] = useState([]);
  const [featuresToGuess, setFeaturesToGuess] = useState([
    "France",
    "Italy",
    "Spain",
  ]);
  const [guess, setGuess] = useState(featuresToGuess[0]);

  const handleMapData = (data) => {
    setSelectedFeature(data);
  };

  useEffect(() => {
    console.log(selectedFeature);
    console.log(guess);
    if (selectedFeature === guess) {
      console.log("Guessed right !!! ");
      setNewGuess();
    }
  }, [selectedFeature]);

  const setNewGuess = () => {
    setFeaturesToGuess(featuresToGuess.slice(1));
    console.log(featuresToGuess);
    if (featuresToGuess.length > 1) {
      setGuess(featuresToGuess[1]);
      console.log(guess);
    } else {
      setGameIsFinished();
    }
  };
  // useEffect(() => {console.log(guess)},[guess]); // DEBUG

  const setGameIsFinished = () => {
    console.log("the game is finished");
  };

  return <MapDisplay onFeatureClicked={handleMapData} />;
};

export default GameController;
