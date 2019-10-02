import React, { useEffect } from "react";
import Button from "./ui/Button";
import { useGame } from "../reducers/game";

export function CardNav() {
  const game = useGame();

  useEffect(() => {
    console.log("Bind", game.currentCardIndex);
    document.addEventListener("keydown", handleKeyboardNav);
    return () => {
      document.removeEventListener("keydown", handleKeyboardNav);
    };
  }, [game.currentCardIndex]);

  const handleKeyboardNav = e => {
    if (e.key === "]" && e.metaKey) {
      if (game.currentCardIndex < 100) goToNextCard();
      e.preventDefault();
    } else if (e.key === "[" && e.metaKey) {
      if (game.currentCardIndex > 0) goToPrevCard();
      e.preventDefault();
    }
  };

  const goToPrevCard = () => game.goToCard(game.currentCardIndex - 1);
  const goToNextCard = () => game.goToCard(game.currentCardIndex + 1);

  return (
    <div>
      {!game.running && (
        <div className="flex items-center justify-between">
          <Button
            className={`mr-3 ${game.currentCardIndex === 0 && "text-gray-500"}`}
            onClick={goToPrevCard}
            disabled={game.currentCardIndex === 0}
          >
            &larr;
          </Button>
          <span className="mr-3">{game.currentCardIndex + 1} / 100</span>
          <Button
            className={` ${game.currentCardIndex === 99 && "text-gray-500"}`}
            onClick={goToNextCard}
            disabled={game.currentCardIndex === 99}
          >
            &rarr;
          </Button>
        </div>
      )}
    </div>
  );
}
