import {DEFAULT_SCENE_ID} from "../../../Helpers/LevelsReduxHelper";

export interface PropertiesState
{
	focusedId: string
	focusedType: string
}

export interface PropertiesAction
{
	type: "SELECT_SCENE" | "SELECT_LAYER" | "SELECT_OBJECT"
	payload: {
		levelId?: string
		sceneId?: string
		layerId?: string
		objectIndex?: number
	}
}

const initialState: PropertiesState = {
	focusedId: DEFAULT_SCENE_ID,
	focusedType: "Scene"
}

const PropertiesReducer = (state: PropertiesState = initialState, action: PropertiesAction): PropertiesState => {
	switch(action.type)
	{
	case "SELECT_SCENE":
		if (!action.payload.sceneId)
			return state

		return {
			focusedId: action.payload.sceneId,
			focusedType: "Scene"
		};
	case "SELECT_OBJECT":
		console.log(action);
		return state;
	default:
		return state;
	}
}

export default PropertiesReducer;