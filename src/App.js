import React from "react";
import Game from "./components/Game";
import { Provider } from "react-redux";
import { configureStore } from "redux-starter-kit";
import rootReducer from "./reducers/index";

const store = configureStore({
  reducer: rootReducer
});

const App = () => {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
};

export default App;
