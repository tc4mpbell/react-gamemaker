import { createSlice } from "redux-starter-kit";
import cardTemplate from "../data/cardTemplate";

const cardSlice = createSlice({
  slice: "card",
  initialState: [],
  reducers: {
    addCard: (state, action) => {
      state.push(action.payload);
    },
    updateCard: (state, action) => {
      console.log("Updatecard", action);
      const { data, cardIndex } = action.payload;
      state[cardIndex] = {
        ...state[cardIndex],
        ...data
      };
    }
  }
});

export const { addCard, updateCard } = cardSlice.actions;

export default cardSlice.reducer;
