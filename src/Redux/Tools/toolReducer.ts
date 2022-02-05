import { toolAction } from "./toolActions";

export interface toolState
{
	tool: string;
	tile: {
		asset: ImageData | undefined;
		rotation: number;
	};
};

const initialState: toolState = {
	tool: "Move",
	tile: {
		asset: undefined,
		rotation: 0,
	}
}

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