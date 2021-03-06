import { createSlice } from "@reduxjs/toolkit";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import cardTemplate from "../data/cardTemplate";

import { loadGame } from "./game";

function make100Cards() {
  return [...Array(100)].map((a, ix) => {
    return JSON.parse(JSON.stringify(cardTemplate));
  });
}

// Make all the cards up front...
// Was doing this on demand, but was flaky.
const initState = make100Cards();

const cardsSlice = createSlice({
  name: "cards",
  initialState: initState,
  reducers: {
    addCard: (state, action) => {
      state.push(action.payload);
    },
    updateCard: (state, action) => {
      const { data, cardIndex } = action.payload;
      state[cardIndex] = {
        ...state[cardIndex],
        ...data,
      };
    },
  },
  extraReducers: {
    "game/loadGame": (state, action) => {
      return action.payload.cards;
    },
  },
});

export const { addCard, updateCard } = cardsSlice.actions;

export const useCards = () => {
  const dispatch = useDispatch();
  const currentCardIndex = useSelector((state) => state.game.currentCard);
  const currentCard = useSelector((state) => state.cards[currentCardIndex]);

  const boundActions = bindActionCreators(cardsSlice.actions, dispatch);

  return {
    ...boundActions,
    current: currentCard,
    updateCurrent: (data) => {
      boundActions.updateCard({ cardIndex: currentCardIndex, data });
    },
  };
};

export default cardsSlice.reducer;
