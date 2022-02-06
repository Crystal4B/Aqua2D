/**
 * levelAction interface represents the way level actions can be written
 */
export interface levelAction {
	type: "ADD" | "SELECT" | "RENAME" | "REMOVE";
	payload: levelPayload
}

/**
 * levelPayload interface represents the way level actions payload can be written
 */
interface levelPayload {
	parent: "ROOT" | string;
	target: "DEFAULT" | string;
	newName?: string;
}

/**
 * addLevel generates an action for adding a level to the levelState
 * @param levelName the name of the level being added
 * @returns the formatted action ready for dispatch
 */
export const addLevel = (levelName: string): levelAction => {
	return {type: "ADD", payload: {parent: "ROOT", target: levelName}};
}

/**
 * renameLevel generates an action for renaming a level in the levelState
 * @param levelName the original name of the level being renamed
 * @param newLevelName the desired name for the level being renamed
 * @returns the formatted action ready for dispatch
 */
export const renameLevel = (levelName: string, newLevelName: string): levelAction => {
	return {type: "RENAME", payload: {parent: "ROOT", target: levelName, newName: newLevelName}};
}

/**
 * removeLevel generates an action for removing a level from the state
 * @param levelName the name of the level being removed
 * @returns the formatted action ready for dispatch
 */
export const removeLevel = (levelName: string): levelAction => {
	return {type: "REMOVE", payload: {parent: "ROOT", target: levelName}};
}

/**
 * addScene generates an action for adding a scene to a level in the state
 * @param levelName the name of the level that owns the new scene
 * @param sceneName the name of the scene being added
 * @returns the formatted action ready for dispatch
 */
export const addScene = (levelName: string, sceneName: string): levelAction => {
	return {type: "ADD", payload: {parent: levelName, target: sceneName}};
}

/**
 * selectScene generates an action for selecting a scene from a level in the state
 * @param levelName the name of the level that owns the selected scene
 * @param sceneName the name of the scene being selected
 * @returns the formatted action ready for dispatch
 */
export const selectScene = (levelName: string, sceneName: string): levelAction => {
	return {type: "SELECT", payload: {parent: levelName, target: sceneName}};
}

/**
 * renameScene generates an action for renaming a scene from a level in the state
 * @param levelName the name of the level that owns the scene being renamed
 * @param sceneName the original name of the scene being renamed
 * @param newSceneName the desired name of the scene being renamed
 * @returns the formatted action ready for dispatch
 */
export const renameScene = (levelName: string, sceneName: string, newSceneName: string): levelAction => {
	return {type: "RENAME", payload: {parent: levelName, target: sceneName, newName: newSceneName}};
}

/**
 * removeScene generates an action for removing a scene from a level in the state
 * @param levelName the name of the level that owns the scene being removed
 * @param sceneName the name of the scene being removed
 * @returns the formatted action ready for dispatch
 */
export const removeScene = (levelName: string, sceneName: string): levelAction => {
	return {type: "REMOVE", payload: {parent: levelName, target: sceneName}};
}