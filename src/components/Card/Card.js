import React, { useRef, useEffect, useState } from "react";
import { SketchField, Tools } from "react-sketch";

import Settings from "./Settings";
import GameTools from "./GameTools";
import { useCards } from "../../reducers/cards";
import { useGame } from "../../reducers/game";
import CardText from "./CardText";
import Buttons from "./Buttons";

const Card = () => {
  const game = useGame();
  const cards = useCards();
  const cardIx = game.currentCardIndex;
  const card = cards.current;

  const [tool, setTool] = useState(Tools.Pencil);
  const [fillColor, setFillColor] = useState();
  const [lineColor, setLineColor] = useState("#000000");

  const cardImageRef = useRef(null);

  useEffect(() => {
    if (!card.image && cardImageRef.current) {
      console.log(
        "CLEAR - Crd changed",
        cardIx,
        card.image,
        cardImageRef.current
      );
      cardImageRef.current.clear();

      console.log("CLEARED!!", card.image, cardImageRef.current.toJSON());
    }
  }, [cardIx]);

  useEffect(() => {
    /**
     * TODO: why does the color not change for the current tool...
     * have to do this terrible hack below to switch tools.
     */
    const oldTool = tool;
    setTool();
    setTimeout(() => {
      setTool(oldTool);
    }, 1);
  }, [fillColor, lineColor]);

  // useEffect(() => {
  //   console.log("Card!", card.image);
  //   if (card.image === null) {
  //     cardImageRef.current.clear();
  //     window._tempCardImage = null;
  //   }
  // }, [card.image]);

  return (
    <>
      {!game.running && (
        <>
          <Settings />
          <GameTools
            cardImageRef={cardImageRef}
            tool={tool}
            setTool={setTool}
            fillColor={fillColor}
            setFillColor={setFillColor}
            lineColor={lineColor}
            setLineColor={setLineColor}
            className="mt-2"
          />
        </>
      )}

      <div
        className="flex"
        style={{ minHeight: "300px", width: "100vw", height: "40vw" }}
      >
        <div className="border border-solid w-1/2 mr-3 bg-white">
          {game.running ? (
            <SketchField
              width="100%"
              height="100%"
              tool={null}
              value={card.image}
              ref={cardImageRef}
            />
          ) : (
            <SketchField
              width="100%"
              height="100%"
              tool={tool}
              lineColor={lineColor}
              fillColor={fillColor}
              lineWidth={3}
              value={card.image}
              onChange={() => {
                window._tempCardImage = cardImageRef.current.toJSON();
              }}
              ref={cardImageRef}
            />
          )}
        </div>

        <CardText />
      </div>

      <Buttons />
    </>
  );
};

export default Card;
