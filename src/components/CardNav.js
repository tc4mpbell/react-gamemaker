import React from "react";
import Button from "./ui/Button";
import { useGame } from "../reducers/game";

export function CardNav() {
  const game = useGame();

  return (
    <div className="mb-3 flex justify-between">
      <div>
        {!game.running && (
          <div className="flex items-center justify-between">
            <Button
              className={`mr-3 ${game.currentCardIndex === 0 &&
                "text-gray-500"}`}
              onClick={() => game.goToCard(game.currentCardIndex - 1)}
              disabled={game.currentCardIndex === 0}
            >
              &larr;
            </Button>
            <span className="mr-3">{game.currentCardIndex + 1} / 100</span>
            <Button
              className={` ${game.currentCardIndex === 99 && "text-gray-500"}`}
              onClick={() => game.goToCard(game.currentCardIndex + 1)}
              disabled={game.currentCardIndex === 99}
            >
              &rarr;
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
