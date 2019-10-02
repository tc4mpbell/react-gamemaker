import React, { useEffect } from "react";
import { Tools } from "react-sketch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faDrawPolygon,
  faSquare,
  faCircle,
  faMousePointer,
  faMinus
} from "@fortawesome/free-solid-svg-icons";

import Button from "../ui/Button";
import { useCards } from "../../reducers/cards";
import { useGame } from "../../reducers/game";

const GameTools = ({
  cardImageRef,
  tool,
  setTool,
  fillColor,
  setFillColor,
  lineColor,
  setLineColor,
  copiedScene,
  setCopiedScene,
  className
}) => {
  const game = useGame();
  const cards = useCards();

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [game.currentCardIndex]);

  const handleKeyPress = e => {
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
      <Button>
        <input
          type="color"
          value={fillColor}
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
          value={lineColor}
          type="color"
          onChange={e => setLineColor(e.target.value)}
        ></input>
        Line
      </Button>

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
