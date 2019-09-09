import React, { useRef, useState, useEffect } from "react";
import { SketchField, Tools } from "react-sketch";

let game = {
  title: "My game",
  cards: []
};

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
    <>
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
    </>
  );
};

const App = () => {
  const savedGame = localStorage.getItem("_gamemaker_game");
  if (savedGame) game = JSON.parse(savedGame);

  // const [game, setGame] = useState();
  const [currentCardIndex, setCardIndex] = useState(0);

  if (currentCardIndex > game.cards.length - 1) {
    const clonedTemplate = JSON.parse(JSON.stringify(cardTemplate));

    game.cards.push(clonedTemplate);
  }

  const card = game.cards[currentCardIndex];

  const [runningGame, setRunningGame] = useState(false);
  const [editingButton, setEditingButton] = useState(null);
  const [tool, setTool] = useState(Tools.Pencil);

  const [cardText, setCardText] = useState(card.text);
  const [cardImage, setCardImage] = useState(card.image);
  const [cardButtons, setCardButtons] = useState(card.buttons);

  const cardImageRef = useRef(null);

  useEffect(() => {
    window.addEventListener("keyup", handleBackspacePress);

    return () => {
      window.removeEventListener("keyup", handleBackspacePress);
    };
  }, []);

  const handleBackspacePress = e => {
    if (e.key === "Backspace") cardImageRef.current.removeSelected();
  };

  useEffect(() => {
    setCardText(card.text);
    setCardImage(card.image);
    setCardButtons(card.buttons);
  }, [currentCardIndex, runningGame]);

  const handleButtonClick = button => {
    if (runningGame) {
      if (button.goToCard) setCardIndex(button.goToCard - 1);
    } else {
      setEditingButton(button);
    }
  };

  const saveButton = (text, goToCard) => {
    editingButton.text = text;
    editingButton.goToCard = goToCard;

    saveCard();

    setEditingButton(null);
  };

  const saveCard = () => {
    card.text = cardText;
    card.image = cardImageRef.current.toJSON();
    card.buttons = cardButtons;

    card.imageDataUrl = cardImageRef.current.toDataURL();

    localStorage.setItem("_gamemaker_game", JSON.stringify(game));
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
          {!runningGame && (
            <>
              <Button
                className={`mr-3 ${currentCardIndex === 0 && "text-gray-500"}`}
                onClick={() => saveAndGoToCard(currentCardIndex - 1)}
                disabled={currentCardIndex === 0}
              >
                &larr; Previous Card
              </Button>
              <span className="mr-3">{currentCardIndex + 1} / 100</span>
              <Button
                className={`mr-3 ${currentCardIndex === 99 && "text-gray-500"}`}
                onClick={() => saveAndGoToCard(currentCardIndex + 1)}
                disabled={currentCardIndex === 99}
              >
                Next Card &rarr;
              </Button>
              <Button className="mr-3">Card Settings</Button>
            </>
          )}
        </div>

        <Button
          onClick={() => {
            if (!runningGame) saveCard();
            setRunningGame(!runningGame);
          }}
        >
          {runningGame ? "Edit Game" : "Run Game!"}
        </Button>
      </div>

      {!runningGame && (
        <div className="flex items-center">
          <Button onClick={() => setTool(Tools.Pencil)}>Pencil</Button>
          <Button onClick={() => setTool(Tools.Select)}>Select</Button>
          <Button onClick={() => setTool(Tools.Line)}>Line</Button>
          <Button onClick={() => setTool(Tools.Rectangle)}>Rectangle</Button>
          <Button onClick={() => setTool(Tools.Circle)}>Circle</Button>

          <a
            className="ml-2"
            onClick={() => cardImageRef.current.removeSelected()}
          >
            Delete
          </a>
        </div>
      )}

      <div className="flex" style={{ minHeight: "300px" }}>
        <div className="border border-solid w-1/2 mr-3 bg-white">
          {runningGame ? (
            <img src={card.imageDataUrl} />
          ) : (
            <SketchField
              width="100%"
              height="100%"
              tool={tool}
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
        {cardButtons
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
