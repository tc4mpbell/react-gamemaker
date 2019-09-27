import { createSlice } from "redux-starter-kit";

const gameSlice = createSlice({
  slice: "game",
  initialState: { title: "", currentCard: 0, running: false },
  reducers: {
    setCurrentCard: (state, action) => {
      state.currentCard = action.payload;
    },
    setRunning: (state, action) => {
      state.running = action.payload;
    }
  }
});

export const { setCurrentCard, setRunning } = gameSlice.actions;

export default gameSlice.reducer;
