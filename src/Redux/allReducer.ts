import {combineReducers} from "redux";
import toolReducer from "./Tools/toolReducer";
import levelReducer from "./Levels/levelReducer";
import menuReducer from "./Menu/menuReducer";

// Putting all reducers into one for the store
const allReducers = combineReducers({
	toolbar: toolReducer,
	levels: levelReducer,
	menu: menuReducer
});

export default allReducers;