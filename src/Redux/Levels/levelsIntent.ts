type state = "LEVEL" | "SCENE" | "LAYER";

/**
 * levelsIntent interface represents the intended action for the levels state
 */
export interface levelsIntent
{
	type: string;
	state: state;
	payload: {
		levelName: string | undefined;
		sceneName: string | undefined;
		layerName: string | undefined;
	}
}

/**
 * addIntent generates an intent for adding a level, scene or layer to the levelState
 * @param levelName the name or id of the level if applicable
 * @param sceneName the name or id of the scene if applicable
 * @param layerName the name or id of the layer if applicable
 * @returns the formatted intent ready for dispatch
 */
export const addIntent = (state: state, levelName?: string, sceneName?: string, layerName?: string, xPos?: number, yPos?: number): levelsIntent =>
{
	 return {
		type: "ADD",
		state: state,
		payload: {
			levelName: levelName,
			sceneName: sceneName,
			layerName: layerName
		}
	};
}

/**
 * removeIntent generates an intent for removing a level, scene or layer from the levelState
 * @param levelName the name or id of the level if applicable
 * @param sceneName the name or id of the scene if applicable
 * @param layerName the name or id of the layer if applicable
 * @returns the formatted intent ready for dispatch
 */
 export const removeIntent = (state: state, levelName?: string, sceneName?: string, layerName?: string): levelsIntent =>
 {
	  return {
		 type: "REMOVE",
		 state: state,
		 payload: {
			 levelName: levelName,
			 sceneName: sceneName,
			 layerName: layerName
		 }
	 };
 }