import {combineReducers} from "redux";
import toolReducer from "./Tools/toolReducer";
import menuReducer from "./Menu/menuReducer";
import combinedLevelReducer from "./Levels/combinedLevelsReducer";

// Putting all reducers into one for the store
const allReducers = combineReducers({
	toolbar: toolReducer,
	levels: combinedLevelReducer,
	menu: menuReducer
});

export default allReducers;