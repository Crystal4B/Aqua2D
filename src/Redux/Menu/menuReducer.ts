import { menuAction } from "./menuActions";

/**
 * menuState interface represents the data ContextMenu uses for display
 */
export interface menuState {
	options: Array<optionState>
}

/**
 * optionState interface represents a single option inside the ContextMenu
 */
export interface optionState {
	optionName: string;
	optionFunction: any
}

/**
 * initialState is the initial state for the menuReducer
 */
const initialState: menuState = {options: []};

const menuReducer = (state: menuState = initialState, action: menuAction): menuState => {
	switch(action.type)
	{
	case "SET":
		return {options: action.payload};
	default:
		return state;
	}
}

export default menuReducer;