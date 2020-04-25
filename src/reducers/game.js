import { createSlice } from "@reduxjs/toolkit";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { updateCard } from "./cards";

const gameSlice = createSlice({
  name: "game",
  initialState: {
    title: "",
    currentCard: 0,
    running: false,
  },
  reducers: {
    loadGame: (state, action) => {
      return action.payload.game;
    },
    setCurrentCard: (state, action) => {
      state.currentCard = action.payload;
    },
    setRunning: (state, action) => {
      state.running = action.payload;
    },
  },
});

export const useGame = () => {
  const dispatch = useDispatch();
  const currentCardIndex = useSelector((state) => state.game.currentCard);
  const running = useSelector((state) => state.game.running);

  const {
    loadGame,
    setCurrentCard,
    setRunning: _setRunning,
  } = bindActionCreators(gameSlice.actions, dispatch);

  const saveGame = () => {
    if (window._tempCardImage) {
      dispatch(
        updateCard({
          cardIndex: currentCardIndex,
          data: { image: window._tempCardImage },
        })
      );
      window._tempCardImage = null;
    }
  };

  return {
    currentCardIndex,
    loadGame: loadGame,
    running,
    setRunning: (running) => {
      saveGame();
      _setRunning(running);
    },
    saveGame,
    goToCard: (cardIx) => {
      if (!running) saveGame();

      setCurrentCard(cardIx);
    },
  };
};

export const { loadGame } = gameSlice.actions;
export default gameSlice.reducer;
