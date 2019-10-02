import React, { useRef, useState, useEffect } from "react";
import { SketchField } from "react-sketch";
import { connect, useSelector, useDispatch } from "react-redux";

import cardTemplate from "../data/cardTemplate";

import Card from "./Card/Card";
import GameActions from "./GameActions";
import { CardNav } from "./CardNav";

import { useGame } from "../reducers/game";
import { addCard, updateCard, useCards } from "../reducers/cards";

const mapDispatch = { addCard, updateCard };

const Game = ({ addCard, updateCard }) => {
  const game = useGame();
  const cards = useCards();

  const card = cards.current;

  const currentCardIndex = useSelector(state => state.game.currentCard);
  const runningGame = useSelector(state => state.game.running);

  const [timeouts, setTimeouts] = useState({});

  // TODO need effect?
  useEffect(() => {
    if (runningGame && card && card.delay && card.redirectToCard) {
      // set a timer, then redirect away from this card (animation!)
      const _timeoutId = setTimeout(() => {
        game.goToCard(card.redirectToCard - 1);
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
  }, [runningGame, currentCardIndex]);

  return (
    <div className="p-6 bg-gray-200 mx-auto" style={{ width: "900px" }}>
      <div className="flex justify-between">
        <GameActions />

        <CardNav />
      </div>
      {card && <Card />}
    </div>
  );
};

export default connect(
  null,
  mapDispatch
)(Game);
