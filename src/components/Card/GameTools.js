import React, { useEffect, useState } from "react";
import { Tools } from "react-sketch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faDrawPolygon,
  faSquare,
  faCircle,
  faMousePointer,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import color from "color";

import Button from "../ui/Button";
import { useCards } from "../../reducers/cards";
import { useGame } from "../../reducers/game";

const colorPalette = [
  "rgb(20, 12, 28)",
  "rgb(68, 36, 52)",
  "rgb(48, 52, 109)",
  "rgb(78, 74, 78)",
  "rgb(133, 76, 48)",
  "rgb(52, 101, 36)",
  "rgb(208, 70, 72)",
  "rgb(117, 113, 97)",
  "rgb(89, 125, 206)",
  "rgb(210, 125, 44)",
  "rgb(133, 149, 161)",
  "rgb(109, 170, 44)",
  "rgb(210, 170, 153)",
  "rgb(109, 194, 202)",
  "rgb(218, 212, 94)",
  "rgb(222, 238, 214)",
];

const GameTools = ({
  cardImageRef,
  tool,
  setTool,
  fillColor,
  setFillColor: _setFillColor,
  lineColor,
  setLineColor: _setLineColor,
  copiedScene,
  setCopiedScene,
  className,
}) => {
  const game = useGame();
  const cards = useCards();

  const [strokeOrFill, setStrokeOrFill] = useState("stroke");

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [game.currentCardIndex]);

  const handleKeyPress = (e) => {
    if (
      e.key === "Backspace" &&
      !["input", "textarea"].includes(e.target.localName)
    )
      cardImageRef.current.removeSelected();
    else if (e.key === "c" && e.metaKey) {
      window._copiedCardImage = cardImageRef.current.toJSON();
    } else if (e.key === "v" && e.metaKey) {
      window._tempCardImage = window._copiedCardImage;
      game.saveGame();
    }
  };

  const setColor = (color) => {
    const selected = cardImageRef.current._fc.getActiveObject();
    if (selected) {
      cardImageRef.current._fc.getActiveObject().set(strokeOrFill, color);
    }

    if (strokeOrFill === "fill") {
      _setFillColor(color);
    } else if (strokeOrFill === "stroke") _setLineColor(color);

    cardImageRef.current._fc.renderAll();
  };

  return (
    <div className={`flex items-center mb-4 ${className}`}>
      <Button onClick={() => setTool(Tools.Pencil)}>
        <FontAwesomeIcon icon={faPencilAlt} />
      </Button>
      <Button onClick={() => setTool(Tools.Polygon)}>
        <FontAwesomeIcon icon={faDrawPolygon} />
      </Button>
      <Button onClick={() => setTool(Tools.Select)}>
        <FontAwesomeIcon icon={faMousePointer} />
      </Button>
      <Button onClick={() => setTool(Tools.Line)}>
        <FontAwesomeIcon icon={faMinus} />
      </Button>
      <Button onClick={() => setTool(Tools.Rectangle)}>
        <FontAwesomeIcon icon={faSquare} />
      </Button>
      <Button onClick={() => setTool(Tools.Circle)} className="mr-4">
        <FontAwesomeIcon icon={faCircle} />
      </Button>

      <Button
        style={{
          background: fillColor,
          color: color(fillColor || "white").negate(),
          border: strokeOrFill === "fill" && "double yellow 3px",
        }}
        onClick={(e) => setStrokeOrFill("fill")}
      >
        Fill
      </Button>
      <Button
        style={{
          background: lineColor,
          color: color(lineColor).negate(),
          border: strokeOrFill === "stroke" && "double yellow 3px",
        }}
        onClick={(e) => setStrokeOrFill("stroke")}
      >
        Line
      </Button>

      {colorPalette.map((color) => (
        <div
          className="w-8 h-8 border border-solid border-white"
          style={{ background: color }}
          onClick={() => setColor(color)}
        />
      ))}

      <Button onClick={() => setCopiedScene(cards.current.image)}>
        Copy Scene
      </Button>
      {copiedScene && (
        <Button onClick={() => cardImageRef.current.fromJSON(copiedScene)}>
          Paste Scene
        </Button>
      )}
    </div>
  );
};

export default GameTools;
