import React, { useRef, useState, useEffect } from "react";
import { SketchField, Tools } from "react-sketch";

const cardTemplate = {
  image: null,
  text: "",
  delay: null,
  redirectToCard: null,
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

const CardSettings = ({ handleSave, card }) => {
  // Card settings: timeout/gotocard
  const [delay, setDelay] = useState(card.delay || "");
  const [goToCard, setDestinationCard] = useState(card.redirectToCard || "");

  return (
    <>
      <div className="fixed w-full h-full bg-gray-600 left-0 top-0 opacity-50 z-10"></div>
      <div className="fixed w-full h-full left-0 top-0 z-10">
        <div className="mt-4 mx-auto p-4 border border-solid bg-white max-w-xs">
          <div className="flex justify-between items-center mb-3">
            <Label>Delay:</Label>
            <Input
              type="text"
              onChange={e => setDelay(e.target.value)}
              value={delay}
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
            onClick={() => handleSave(delay, goToCard)}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

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
  let _timeoutId = null;
  let savedGame = localStorage.getItem("_gamemaker_game");
  if (savedGame) savedGame = JSON.parse(savedGame);

  const initialGameState = savedGame || {
    title: "My game",
    cards: [JSON.parse(JSON.stringify(cardTemplate))]
  };

  const [game, setGame] = useState(initialGameState);
  const [currentCardIndex, setCardIndex] = useState(0);
  const [card, setCard] = useState(game.cards[currentCardIndex]);

  const [tempCardImageJSON, setTempCardImageJSON] = useState({
    [currentCardIndex]: card.image
  });

  useEffect(() => {
    // If the cards array doesn't have an entry for this ix, make one.
    if (currentCardIndex > game.cards.length - 1) {
      const clonedTemplate = JSON.parse(JSON.stringify(cardTemplate));

      setGame({
        ...game,
        cards: [...game.cards, clonedTemplate]
      });
    }

    if (game.cards.length - 1 >= currentCardIndex)
      setCard(game.cards[currentCardIndex]);
  }, [game, currentCardIndex]);

  useEffect(() => {
    if (!card.image) cardImageRef.current.clear();
  }, [card]);

  // Save game to localstorage
  useEffect(() => {
    saveGame();
  }, [game]);

  // const card = game.cards[currentCardIndex];

  const [runningGame, setRunningGame] = useState(false);
  const [editingCardSettings, setShowCardSettings] = useState(null);

  const [editingButton, setEditingButton] = useState(null);
  const [tool, setTool] = useState(Tools.Pencil);
  const [fillColor, setFillColor] = useState("transparent");
  const [lineColor, setLineColor] = useState("black");
  const [copiedScene, setCopiedScene] = useState(null);

  // const [cardButtons, setCardButtons] = useState(card.buttons);

  const cardImageRef = useRef(null);

  useEffect(() => {
    window.addEventListener("keyup", handleBackspacePress);

    return () => {
      window.removeEventListener("keyup", handleBackspacePress);
    };
  }, []);

  const handleBackspacePress = e => {
    if (!runningGame && e.key === "Backspace")
      cardImageRef.current.removeSelected();
  };

  // useEffect(() => {
  //   setCardText(card.text);
  //   setCardImage(card.image);
  //   setCardButtons(card.buttons);
  // }, [currentCardIndex, runningGame]);

  // TODO need effect?
  useEffect(() => {
    if (runningGame && card.delay && card.redirectToCard) {
      // set a timer, then redirect away from this card (animation!)
      _timeoutId = setTimeout(() => {
        setCardIndex(card.redirectToCard - 1);
      }, card.delay);
    }
    return () => {
      if (_timeoutId) {
        clearTimeout(_timeoutId);
      }
    };
  }, [runningGame, currentCardIndex]);

  const handleButtonClick = button => {
    if (runningGame) {
      if (button.goToCard) setCardIndex(button.goToCard - 1);
    } else {
      setEditingButton(button);
    }
  };

  const saveCardSettings = (delay, redirectToCardNumber) => {
    card.delay = delay;
    card.redirectToCard = redirectToCardNumber;

    saveCard();

    setShowCardSettings(null);
  };

  const saveButton = (text, goToCard) => {
    const newButtons = card.buttons.map(btn => {
      if (btn !== editingButton) return btn;

      return { text, goToCard };
    });

    updateCard(currentCardIndex, { buttons: newButtons });

    setEditingButton(null);
  };

  const updateCard = (cardIx, cardChanges) => {
    setGame({
      ...game,
      cards: game.cards.map((card, ix) => {
        if (ix !== cardIx) return card;

        return { ...card, ...cardChanges };
      })
    });
  };

  const saveCard = ix => {
    updateCard(ix, {
      image: tempCardImageJSON[ix]
    });
  };

  const saveGame = () => {
    localStorage.setItem("_gamemaker_game", JSON.stringify(game));
  };

  const saveAndGoToCard = cardNumber => {
    saveCard(currentCardIndex);
    _setCardIx(cardNumber);
  };

  const _setCardIx = ix => {
    setCardIndex(ix);
  };

  return (
    <div className="p-6 bg-gray-200 mx-auto" style={{ maxWidth: "900px" }}>
      {editingButton && (
        <EditButton button={editingButton} handleSave={saveButton} />
      )}

      {editingCardSettings && (
        <CardSettings
          card={editingCardSettings}
          handleSave={saveCardSettings}
        />
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
              <Button
                className="mr-3"
                onClick={() => setShowCardSettings(card)}
              >
                Card Settings
              </Button>
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
          <Button>
            <input
              type="color"
              onChange={e => setFillColor(e.target.value)}
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
            <SketchField
              width="100%"
              height="100%"
              tool={null}
              value={card.image}
              ref={cardImageRef}
            />
          ) : (
            <SketchField
              width="100%"
              height="100%"
              tool={tool}
              lineColor={lineColor}
              fillColor={fillColor}
              lineWidth={3}
              value={card.image}
              onChange={() => {
                setTempCardImageJSON({
                  ...tempCardImageJSON,
                  [currentCardIndex]: cardImageRef.current.toJSON()
                });
              }}
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
            onChange={e => updateCard({ text: e.target.value })}
            value={card.text}
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
