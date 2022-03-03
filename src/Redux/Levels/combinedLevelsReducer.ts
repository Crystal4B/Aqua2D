import {combineReducers} from "redux";
import layerReducer from "./Layers/layerReducer";
import levelReducer from "./Levels/levelReducer";
import sceneReducer from "./Scenes/sceneReducer";

const combinedLevelReducer = combineReducers({
	levels: levelReducer,
	scenes: sceneReducer,
	layers: layerReducer
})

export default combinedLevelReducer;