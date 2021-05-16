import { init } from "@rematch/core";
import * as models from "./models";

const store = init({
  models,
});

const getState = store.getState;
const getDispatch = store.dispatch;
export { getState, getDispatch };
export default store;
