import React from "react";

import Button from "./ui/Button";

const GameActions = ({
  saveCard,
  runningGame,
  setRunningGame,
  game,
  setGame
}) => {
  const loadGameFromFile = e => {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      console.log("target", e.target.result);
      setGame(JSON.parse(e.target.result));
    };
    reader.readAsText(file);
  };

  const exportGame = e => {
    var json = JSON.stringify(game);
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
            // TODO rmed this; won't save card if click run; will be fixed by saving changes in the card itself
            // if (!runningGame) saveCard();
            setRunningGame(!runningGame);
          }}
          className="mr-4"
        >
          {runningGame ? "Edit Game" : "Run Game!"}
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
