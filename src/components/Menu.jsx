import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style";

const Menu = ({ onGameSelected }) => {
  const navigate = useNavigate();

  const gameList = [
    {
      name: "Countries of the World",
      url: "https://cdn.jsdelivr.net/gh/leocondamine/maps-geo-puzzle-challenge@main/countries.json",
      // filter-fields NAME on mapshaper applied
    },
    {
      name: "French Departments",
      url: "https://cdn.jsdelivr.net/gh/leocondamine/maps-geo-puzzle-challenge@main/french_dpt.json",
      // filter-fields NAME on mapshaper applied
    },
    {
      name: "French Regions",
      url: "https://cdn.jsdelivr.net/gh/leocondamine/maps-geo-puzzle-challenge@main/french_regions.json",
      // filter-fields NAME on mapshaper applied
    },
    // Add more JSON files here
  ];

  const handleSelection = (index) => {
    const gameSelected = gameList[index];
    console.log(gameSelected.url);
    onGameSelected(gameSelected.url);
    navigate(`/game`);
  };

  return (
    <div className={`flex ${styles.fullscreen} ${styles.center}`}>
      <div className={`flex ${styles.frameStyle} h-[80%] w-[80%]`}>
        <div className="mb-20 font-title text-8xl">Geo Puzzle Challenge</div>
        {/* <label htmlFor="game">Choose a game : </label> */}
        {gameList.map((game, index) => (
          <button
            onClick={() => handleSelection(index)}
            id="game"
            key={index}
            value={game.url}
            className="text-2xl duration-300 ease-in-out hover:scale-110"
          >
            {game.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Menu;
