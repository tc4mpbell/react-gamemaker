import React, { useState } from "react";

import ReactDOM from "react-dom";

import Button from "../ui/Button";
import Label from "../ui/Label";
import Input from "../ui/Input";

const Modal = ({ children }) => {
  const domNode = document.getElementById("modal-root");
  return ReactDOM.createPortal(children, domNode);
};

const EditButton = ({ handleSave, button }) => {
  const [buttonText, setButtonText] = useState(button.text);
  const [goToCard, setDestinationCard] = useState(button.goToCard);

  return (
    <Modal>
      <div className="fixed w-full h-full bg-gray-600 left-0 top-0 opacity-50 z-10"></div>
      <div className="fixed w-full h-full left-0 top-0 z-10">
        <div className="mt-4 mx-auto p-4 border border-solid bg-white max-w-xs">
          <div className="flex justify-between items-center mb-3">
            <Label>Button text:</Label>
            <Input
              type="text"
              onChange={e => setButtonText(e.target.value)}
              value={buttonText}
            />
          </div>

          <div className="flex  justify-between items-center">
            <Label>Go to card:</Label>
            <Input
              type="number"
              onChange={e => setDestinationCard(e.target.value)}
              value={goToCard || ""}
            />
          </div>

          <Button
            className="w-full bg-red-500 text-white mt-4"
            onClick={() => handleSave(buttonText, goToCard)}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditButton;
