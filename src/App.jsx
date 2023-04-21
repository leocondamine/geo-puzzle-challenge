import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import GameController from "./GameController";
import Menu from "./components/Menu";
import EndGame from "./components/EndGame";

const App = () => {
  const [gameURL, setGameURL] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu onGameSelected={setGameURL} />} />
        <Route path="/game" element={<GameController gameURL={gameURL} />} />
        <Route path="/end" element={<EndGame />} />
      </Routes>
    </Router>
  );
};

export default App;
