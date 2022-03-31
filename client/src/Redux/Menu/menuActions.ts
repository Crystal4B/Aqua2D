import {optionState} from "./menuReducer";

/**
 * Interface representing a menuAction
 */
export interface menuAction
{
	type: "SET",
	payload: Array<optionState>
}

/**
 * Method to generate a setOptions action for the MenuState
 * @param options Array of option states that will be available for use
 * @returns The action JSON for setting options
 */
export const setOptions = (options: Array<optionState>): menuAction =>
{
	return {type: "SET", payload: options};
}