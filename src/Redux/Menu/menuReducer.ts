import { menuAction } from "./menuActions";

export interface menuState {
	options: Array<optionState>
}

export interface optionState {
	optionName: string;
	optionFunction: any
}

const initialState: menuState = {options: []};

const menuReducer = (state: menuState = initialState, action: menuAction) => {
	switch(action.type)
	{
	case "SET":
		return {options: action.payload};
	default:
		return state;
	}
}

export default menuReducer;