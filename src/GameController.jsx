import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import _ from "lodash";
import MapDisplay from "./components/MapDisplay";
import FeatureToGuess from "./components/FeatureToGuess";
import Score from "./components/Score";
import Timer from "./components/Timer";
import { savePlayerData } from "./firebase";

const GameController = ({ gameURL }) => {
  const navigate = useNavigate();

  const [selectedFeature, setSelectedFeature] = useState([]);
  const [featuresToGuess, setFeaturesToGuess] = useState([]);
  const [guess, setGuess] = useState([]);
  const [countTries, setCountTries] = useState(1);
  const [blinkFeature, setBlinkFeature] = useState("");
  const [changeFeatureColor, setChangeFeatureColor] = useState("");
  const [timerOn, setTimerOn] = useState(false);
  const [score, setScore] = useState({ rows: 0, totalTries: 0 });
  const [timeScore, setTimeScore] = useState(0);

  const fetchData = async () => {
    if (!gameURL) return;
    try {
      const data = await fetchJson(gameURL);
      const names = data.features.map((feature) => feature.properties.NAME);
      console.log(names);
      const shuffledNames = names;
      // const shuffledNames = _.shuffle(names);
      setFeaturesToGuess(shuffledNames);
      setGuess(shuffledNames[0]);
    } catch (error) {
      console.warn(error);
    }
  };

  const fetchJson = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, [gameURL]);

  const handleMapData = (data) => {
    setSelectedFeature(data);
  };

  useEffect(() => {
    try {
      if (!selectedFeature?.length) {
        return;
      } else if (!featuresToGuess.includes(selectedFeature)) {
        return;
      } else {
        startTimerIfNotStarted();
        checkGuess();
      }
    } catch (e) {
      console.log(e);
    }
  }, [selectedFeature]);

  const startTimerIfNotStarted = () => {
    if (!timerOn) {
      setTimerOn(true);
    }
  };

  const checkGuess = () => {
    if (selectedFeature === guess) {
      console.log("Guessed right !!! ");
      const guessFound = guess;
      const nbrFound = countTries;
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
      if (countTries === 3) {
        console.log("tu es nul gros nullos");
        setTimeout(() => {
          setBlinkFeature({ feature: guess, color: "red", isInfinite: true });
        }, 1500);
      }
      setScore({ rows: score.rows, totalTries: score.totalTries + 1 });
      setCountTries(countTries + 1);
    }
  };

  const setNewGuess = () => {
    const remainingFeaturesToGuess = featuresToGuess.slice(1);
    const newFeatureToGuess = remainingFeaturesToGuess[0];
    setFeaturesToGuess(remainingFeaturesToGuess);

    resetCountTries();

    // to debug
    if (featuresToGuess.length > 257) {
      // if (featuresToGuess.length > 0) {
      setGuess(newFeatureToGuess);
    } else {
      setGameIsFinished();
    }
  };

  const resetCountTries = () => {
    console.log("reset the number of tries");
    setCountTries(1);
  };

  const changeStateFeatureColor = (nbrFound, guessFound) => {
    console.log(nbrFound, guessFound);
    if (nbrFound === 1) {
      setChangeFeatureColor({ feature: guessFound, color: "white" });
    } else if (nbrFound === 2) {
      setChangeFeatureColor({ feature: guessFound, color: "#FFBD8D" });
    } else if (nbrFound === 3) {
      setChangeFeatureColor({ feature: guessFound, color: "#FF710A" });
    } else {
      setChangeFeatureColor({ feature: guessFound, color: "red" });
    }
  };

  const setGameIsFinished = async () => {
    console.log("the game is finished");

    stopTimer();
    await handleFetchTimer();
    console.log(timeScore);
    saveInLeaderBoard();
    navigate(`/end`);
  };

  const stopTimer = () => {
    setTimerOn(false);
  };

  const handleFetchTimer = useCallback(async (timerValue) => {
    await setTimeScore(timerValue);
    return;
  }, []);

  const saveInLeaderBoard = () => {
    const playerName = prompt("Please enter your name:");
    console.log("save in leader boardS");
    if (playerName) {
      console.log(timeScore);
      savePlayerData(playerName, score, timeScore);
    }
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
      <Timer timerOn={timerOn} onFetchTimer={handleFetchTimer} />
    </>
  );
};

export default GameController;
