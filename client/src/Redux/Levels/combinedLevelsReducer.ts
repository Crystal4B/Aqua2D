import {combineReducers} from "redux";
import layerReducer from "./Layers/layerReducer";
import levelReducer from "./Levels/levelReducer";
import sceneReducer from "./Scenes/sceneReducer";
import tilemapReducer from "./Tilemap/tilemapReducer";

const combinedLevelReducer = combineReducers({
	levels: levelReducer,
	scenes: sceneReducer,
	layers: layerReducer,
	tilemaps: tilemapReducer
})

export default combinedLevelReducer;