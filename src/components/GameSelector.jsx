import React from "react";
import { useNavigate } from "react-router-dom";

const GameSelector = ({ onGameSelected }) => {
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
    <div className="fixed flex justify-center items-center gap-4 z-10 top-12 left-0 bg-black h-12 w-[30%] color-slate-500">
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

export default GameSelector;
