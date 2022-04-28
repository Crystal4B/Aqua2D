import {DEFAULT_SCENE_ID} from "../../../Helpers/LevelsReduxHelper";
import { PropertiesAction } from "./PropertiesActions";

export interface PropertiesState
{
	focusedId: string
	focusedType: string
	startLevelId: string
	startSceneId: string
}

const initialState: PropertiesState = {
	focusedId: DEFAULT_SCENE_ID,
	focusedType: "Scene",
	startLevelId: "Level_1",
	startSceneId: "Level_1_Scene_1"
}

const PropertiesReducer = (state: PropertiesState = initialState, action: PropertiesAction): PropertiesState => {
	switch(action.type)
	{
	case "SELECT_SCENE":
		if (!action.payload.sceneId)
			return state

		return {
			...state,
			focusedId: action.payload.sceneId,
			focusedType: "Scene"
		};
	case "SELECT_OBJECT":
		if (!action.payload.sceneId || !action.payload.layerId || action.payload.objectIndex === undefined)
			return state;

		return {
			...state,
			focusedId: action.payload.objectIndex.toString(),
			focusedType: "Object"
		}
	default:
		return state;
	}
}

export default PropertiesReducer;