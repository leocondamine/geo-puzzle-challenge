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
    try {
      if (selectedFeature.length === 0) {
        return;
      } else if (!featuresToGuess.includes(selectedFeature)) {
        return;
      }
    } catch {
      console.log("il y a eu erreur");
    }
    checkGuess();
    if (nbrOfTries === 3) {
      setBlink({ feature: guess, color: "red", isInfinite: true });
      console.log("tu es nul gros nullos");
    }
  }, [selectedFeature]);

  const checkGuess = () => {
    if (selectedFeature === guess) {
      console.log("Guessed right !!! ");
      setGuessFound(guess);
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
    setNbrFound(nbrOfTries);
    const remainingFeaturesToGuess = featuresToGuess.slice(1);
    const newFeatureToGuess = remainingFeaturesToGuess[0];
    setFeaturesToGuess(remainingFeaturesToGuess);

    if (featuresToGuess.length > 0) {
      setGuess(newFeatureToGuess);
      setTrigger([0]);
    } else {
      setGameIsFinished();
    }
    resetNbrOfTries();
    changeFeatureColor();
  };

  const resetNbrOfTries = () => {
    console.log("reset the number of tries");
    setNbrOfTries(0);
  };

  const changeFeatureColor = () => {
    console.log(`nombre bfini ${nbrFound}`);
    if (nbrFound === 0) {
      return { feature: guessFound, color: "white" };
    }
    if (nbrFound === 1) {
      return { feature: guessFound, color: "#FFBD8D" };
    }
    if (nbrFound === 2) {
      return { feature: guessFound, color: "#FF710A" };
    }
    return { feature: guessFound, color: "red" };
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
