export interface sceneAction
{
	type: "ADD_LEVEL" | "ADD_SCENE" | "RENAME_SCENE" | "MOVE_SCENE" | "SELECT_SCENE" | "REMOVE_SCENE" | "REMOVE_ALL_SCENES";
	payload: {
		levelId: string,
		sceneId?: string,
		name?: string,
		position?: {
			xPos: number,
			yPos: number
		}
		size?: {
			width: number,
			height: number,
		}
	}
}

/**
 * addScene generates an action for adding a scene to a level in the state
 * @param levelId the id of the parent level
 * @param sceneName the name of the scene being added
 * @param xPos the desired x position for the scene
 * @param yPos the desired y position for the scene
 * @returns the formatted action ready for dispatch
 */
export const addScene = (levelId: string, sceneName: string, xPos: number, yPos:number): sceneAction =>
{
	return {
		type: "ADD_SCENE",
		payload: {
			levelId: levelId,
			name: sceneName,
			position: {
				xPos: xPos,
				yPos: yPos
			}
		}
	}
}

/**
 * selectScene generates an action for selecting a scene from a level in the state
 * @param sceneId the id of the scene being selected
 * @returns the formatted action ready for dispatch
 */
export const selectScene = (levelId: string, sceneId: string): sceneAction =>
{
	return {
		type: "SELECT_SCENE",
		payload: {
			levelId: levelId,
			sceneId: sceneId
		}
	}
}

/**
 * moveScene generates an action for moving a scene
 * @param sceneId the id of the scene being moved
 * @param xPos the desired position on the x-axis
 * @param yPos the desired position on the y-axis
 * @returns the formatted action ready for dispatch
 */
export const moveScene = (levelId: string, sceneId: string, xPos: number, yPos: number): sceneAction =>
{
	return {
		type:"MOVE_SCENE",
		payload: {
			levelId: levelId,
			sceneId: sceneId,
			position: {
				xPos: xPos,
				yPos: yPos
			}
		}
	};
}

/**
 * renameScene generates an action for renaming a scene from a level in the state
 * @param sceneId the id of the scene being renamed
 * @param newSceneName the desired name of the scene being renamed
 * @returns the formatted action ready for dispatch
 */
export const renameScene = (levelId: string, sceneId: string, newSceneName: string): sceneAction =>
{
	return {
		type: "RENAME_SCENE",
		payload: {
			levelId: levelId,
			sceneId: sceneId,
			name: newSceneName
		}
	};
}

/**
 * removeScene generates an action for removing a scene from a level in the state
 * @param sceneName the id of the scene being removed
 * @returns the formatted action ready for dispatch
 */
export const removeScene = (levelId: string, sceneId: string): sceneAction =>
{
	return {
		type: "REMOVE_SCENE",
		payload: {
			levelId: levelId,
			sceneId: sceneId
		}
	};
}

/**
 * removeAllScenes generates an action for removing all scenes related to a specified level
 * @param levelId the id of the parent that is being cleared
 * @returns the formatted action ready for dispatch
 */
export const removeAllScenes = (levelId: string): sceneAction =>
{
	return {
		type: "REMOVE_ALL_SCENES",
		payload: {
			levelId: levelId
		}
	}
}