import toolReducer from "./Tools/toolReducer";
import levelReducer from "./Levels/levelReducer";
import {combineReducers} from "redux";
import menuReducer from "./Menu/menuReducer";

const allReducers = combineReducers({
	tool: toolReducer,
	levels: levelReducer,
	menu: menuReducer
});

export default allReducers;