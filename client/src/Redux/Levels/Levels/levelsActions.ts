/**
 * levelAction interface represents the way level actions can be written
 */
export interface levelAction
{
	type: "ADD_LEVEL" | "SELECT_SCENE" | "RENAME_LEVEL" | "REMOVE_LEVEL";
	payload: {
		levelId: string,
		name?: string;
	}
}

/**
 * addLevel generates an action for adding a level to the levelState
 * @param levelName the name of the level being added
 * @returns the formatted action ready for dispatch
 */
export const addLevel = (levelName: string): levelAction =>
{
	return {
		type: "ADD_LEVEL",
		payload: {
			levelId: levelName
		}
	};
}

/**
 * renameLevel generates an action for renaming a level in the levelState
 * @param levelId the id of the level being renamed
 * @param newLevelName the desired name for the level being renamed
 * @returns the formatted action ready for dispatch
 */
export const renameLevel = (levelId: string, newLevelName: string): levelAction =>
{
	return {
		type: "RENAME_LEVEL",
		payload: {
			levelId: levelId,
			name: newLevelName
		}
	};
}

/**
 * removeLevel generates an action for removing a level from the state
 * @param levelId the id of the level being removed
 * @returns the formatted action ready for dispatch
 */
export const removeLevel = (levelId: string): levelAction =>
{
	return {
		type: "REMOVE_LEVEL",
		payload: {
			levelId: levelId
		}
	};
}