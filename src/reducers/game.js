import { createSlice } from "redux-starter-kit";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { updateCard } from "./cards";

const gameSlice = createSlice({
  slice: "game",
  initialState: {
    title: "",
    currentCard: 0,
    running: false
  },
  reducers: {
    setCurrentCard: (state, action) => {
      state.currentCard = action.payload;
    },
    setRunning: (state, action) => {
      state.running = action.payload;
    }
  }
});

export const useGame = () => {
  const dispatch = useDispatch();
  const currentCardIndex = useSelector(state => state.game.currentCard);
  const running = useSelector(state => state.game.running);

  const { setCurrentCard, setRunning } = bindActionCreators(
    gameSlice.actions,
    dispatch
  );

  const saveGame = () => {
    if (window._tempCardImage) {
      dispatch(
        updateCard({
          cardIndex: currentCardIndex,
          data: { image: window._tempCardImage }
        })
      );
      window._tempCardImage = null;
    }
  };

  return {
    currentCardIndex,
    running,
    setRunning,
    saveGame,
    goToCard: cardIx => {
      if (!running) saveGame();

      setCurrentCard(cardIx);
    }
  };
};

export default gameSlice.reducer;
