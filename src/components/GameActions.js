import React from "react";

import { useDispatch, useSelector } from "react-redux";

import Button from "./ui/Button";
import { useGame } from "../reducers/game";

const GameActions = () => {
  const dispatch = useDispatch();
  const game = useGame();

  const loadGameFromFile = e => {
    // var file = e.target.files[0];
    // var reader = new FileReader();
    // reader.onload = function(e) {
    //   console.log("target", e.target.result);
    //   setGame(JSON.parse(e.target.result));
    // };
    // reader.readAsText(file);
  };

  const exportGame = e => {
    // var json = JSON.stringify(game);
    // var jsonData =
    //   "data:application/json;charset=utf-8," + encodeURIComponent(json);
    // e.target.href = jsonData;
    // e.target.target = "_blank";
    // e.target.download = `${game.title}.txt`;
  };

  return (
    <>
      <div className="mb-3 flex items-center">
        <Button
          onClick={() => {
            // TODO rmed this; won't save card if click run; will be fixed by saving changes in the card itself
            // if (!game.running) saveCard();
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
