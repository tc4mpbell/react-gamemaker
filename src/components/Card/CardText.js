import React from "react";
import { useSelector } from "react-redux";
import { updateCard, useCards } from "../../reducers/cards";

const CardText = () => {
  const cards = useCards();
  const card = cards.current;
  const runningGame = useSelector(state => state.game.running);

  // const updateCard = data => {
  //             dispatch(
  //               updateCard({
  //                 cardIndex: cardIx,
  //                 data: data
  //               })
  //             );
  //           }}

  return runningGame ? (
    <div className="border border-solid w-1/2 bg-white p-4">{card.text}</div>
  ) : (
    <textarea
      className="border border-solid w-1/2 bg-white p-4"
      onChange={e => cards.updateCurrent({ text: e.target.value })}
      value={card.text}
    ></textarea>
  );
};

export default CardText;
