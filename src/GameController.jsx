import React, { useEffect, useState } from "react";
import MapDisplay from "./components/MapDisplay";

const GameController = () => {
  const [selectedFeature, setSelectedFeature] = useState([]);
  const [featuresToGuess, setFeaturesToGuess] = useState([]);
  const [guess, setGuess] = useState([]);

  // const initFeaturesToGuess = () => {

  //       setFeaturesToGuess(names);
  //       setGuess(names[0]);
  //       return;
  //     })

  // };

  useEffect(() => {
    const fetchFeatures = async () => {
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

    fetchFeatures();
  }, []);

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
    const remainingFeaturesToGuess = featuresToGuess.slice(1)
    const newFeatureToGuess = remainingFeaturesToGuess[0]
    setFeaturesToGuess(remainingFeaturesToGuess);
    console.log(remainingFeaturesToGuess)
    console.log("new Feature :");
    console.log(newFeatureToGuess);
    if (featuresToGuess.length > 0) {
      setGuess(newFeatureToGuess);
    } else {
      setGameIsFinished();
    }
  };


  const setGameIsFinished = () => {
    console.log("the game is finished");
  };

  return <MapDisplay onFeatureClicked={handleMapData} />;
};

export default GameController;
