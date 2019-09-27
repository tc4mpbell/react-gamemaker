import React, { useRef, useState, useEffect } from "react";
import { SketchField } from "react-sketch";
import { useSelector, useDispatch } from "react-redux";

import cardTemplate from "../data/cardTemplate";

import Button from "./ui/Button";
import Label from "./ui/Label";
import Input from "./ui/Input";

import Card from "./Card/Card";
import GameActions from "./GameActions";
import { setCurrentCard } from "../reducers/game";
import { addCard, updateCard } from "../reducers/cards";

const Game = () => {
  let savedGame = localStorage.getItem("_gamemaker_game");
  if (savedGame) savedGame = JSON.parse(savedGame);

  const dispatch = useDispatch();
  const currentCardIndex = useSelector(state => state.game.currentCard);
  const card = useSelector(state => state.cards[currentCardIndex]);
  const game = useSelector(state => state.game);
  const cards = useSelector(state => state.cards);

  const initialGameState = savedGame || {
    title: "My game",
    cards: [JSON.parse(JSON.stringify(cardTemplate))]
  };

  // const [game, setGame] = useState(initialGameState);

  // const [card, setCard] = useState(game.cards[currentCardIndex]);
  const [timeouts, setTimeouts] = useState({});

  const [runningGame, setRunningGame] = useState(false);

  // const goToCard = cardIx => {
  //   let _card = game.cards[currentCardIndex];
  //   setCard(_card);
  // };

  console.log("effect", cards, currentCardIndex);
  // If the cards array doesn't have an entry for this ix, make one.
  if (currentCardIndex > cards.length - 1) {
    const clonedTemplate = JSON.parse(JSON.stringify(cardTemplate));

    clonedTemplate.number = currentCardIndex;

    dispatch(addCard(clonedTemplate));
    // setGame({
    //   ...game,
    //   cards: [...game.cards, clonedTemplate]
    // });
  }

  useEffect(() => {
    // if (game.cards.length - 1 >= currentCardIndex) {
    //   goToCard(currentCardIndex);
    // }
  }, [game, currentCardIndex]);

  // Save game to localstorage
  useEffect(() => {
    saveGame();
  }, [game]);

  // TODO need effect?
  useEffect(() => {
    if (runningGame && card.delay && card.redirectToCard) {
      // set a timer, then redirect away from this card (animation!)
      const _timeoutId = setTimeout(() => {
        dispatch(setCurrentCard(card.redirectToCard - 1));
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

  // const updateCard = (cardIx, cardChanges) => {

  //   setGame({
  //     ...game,
  //     cards: game.cards.map((card, ix) => {
  //       if (ix !== cardIx) return card;

  //       return { ...card, ...cardChanges };
  //     })
  //   });
  // };

  const saveGame = () => {
    localStorage.setItem("_gamemaker_game", JSON.stringify(game));
  };

  const saveAndGoToCard = cardNumber => {
    // TODO: now image edits won't be saved; need to save onchange in the card itself
    // saveCard(currentCardIndex);
    dispatch(setCurrentCard(cardNumber));
  };

  return (
    <div className="p-6 bg-gray-200 mx-auto" style={{ width: "900px" }}>
      <GameActions
        game={game}
        runningGame={runningGame}
        setRunningGame={setRunningGame}
      />

      <Card
        cardIx={currentCardIndex}
        updateCard={cardData => {
          // TODO shouldn't need curIx
          dispatch(
            updateCard({
              cardIx: currentCardIndex,
              data: cardData
            })
          );
        }}
      />

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

export default Game;
