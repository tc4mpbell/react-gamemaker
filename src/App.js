import React, { useRef, useState, useEffect } from "react";
import { SketchField, Tools } from "react-sketch";

const cardTemplate = {
  image: null,
  text: "",
  buttons: [
    {
      text: "",
      goToCard: null
    },
    {
      text: "",
      goToCard: null
    },
    {
      text: "",
      goToCard: null
    },
    {
      text: "",
      goToCard: null
    },
    {
      text: "",
      goToCard: null
    },
    {
      text: "",
      goToCard: null
    }
  ]
};

const game = {
  title: "My game",
  cards: []
};

const Button = ({ children, className, ...props }) => {
  return (
    <button className={`border rounded p-2 bg-white ${className}`} {...props}>
      {children || "Untitled"}
    </button>
  );
};

const Label = props => <label className="font-bold mr-2" {...props} />;

const Input = props => <input className="p-2 border border-solid" {...props} />;

const EditButton = ({ handleSave, button }) => {
  const [buttonText, setButtonText] = useState(button.text);
  const [goToCard, setDestinationCard] = useState(button.goToCard);

  return (
    <div className="p-4 border border-solid bg-white absolute">
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
  );
};

const App = () => {
  const [currentCardIndex, setCardIndex] = useState(0);

  if (currentCardIndex > game.cards.length - 1) {
    game.cards.push({ ...cardTemplate });
  }

  const card = game.cards[currentCardIndex];

  const [runningGame, setRunningGame] = useState(false);
  const [editingButton, setEditingButton] = useState(null);
  const [cardText, setCardText] = useState(card.text);
  const [cardImage, setCardImage] = useState(card.image);

  const cardImageRef = useRef(null);

  useEffect(() => {
    setCardText(card.text);
    setCardImage(card.image);

    console.log("Loaded card image", card.image);
  }, [currentCardIndex]);

  const handleButtonClick = button => {
    if (runningGame) {
    } else {
      setEditingButton(button);
    }
  };

  const saveButton = (text, goToCard) => {
    editingButton.text = text;
    editingButton.goToCard = goToCard;
    setEditingButton(null);
  };

  const saveCard = () => {
    console.log("Saving card image");

    card.text = cardText;
    card.image = cardImageRef.current.toJSON();

    // setCardImage(card.image);
    // setCardText(card.text);
  };

  const saveAndGoToCard = cardNumber => {
    saveCard();
    cardImageRef.current.clear();
    setCardIndex(cardNumber);
  };

  return (
    <div className="p-6 bg-gray-200 mx-auto" style={{ maxWidth: "900px" }}>
      {editingButton && (
        <EditButton button={editingButton} handleSave={saveButton} />
      )}

      <div className="mb-3 flex justify-between">
        <div>
          {currentCardIndex !== 0 && (
            <Button
              className="mr-3"
              onClick={() => saveAndGoToCard(currentCardIndex - 1)}
            >
              &larr; Previous Card
            </Button>
          )}

          {currentCardIndex !== 99 && (
            <Button
              className="mr-3"
              onClick={() => saveAndGoToCard(currentCardIndex + 1)}
            >
              Next Card &rarr;
            </Button>
          )}
          <Button className="mr-3">Card Settings</Button>
        </div>

        <Button onClick={() => setRunningGame(!runningGame)}>
          {runningGame ? "Edit Game" : "Run Game!"}
        </Button>
      </div>

      <div className="flex" style={{ minHeight: "300px" }}>
        <div className="border border-solid w-1/2 mr-3 bg-white">
          {runningGame ? (
            <img src={card.image} />
          ) : (
            <SketchField
              width="100%"
              height="100%"
              tool={Tools.Pencil}
              lineColor="black"
              lineWidth={3}
              value={cardImage}
              ref={cardImageRef}
            />
          )}
        </div>
        {runningGame ? (
          <div className="border border-solid w-1/2 bg-white p-4">
            {card.text}
          </div>
        ) : (
          <textarea
            className="border border-solid w-1/2 bg-white p-4"
            onChange={e => setCardText(e.target.value)}
            value={cardText}
          ></textarea>
        )}
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
    </div>
  );
};

export default App;
