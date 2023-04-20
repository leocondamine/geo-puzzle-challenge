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
    <div className=" color-slate-500 z-10 flex h-screen w-full flex-col items-center justify-center gap-4 bg-black">
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
