import React from "react";

import Label from "../ui/Label";
import Input from "../ui/Input";

const Settings = ({ updateCard, card }) => {
  return (
    <div className="mx-8 px-8 border-l border-r border-gray-400 flex items-center">
      <div className="flex justify-between items-center mr-3">
        <Label>Delay:</Label>
        <Input
          className="w-16"
          type="text"
          onChange={e => updateCard({ delay: e.target.value })}
          value={card.delay || ""}
        />
      </div>

      <div className="flex justify-between items-center mr-3">
        <Label>Go to card:</Label>
        <Input
          className="w-16"
          type="number"
          onChange={e =>
            updateCard({
              redirectToCard: e.target.value
            })
          }
          value={card.redirectToCard || ""}
        />
      </div>
    </div>
  );
};

export default Settings;
