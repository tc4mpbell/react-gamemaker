import React from "react";

import { useStore } from "react-redux";

import Button from "./ui/Button";
import { useGame } from "../reducers/game";

const GameActions = () => {
  const game = useGame();
  const store = useStore();

  const loadGameFromFile = (e) => {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      game.loadGame(JSON.parse(e.target.result));
    };
    reader.readAsText(file);
  };

  const exportGame = (e) => {
    game.saveGame();
    var json = JSON.stringify(store.getState());
    var jsonData =
      "data:application/json;charset=utf-8," + encodeURIComponent(json);
    e.target.href = jsonData;
    e.target.target = "_blank";
    e.target.download = `${game.title}.txt`;
  };

  return (
    <>
      <div className="mb-3 flex items-center">
        <Button
          onClick={() => {
            game.setRunning(!game.running);
          }}
          className="mr-4"
        >
          {game.running ? "Edit Game" : "Run Game!"}
        </Button>
        <Button className="mr-4" onClick={exportGame}>
          Export
        </Button>
        <label className="mr-2">Load Game: </label>
        <input type="file" onChange={loadGameFromFile} />
      </div>
    </>
  );
};

export default GameActions;
