import React from "react";
import Button from "./ui/Button";

export function CardNav({ runningGame, currentCardIndex, saveAndGoToCard }) {
  return (
    <div className="mb-3 flex justify-between">
      <div>
        {!runningGame && (
          <div className="flex items-center justify-between">
            <Button
              className={`mr-3 ${currentCardIndex === 0 && "text-gray-500"}`}
              onClick={() => saveAndGoToCard(currentCardIndex - 1)}
              disabled={currentCardIndex === 0}
            >
              &larr; Previous Card
            </Button>
            <span className="mr-3">{currentCardIndex + 1} / 100</span>
            <Button
              className={` ${currentCardIndex === 99 && "text-gray-500"}`}
              onClick={() => saveAndGoToCard(currentCardIndex + 1)}
              disabled={currentCardIndex === 99}
            >
              Next Card &rarr;
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
