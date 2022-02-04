import { toolActions } from "./toolActions";

export type toolState = number;

const initialState = 0

const toolReducer = (state: toolState = initialState, action: toolActions) => {
	switch(action.type)
	{
	case 'MOVE':
		return state = 0;
	case 'DRAW':
		return state = 1;
	case 'ERASE':
		return state = 2;
	case 'FILL':
		return state = 3;
	default:
		return state;
	}
}

export default toolReducer;