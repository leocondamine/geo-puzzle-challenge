import React, { useEffect, useState } from "react";
import MapDisplay from "./components/MapDisplay";
import FeatureToGuess from "./components/FeatureToGuess";

const GameController = () => {
  const [selectedFeature, setSelectedFeature] = useState([]);
  const [featuresToGuess, setFeaturesToGuess] = useState([]);
  const [guess, setGuess] = useState([]);
  const [nbrOfTries, setNbrOfTries] = useState(0);
  // const [nbrFound, setNbrFound] = useState(0);
  // const [guessFound, setGuessFound] = useState([]);
  const [trigger, setTrigger] = useState([]);
  const [blink, setBlink] = useState("");
  const [changeFeatureColor, setChangeFeatureColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      fetch(
        "https://cdn.rawgit.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson"
      )
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
  }, []);

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
          setBlink({ feature: guess, color: "red", isInfinite: true });
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
      setNewGuess();
    } else {
      console.log("wrong choice");
      setBlink({ feature: selectedFeature, color: "red", isInfinite: false });
      setNbrOfTries(nbrOfTries + 1);
    }
  };

  const setNewGuess = () => {
    console.log("=================nbrOfTries===================");
    console.log(nbrOfTries);
    console.log("====================================");
    const remainingFeaturesToGuess = featuresToGuess.slice(1);
    const newFeatureToGuess = remainingFeaturesToGuess[0];
    setFeaturesToGuess(remainingFeaturesToGuess);

    if (featuresToGuess.length > 0) {
      setGuess(newFeatureToGuess);
      // setTrigger([0]);
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
        triggerChangeFeatureColor={trigger}
        blink={blink}
      />
      <FeatureToGuess guess={guess} />
    </>
  );
};

export default GameController;
