import { createSlice } from "redux-starter-kit";
import cardTemplate from "../data/cardTemplate";

function make100Cards() {
  return [...Array(100)].map((a, ix) => {
    return JSON.parse(JSON.stringify(cardTemplate));
  });
}

// Make all the cards up front...
// Was doing this on demand, but was flaky.
const initState = make100Cards();

const cardSlice = createSlice({
  slice: "cards",
  initialState: initState,
  reducers: {
    addCard: (state, action) => {
      console.log("Adding cards");
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
