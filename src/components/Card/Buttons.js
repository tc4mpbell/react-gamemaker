import React, { useState } from "react";

import { useGame } from "../../reducers/game";
import { useCards } from "../../reducers/cards";

import Button from "../ui/Button";
import EditButton from "./EditButton";

const Buttons = () => {
  const game = useGame();
  const cards = useCards();
  const card = cards.current;

  const [editingButton, setEditingButton] = useState(null);

  const handleButtonClick = button => {
    if (game.running) {
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

    cards.updateCurrent({ buttons: newButtons });

    setEditingButton(null);
  };

  return (
    <>
      {editingButton && (
        <EditButton button={editingButton} handleSave={saveButton} />
      )}
      <div className="mt-6 flex flex-wrap justify-between">
        {card.buttons
          .filter(
            button =>
              !game.running || (button.text && button.text !== "Untitled")
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

export default Buttons;
