import React, { useRef, useState, useEffect } from "react";
import { SketchField } from "react-sketch";
import { connect, useSelector, useDispatch } from "react-redux";

import cardTemplate from "../data/cardTemplate";

import Card from "./Card/Card";
import GameActions from "./GameActions";
import { CardNav } from "./CardNav";

import { useGame } from "../reducers/game";
import { addCard, updateCard } from "../reducers/cards";

const mapDispatch = { addCard, updateCard };

const Game = ({ addCard, updateCard }) => {
  const game = useGame();
  const currentCardIndex = useSelector(state => state.game.currentCard);
  let card = useSelector(state => state.cards[currentCardIndex]);
  // const game = useSelector(state => state.game);
  const cards = useSelector(state => state.cards);
  const runningGame = useSelector(state => state.game.running);

  const [timeouts, setTimeouts] = useState({});

  // TODO may not work for jumps > 1
  // If the cards array doesn't have an entry for this ix, make one.

  useEffect(() => {
    var totalCards = cards.length - 1;
    if (currentCardIndex > totalCards) {
      console.log("TC", totalCards, currentCardIndex);
      for (let i = totalCards + 1; i <= currentCardIndex; i++) {
        const clonedTemplate = JSON.parse(JSON.stringify(cardTemplate));
        clonedTemplate.number = i;

        addCard(clonedTemplate);
        console.log("adding card", i, cards.length);
      }
      totalCards += 1;
    }
  }, [currentCardIndex]);

  useEffect(() => {
    if (cards.length > currentCardIndex) {
      card = cards[currentCardIndex];
      console.log("Set card to ", currentCardIndex, cards[currentCardIndex]);
    }
  }, [cards, currentCardIndex]);

  // TODO need effect?
  useEffect(() => {
    if (runningGame && card && card.delay && card.redirectToCard) {
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
  }, [runningGame, currentCardIndex]);

  const saveAndGoToCard = cardNumber => {
    game.saveGame();
    game.setCurrentCard(cardNumber);
  };

  return (
    <div className="p-6 bg-gray-200 mx-auto" style={{ width: "900px" }}>
      <div className="flex">
        <GameActions />

        <CardNav
          runningGame={runningGame}
          currentCardIndex={currentCardIndex}
          saveAndGoToCard={saveAndGoToCard}
        />
      </div>
      {card && <Card />}
    </div>
  );
};

export default connect(
  null,
  mapDispatch
)(Game);
