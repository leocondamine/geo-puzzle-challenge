import React, { useEffect, useState } from "react";
import MapDisplay from "./components/MapDisplay";
import FeatureToGuess from "./components/FeatureToGuess";

const GameController = () => {
  const [selectedFeature, setSelectedFeature] = useState([]);
  const [featuresToGuess, setFeaturesToGuess] = useState([]);
  const [guess, setGuess] = useState([]);
  const [nbrOfTries, setNbrOfTries] = useState(0);
  const [nbrFound, setNbrFound] = useState(0);
  const [guessFound, setGuessFound] = useState([]);
  const [trigger, setTrigger] = useState([]);
  const [blink, setBlink] = useState("");

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
    console.log("Selected feature");
    console.log(selectedFeature);
    console.log("Guess");
    console.log(guess);
    console.log("Nbr of tries");
    try {
      if (selectedFeature.length === 0) {
        return;
      } else {
        setNbrOfTries(nbrOfTries + 1);
      }
    } catch {
      console.log("il y a eu erreur");
    }

    console.log(nbrOfTries + 1);
    if (nbrOfTries < 4) {
      checkGuess();
    } else {
      checkGuess();
      setBlink({ feature: guess, color: "blue" });
      console.log("tu es nul gros nullos");
    }
  }, [selectedFeature]);

  const checkGuess = () => {
    if (selectedFeature === guess) {
      console.log("Guessed right !!! ");
      setGuessFound(guess);
      // setBlink({ feature: selectedFeature, color: "green" });
      setNewGuess();
    } else {
      console.log("wrong choice");
      setBlink({ feature: selectedFeature, color: "red" });
    }
  };

  const setNewGuess = () => {
    const remainingFeaturesToGuess = featuresToGuess.slice(1);
    const newFeatureToGuess = remainingFeaturesToGuess[0];
    setFeaturesToGuess(remainingFeaturesToGuess);
    setNbrFound(nbrOfTries);

    // console.log(remainingFeaturesToGuess);
    // console.log("new Feature :");
    // console.log(newFeatureToGuess);

    if (featuresToGuess.length > 0) {
      resetNbrOfTries();
      setGuess(newFeatureToGuess);
      setTrigger([0]);
    } else {
      setGameIsFinished();
    }
    changeFeatureColor();
  };

  const changeFeatureColor = () => {
    console.log(`nombre bfini ${nbrFound}`);
    if (nbrFound === 1) {
      return { feature: guessFound, color: "red" };
    }
    if (nbrFound === 2) {
      return { feature: guessFound, color: "blue" };
    }
    return { feature: guessFound, color: "green" };
  };

  const resetNbrOfTries = () => {
    console.log("reset the number of tries");
    setNbrOfTries(0);
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
