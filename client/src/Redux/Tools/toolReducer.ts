import { toolAction } from "./toolActions";

/**
 * toolState represents the tool settings for drawing on canvases
 */
export interface toolState
{
	tool: string;
	tile: tileState;
};

/**
 * interface representing the state of a tile in the scene
 */
export interface tileState
{
	xCoord: number;
	yCoord: number;
	rotation: number;
}

/**
 * initial sstate for the toolReducer
 */
const initialState: toolState =
{
	tool: "Move",
	tile: {
		xCoord: -1,
		yCoord: -1,
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
	case "SWITCHTILE":
		var xCoord = state.tile.xCoord;
		var yCoord = state.tile.yCoord;
		if (action.payload.tile?.xCoord !== undefined && action.payload.tile?.yCoord !== undefined)
		{
			xCoord = action.payload.tile?.xCoord;
			yCoord = action.payload.tile?.yCoord;
		}

		return {...state, tile: {...state.tile, xCoord: xCoord, yCoord: yCoord}}
	case "ROTATETILE":
		var rotation = state.tile.rotation;
		if (action.payload.tile?.rotation)
		{
			rotation += action.payload.tile.rotation;
		}
		return {...state, tile: {...state.tile, rotation: rotation}};
	default:
		return state;
	}
}

export default toolReducer;