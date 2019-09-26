import React, { useRef, useState, useEffect } from "react";
import { SketchField, Tools } from "react-sketch";

// import Polygon from "./PolygonTool";

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
    <a
      className={`block text-center shadow border rounded p-2 bg-white ${className}`}
      {...props}
    >
      {children || "Untitled"}
    </a>
  );
};

const Label = props => <label className="font-bold mr-2" {...props} />;

const H5 = ({ className, ...props }) => (
  <h5 className={`text-sm font-bold uppercase ${className}`} {...props} />
);
const Input = ({ className, ...props }) => (
  <input className={`p-2 border border-solid ${className}`} {...props} />
);

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
  let savedGame = localStorage.getItem("_gamemaker_game");
  if (savedGame) savedGame = JSON.parse(savedGame);

  const initialGameState = savedGame || {
    title: "My game",
    cards: [JSON.parse(JSON.stringify(cardTemplate))]
  };

  const [game, setGame] = useState(initialGameState);
  const [currentCardIndex, setCardIndex] = useState(0);
  const [card, setCard] = useState(game.cards[currentCardIndex]);
  const [timeouts, setTimeouts] = useState({});

  const [runningGame, setRunningGame] = useState(false);

  const [editingButton, setEditingButton] = useState(null);
  const [tool, setTool] = useState(Tools.Pencil);
  const [fillColor, setFillColor] = useState("transparent");
  const [lineColor, setLineColor] = useState("black");
  const [copiedScene, setCopiedScene] = useState(null);

  const cardImageRef = useRef(null);

  const [tempCardImageJSON, setTempCardImageJSON] = useState({
    [currentCardIndex]: card.image
  });

  const goToCard = cardIx => {
    let _card = game.cards[currentCardIndex];
    setCard(_card);

    if (!_card.image) cardImageRef.current.clear();
  };

  useEffect(() => {
    // If the cards array doesn't have an entry for this ix, make one.
    if (currentCardIndex > game.cards.length - 1) {
      const clonedTemplate = JSON.parse(JSON.stringify(cardTemplate));

      setGame({
        ...game,
        cards: [...game.cards, clonedTemplate]
      });
    }

    if (game.cards.length - 1 >= currentCardIndex) {
      goToCard(currentCardIndex);
    }
  }, [game, currentCardIndex]);

  // Save game to localstorage
  useEffect(() => {
    saveGame();
  }, [game]);

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
    if (!runningGame) {
      if (e.key === "Backspace") cardImageRef.current.removeSelected();
      else if (e.key === "c" && e.metaKey) {
        console.log("copy!", card.image);
        setCopiedScene(card.image);
      } else if (e.key === "v" && e.metaKey) {
        console.log("PASTE!", copiedScene);
        // seems like this should work, but doesn't... why is copiedScene null?
        cardImageRef.current.fromJSON(copiedScene);
        setTempCardImageJSON({
          ...tempCardImageJSON,
          [currentCardIndex]: cardImageRef.current.toJSON()
        });
        saveCard(currentCardIndex);
      }
    }
  };

  // TODO need effect?
  useEffect(() => {
    if (runningGame && card.delay && card.redirectToCard) {
      // set a timer, then redirect away from this card (animation!)
      const _timeoutId = setTimeout(() => {
        setCardIndex(card.redirectToCard - 1);
      }, card.delay);
      setTimeouts({ ...timeouts, [currentCardIndex]: _timeoutId });
    }
    return () => {
      if (timeouts[currentCardIndex]) {
        clearTimeout(timeouts[currentCardIndex]);
        setTimeouts({ ...timeouts, [currentCardIndex]: null });
      }
    };
  }, [runningGame, card]);

  const handleButtonClick = button => {
    if (runningGame) {
      if (button.goToCard) setCardIndex(button.goToCard - 1);
    } else {
      setEditingButton(button);
    }
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

  const loadGameFromFile = e => {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      console.log("target", e.target.result);
      setGame(JSON.parse(e.target.result));
    };
    reader.readAsText(file);
  };

  const exportGame = e => {
    var json = JSON.stringify(game);
    var jsonData =
      "data:application/json;charset=utf-8," + encodeURIComponent(json);
    e.target.href = jsonData;
    e.target.target = "_blank";
    e.target.download = `${game.title}.txt`;
  };

  const saveGame = () => {
    localStorage.setItem("_gamemaker_game", JSON.stringify(game));
  };

  const saveAndGoToCard = cardNumber => {
    saveCard(currentCardIndex);
    setCardIndex(cardNumber);
  };

  return (
    <div className="p-6 bg-gray-200 mx-auto" style={{ width: "900px" }}>
      {editingButton && (
        <EditButton button={editingButton} handleSave={saveButton} />
      )}

      <div className="mb-3 flex items-center">
        <Button className="mr-4" onClick={exportGame}>
          Export
        </Button>
        <label className="mr-2">Load Game: </label>
        <input type="file" onChange={loadGameFromFile} />
      </div>

      <div className="mb-3 flex justify-between">
        <div>
          {!runningGame && (
            <div className="flex items-center justify-between">
              <Button
                className={`mr-3 ${currentCardIndex === 0 && "text-gray-500"}`}
                onClick={() => saveAndGoToCard(currentCardIndex - 1)}
                disabled={currentCardIndex === 0}
              >
                &larr; Previous Card
              </Button>
              <span className="mr-3">{currentCardIndex + 1} / 100</span>
              <Button
                className={` ${currentCardIndex === 99 && "text-gray-500"}`}
                onClick={() => saveAndGoToCard(currentCardIndex + 1)}
                disabled={currentCardIndex === 99}
              >
                Next Card &rarr;
              </Button>

              <div className="mx-8 px-8 border-l border-r border-gray-400 flex items-center">
                <div className="flex justify-between items-center mr-3">
                  <Label>Delay:</Label>
                  <Input
                    className="w-16"
                    type="text"
                    onChange={e =>
                      updateCard(currentCardIndex, { delay: e.target.value })
                    }
                    value={card.delay || ""}
                  />
                </div>

                <div className="flex justify-between items-center mr-3">
                  <Label>Go to card:</Label>
                  <Input
                    className="w-16"
                    type="number"
                    onChange={e =>
                      updateCard(currentCardIndex, {
                        redirectToCard: e.target.value
                      })
                    }
                    value={card.redirectToCard || ""}
                  />
                </div>
              </div>
            </div>
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
        <div className="flex items-center mb-4">
          <Button onClick={() => setTool(Tools.Pencil)}>Pencil</Button>
          <Button onClick={() => setTool(Tools.Polygon)}>Polygon</Button>
          <Button onClick={() => setTool(Tools.Select)}>Select</Button>
          <Button onClick={() => setTool(Tools.Line)}>Line</Button>
          <Button onClick={() => setTool(Tools.Rectangle)}>Rectangle</Button>
          <Button onClick={() => setTool(Tools.Circle)}>Circle</Button>
          <Button>
            <input
              type="color"
              onChange={e => {
                const selected = cardImageRef.current._fc.getActiveObject();
                if (selected) {
                  cardImageRef.current._fc
                    .getActiveObject()
                    .set("fill", e.target.value);

                  // cardImageRef.current._fc.getActiveObject().canvas.backgroundColor =
                  //   "red";
                  console.log(cardImageRef.current._fc.getActiveObject());
                }
                setFillColor(e.target.value);

                cardImageRef.current._fc.renderAll();
              }}
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
            onChange={e =>
              updateCard(currentCardIndex, { text: e.target.value })
            }
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
