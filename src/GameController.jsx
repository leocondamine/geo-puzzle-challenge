import React, { useEffect, useState } from "react";
import MapDisplay from "./components/MapDisplay";
import FeatureToGuess from "./components/FeatureToGuess";
import Score from "./components/Score";

const GameController = ({ gameURL }) => {
  const [selectedFeature, setSelectedFeature] = useState([]);
  const [featuresToGuess, setFeaturesToGuess] = useState([]);
  const [guess, setGuess] = useState([]);
  const [nbrOfTries, setNbrOfTries] = useState(0);
  const [blinkFeature, setBlinkFeature] = useState("");
  const [changeFeatureColor, setChangeFeatureColor] = useState("");
  const [score, setScore] = useState({ rows: 0, totalTries: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!gameURL) return;
      fetch(gameURL)
        .then((response) => response.json())
        .then((data) => {
          const names = data.features.map((feature) => feature.properties.NAME);
          console.log(names[0]);
          setFeaturesToGuess(names);
          setGuess(names[0]);
        })
        .catch((error) => console.error(error));
    };

    fetchData();
  }, [gameURL]);

  const handleMapData = (data) => {
    setSelectedFeature(data);
  };

  useEffect(() => {
    try {
      if (selectedFeature.length === 0) {
        return;
      } else if (!featuresToGuess.includes(selectedFeature)) {
        return;
      } else {
        checkGuess();
        if (nbrOfTries === 3) {
          setBlinkFeature({ feature: guess, color: "red", isInfinite: true });
          console.log("tu es nul gros nullos");
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [selectedFeature]);

  const checkGuess = () => {
    if (selectedFeature === guess) {
      console.log("Guessed right !!! ");
      const guessFound = guess;
      const nbrFound = nbrOfTries;
      changeStateFeatureColor(nbrFound, guessFound);
      setScore({ rows: score.rows + 1, totalTries: score.totalTries + 1 });
      setNewGuess();
    } else {
      console.log("wrong choice");
      setBlinkFeature({
        feature: selectedFeature,
        color: "red",
        isInfinite: false,
      });
      setScore({ rows: score.rows, totalTries: score.totalTries + 1 });
      setNbrOfTries(nbrOfTries + 1);
    }
  };

  const setNewGuess = () => {
    const remainingFeaturesToGuess = featuresToGuess.slice(1);
    const newFeatureToGuess = remainingFeaturesToGuess[0];
    setFeaturesToGuess(remainingFeaturesToGuess);

    if (featuresToGuess.length > 0) {
      setGuess(newFeatureToGuess);
    } else {
      setGameIsFinished();
    }
    resetNbrOfTries();
  };

  const resetNbrOfTries = () => {
    console.log("reset the number of tries");
    setNbrOfTries(0);
  };

  const changeStateFeatureColor = (nbrFound, guessFound) => {
    // console.log(`nombre found = ${nbrFound}`);
    console.log(nbrFound, guessFound);
    if (nbrFound === 0) {
      setChangeFeatureColor({ feature: guessFound, color: "white" });
    } else if (nbrFound === 1) {
      setChangeFeatureColor({ feature: guessFound, color: "#FFBD8D" });
    } else if (nbrFound === 2) {
      setChangeFeatureColor({ feature: guessFound, color: "#FF710A" });
    } else {
      setChangeFeatureColor({ feature: guessFound, color: "red" });
    }
  };

  const setGameIsFinished = () => {
    console.log("the game is finished");
  };

  return (
    <>
      <MapDisplay
        onFeatureClicked={handleMapData}
        changeFeatureColor={changeFeatureColor}
        blinkFeature={blinkFeature}
        gameURL={gameURL}
      />
      <FeatureToGuess guess={guess} />
      <Score score={score} />
    </>
  );
};

export default GameController;
