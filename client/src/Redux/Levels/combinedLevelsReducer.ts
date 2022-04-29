import {combineReducers} from "redux";
import layerReducer from "./Layers/layerReducer";
import levelReducer from "./Levels/levelReducer";
import PropertiesReducer from "./Properties/PropertiesReducer";
import sceneReducer from "./Scenes/sceneReducer";
import tilemapReducer from "./Tilemap/tilemapReducer";

/**
 * Function combining the Level Reducers
 */
const combinedLevelReducer = combineReducers({
	levels: levelReducer,
	scenes: sceneReducer,
	layers: layerReducer,
	tilemaps: tilemapReducer,
	properties: PropertiesReducer
})

export default combinedLevelReducer;