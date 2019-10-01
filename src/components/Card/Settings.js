import React from "react";

import Label from "../ui/Label";
import Input from "../ui/Input";
import { useCards } from "../../reducers/cards";

const Settings = () => {
  const cards = useCards();

  return (
    <div className="flex items-center">
      <div className="flex justify-between items-center mr-3">
        <Label>Delay:</Label>
        <Input
          className="w-16"
          type="text"
          onChange={e => cards.updateCurrent({ delay: e.target.value })}
          value={cards.current.delay || ""}
        />
      </div>

      <div className="flex justify-between items-center mr-3">
        <Label>Go to card:</Label>
        <Input
          className="w-16"
          type="number"
          onChange={e =>
            cards.updateCurrent({
              redirectToCard: e.target.value
            })
          }
          value={cards.current.redirectToCard || ""}
        />
      </div>
    </div>
  );
};

export default Settings;
