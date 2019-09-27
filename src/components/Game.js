import React, { useRef, useState, useEffect } from "react";
import { SketchField } from "react-sketch";
import { connect, useSelector, useDispatch } from "react-redux";

import cardTemplate from "../data/cardTemplate";

import Button from "./ui/Button";

import Card from "./Card/Card";
import GameActions from "./GameActions";
import { useGame } from "../reducers/game";
import { addCard, updateCard } from "../reducers/cards";

const mapDispatch = { addCard, updateCard };

const Game = ({ addCard, updateCard }) => {
  const game = useGame();
  const currentCardIndex = useSelector(state => state.game.currentCard);
  const card = useSelector(state => state.cards[currentCardIndex]);
  // const game = useSelector(state => state.game);
  const cards = useSelector(state => state.cards);
  const runningGame = useSelector(state => state.game.running);

  const [timeouts, setTimeouts] = useState({});

  // TODO may not work for jumps > 1
  // If the cards array doesn't have an entry for this ix, make one.
  if (currentCardIndex > cards.length - 1) {
    const clonedTemplate = JSON.parse(JSON.stringify(cardTemplate));
    clonedTemplate.number = currentCardIndex;

    addCard(clonedTemplate);
  }

  // TODO need effect?
  useEffect(() => {
    if (runningGame && card.delay && card.redirectToCard) {
      // set a timer, then redirect away from this card (animation!)
      const _timeoutId = setTimeout(() => {
        game.setCurrentCard(card.redirectToCard - 1);
      }, card.delay);
      setTimeouts({
        ...timeouts,
        [currentCardIndex]: _timeoutId
      });
    }
    return () => {
      if (timeouts[currentCardIndex]) {
        clearTimeout(timeouts[currentCardIndex]);
        setTimeouts({
          ...timeouts,
          [currentCardIndex]: null
        });
      }
    };
  }, [runningGame, card]);

  const saveAndGoToCard = cardNumber => {
    game.saveGame();
    game.setCurrentCard(cardNumber);
  };

  return (
    <div className="p-6 bg-gray-200 mx-auto" style={{ width: "900px" }}>
      <GameActions />

      <Card cardIx={currentCardIndex} />

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
    </div>
  );
};

export default connect(
  null,
  mapDispatch
)(Game);
