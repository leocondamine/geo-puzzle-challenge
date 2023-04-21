import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style";

const Menu = ({ onGameSelected }) => {
  const navigate = useNavigate();

  const gameList = [
    {
      name: "Countries",
      url: "https://raw.githubusercontent.com/leocondamine/geo-puzzle-challenge/main/src/maps/countries_very_simplified_258.json",
      // filter-fields NAME on mapshaper applied
    },
    {
      name: "Test dupplicate",
      url: "https://raw.githubusercontent.com/leocondamine/geo-puzzle-challenge/main/src/maps/countries_very_simplified_258.json",
      // filter-fields NAME on mapshaper applied
    },
    // Add more JSON files here
  ];

  const handleSelection = () => {
    const gameSelected = document.getElementById("game");
    const selectedValue = gameSelected.value;
    onGameSelected(selectedValue);
    navigate(`/game`);
  };

  return (
    <div
      className={`${styles.fullscreenCenter} ${styles.flexCol} ${styles.colors}`}
    >
      <div className="mb-20 text-4xl">Geo Puzzle Challenge</div>
      <label htmlFor="game">Choose a game : </label>
      {gameList.map((game, index) => (
        <button
          onClick={handleSelection}
          id="game"
          key={index}
          value={game.url}
          className="text-white"
        >
          {game.name}
        </button>
      ))}
    </div>
  );
};

export default Menu;
