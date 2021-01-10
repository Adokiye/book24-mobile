import { combineReducers } from "redux";
import AuthReducer from "./auth";
import ApplicationReducer from "./application";
import order from "./order";

export default combineReducers({
  auth: AuthReducer,
  application: ApplicationReducer,
  order
});
