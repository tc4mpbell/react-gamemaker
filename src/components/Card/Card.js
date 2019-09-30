import React, { useRef, useEffect, useState } from "react";
import { SketchField, Tools } from "react-sketch";
import { useSelector, useDispatch } from "react-redux";

import Button from "../ui/Button";

import Settings from "./Settings";
import GameTools from "./GameTools";
import EditButton from "./EditButton";
import { updateCard } from "../../reducers/cards";
import { useGame } from "../../reducers/game";
import CardText from "./CardText";

const Card = () => {
  const dispatch = useDispatch();
  const game = useGame();
  const cardIx = useSelector(state => state.game.currentCard);
  const card = useSelector(state => state.cards[cardIx]);
  const runningGame = useSelector(state => state.game.running);

  const [tool, setTool] = useState(Tools.Pencil);
  const [fillColor, setFillColor] = useState("transparent");
  const [lineColor, setLineColor] = useState("black");
  const [copiedScene, setCopiedScene] = useState(null);

  const [editingButton, setEditingButton] = useState(null);

  const cardImageRef = useRef(null);

  useEffect(() => {
    if (!card.image && cardImageRef.current) cardImageRef.current.clear();
  }, [cardIx]);

  const saveIfChanged = () => {};

  const saveCard = () => {
    dispatch(
      updateCard({
        cardIndex: cardIx,
        data: {
          image: cardImageRef.current.toJSON() // tempCardImageJSON[ix]
        }
      })
    );
  };

  //TODO rm to <Buttons>
  const handleButtonClick = button => {
    if (runningGame) {
      if (button.goToCard) game.setCurrentCard(button.goToCard - 1);
    } else {
      setEditingButton(button);
    }
  };

  const saveButton = (text, goToCard) => {
    const newButtons = card.buttons.map(btn => {
      if (btn !== editingButton) return btn;

      return { text, goToCard };
    });

    dispatch(updateCard({ cardIndex: cardIx, data: { buttons: newButtons } }));

    setEditingButton(null);
  };

  return (
    <>
      {editingButton && (
        <EditButton button={editingButton} handleSave={saveButton} />
      )}

      {!runningGame && (
        <>
          <Settings
            card={card}
            updateCard={data => {
              dispatch(
                updateCard({
                  cardIndex: cardIx,
                  data: data
                })
              );
            }}
          />
          <GameTools
            card={card}
            saveCard={() => saveCard(card.number)}
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
          {runningGame ? (
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

      <div className="mt-6 flex flex-wrap justify-between">
        {card.buttons
          .filter(
            button =>
              !runningGame || (button.text && button.text !== "Untitled")
          )
          .map(button => (
            <div className="w-1/3 p-2">
              <Button
                className="w-full"
                onClick={() => handleButtonClick(button)}
              >
                {button.text}
              </Button>
            </div>
          ))}
      </div>
    </>
  );
};

export default Card;
