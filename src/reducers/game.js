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

const { setCurrentCard, setRunning } = gameSlice.actions;

export const useGame = () => {
  const dispatch = useDispatch();
  const currentCardIndex = useSelector(state => state.game.currentCard);

  return {
    ...bindActionCreators(gameSlice.actions, dispatch),
    saveGame: () => {
      if (window._tempCardImage) {
        dispatch(
          updateCard({
            cardIndex: currentCardIndex,
            data: { image: window._tempCardImage }
          })
        );
        window._tempCardImage = null;
      }
    }
  };
};

export default gameSlice.reducer;
