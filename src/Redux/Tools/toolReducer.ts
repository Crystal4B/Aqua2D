import { toolAction } from "./toolActions";

/**
 * toolState represents the tool settings for drawing on canvases
 */
export interface toolState
{
	tool: string;
	tile: {
		asset: ImageData | undefined;
		rotation: number;
	};
};

/**
 * initial sstate for the toolReducer
 */
const initialState: toolState = {
	tool: "Move",
	tile: {
		asset: undefined,
		rotation: 0,
	}
}

/**
 * toolReducer handles actions and state for the tileset panel including toolbar
 * @param state the state of the tool selection menu
 * @param action the action being executed on state
 * @returns the new state after the action was executed
 */
const toolReducer = (state: toolState = initialState, action: toolAction): toolState => {
	switch(action.type)
	{
	case "SWITCHTOOL":
		if (action.payload.tool !== undefined)
		{
			return {...state, tool: action.payload.tool};
		}
		return state;
	case "SWITCHASSET":
		return {...state, tile: {...state.tile, asset: action.payload.asset}}
	case "ROTATEASSET":
		return state;
	default:
		return state;
	}
}

export default toolReducer;