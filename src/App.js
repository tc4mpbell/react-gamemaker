import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./reducers/index";

import Game from "./components/Game";

const store = configureStore({
  reducer: rootReducer,
});

const App = () => {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
};

export default App;
