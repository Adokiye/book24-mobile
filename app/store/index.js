import AsyncStorage from "@react-native-community/async-storage";
import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "app/reducers";

/**
 * Redux Setting
 */
let middleware = [thunk];
if (process.env.NODE_ENV === `development`) {
  middleware.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middleware));
export { store};
