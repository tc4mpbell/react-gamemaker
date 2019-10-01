import React, { useRef, useEffect, useState } from "react";
import { SketchField, Tools } from "react-sketch";
import { useSelector, useDispatch } from "react-redux";

import Button from "../ui/Button";

import Settings from "./Settings";
import GameTools from "./GameTools";
import EditButton from "./EditButton";
import { updateCard, useCards } from "../../reducers/cards";
import { useGame } from "../../reducers/game";
import CardText from "./CardText";
import Buttons from "./Buttons";

const Card = () => {
  const dispatch = useDispatch();
  const game = useGame();
  const cards = useCards();
  const cardIx = game.currentCardIndex;
  const card = cards.current;

  const [tool, setTool] = useState(Tools.Pencil);
  const [fillColor, setFillColor] = useState("transparent");
  const [lineColor, setLineColor] = useState("black");
  const [copiedScene, setCopiedScene] = useState(null);

  const cardImageRef = useRef(null);

  useEffect(() => {
    if (!card.image && cardImageRef.current) cardImageRef.current.clear();
  }, [cardIx]);

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
            copiedScene={copiedScene}
            setCopiedScene={setCopiedScene}
          />
        </>
      )}

      <div className="flex" style={{ minHeight: "300px" }}>
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
