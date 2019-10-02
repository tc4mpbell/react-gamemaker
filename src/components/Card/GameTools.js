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
  const cards = useCards();

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
      console.log("copy!", cards.current.image);
      setCopiedScene(cards.current.image);
    } else if (e.key === "v" && e.metaKey) {
      console.log("PASTE!", copiedScene);
      // seems like this should work, but doesn't... why is copiedScene null?
      cardImageRef.current.fromJSON(copiedScene);
      saveCard();
    }
  };

  // TODO rm this -- think we can use game.save instead
  const saveCard = () => {
    cards.updateCurrent({
      image: cardImageRef.current.toJSON()
    });
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
