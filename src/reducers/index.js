import { combineReducers } from "redux";
import gameReducer from "./game";
import cardReducer from "./cards";

export default combineReducers({
  game: gameReducer,
  cards: cardReducer
});
