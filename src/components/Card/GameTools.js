import React, { useEffect, useState } from "react";
import { Tools } from "react-sketch";

import Button from "../ui/Button";

const GameTools = ({
  card,
  saveCard,
  cardImageRef,
  tool,
  setTool,
  fillColor,
  setFillColor,
  lineColor,
  setLineColor,
  copiedScene,
  setCopiedScene
}) => {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // debugging copy/paste
  // useEffect(() => {
  //   console.log("Copied scene", copiedScene);
  // }, [copiedScene]);

  const handleKeyPress = e => {
    if (e.key === "Backspace") cardImageRef.current.removeSelected();
    else if (e.key === "c" && e.metaKey) {
      console.log("copy!", card.image);
      setCopiedScene(card.image);
    } else if (e.key === "v" && e.metaKey) {
      console.log("PASTE!", copiedScene);
      // seems like this should work, but doesn't... why is copiedScene null?
      cardImageRef.current.fromJSON(copiedScene);
      // setTempCardImageJSON({
      //   ...tempCardImageJSON,
      //   [currentCardIndex]: cardImageRef.current.toJSON()
      // });
      saveCard();
    }
  };

  return (
    <div className="flex items-center mb-4">
      <Button onClick={() => setTool(Tools.Pencil)}>Pencil</Button>
      <Button onClick={() => setTool(Tools.Polygon)}>Polygon</Button>
      <Button onClick={() => setTool(Tools.Select)}>Select</Button>
      <Button onClick={() => setTool(Tools.Line)}>Line</Button>
      <Button onClick={() => setTool(Tools.Rectangle)}>Rectangle</Button>
      <Button onClick={() => setTool(Tools.Circle)}>Circle</Button>
      <Button>
        <input
          type="color"
          onChange={e => {
            const selected = cardImageRef.current._fc.getActiveObject();
            if (selected) {
              cardImageRef.current._fc
                .getActiveObject()
                .set("fill", e.target.value);
            }
            setFillColor(e.target.value);

            cardImageRef.current._fc.renderAll();
          }}
        ></input>
        Fill
      </Button>
      <Button>
        <input
          type="color"
          onChange={e => setLineColor(e.target.value)}
        ></input>
        Line
      </Button>

      <Button onClick={() => setCopiedScene(card.image)}>Copy Scene</Button>
      {copiedScene && (
        <Button onClick={() => cardImageRef.current.fromJSON(copiedScene)}>
          Paste Scene
        </Button>
      )}
    </div>
  );
};

export default GameTools;
