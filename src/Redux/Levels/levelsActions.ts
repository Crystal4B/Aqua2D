export interface levelAction {
	type: "ADD" | "SELECT" | "RENAME" | "REMOVE";
	payload: levelPayload
}

interface levelPayload {
	parent: "ROOT" | string;
	target: string;
	newName?: string;
	newSelection?: boolean;
}

export const addLevel = (levelName: string): levelAction => {
	return {type: "ADD", payload: {parent: "ROOT", target: levelName}};
}

export const renameLevel = (levelName: string, newLevelName: string): levelAction => {
	return {type: "RENAME", payload: {parent: "ROOT", target: levelName, newName: newLevelName}};
}

export const removeLevel = (levelName: string): levelAction => {
	return {type: "REMOVE", payload: {parent: "ROOT", target: levelName}};
}

export const addScene = (levelName: string, sceneName: string): levelAction => {
	return {type: "ADD", payload: {parent: levelName, target: sceneName}};
}

export const selectScene = (levelName: string, sceneName: string, newSelection: boolean): levelAction => {
	return {type: "SELECT", payload: {parent: levelName, target: sceneName, newSelection: newSelection}};
}

export const renameScene = (levelName: string, sceneName: string, newSceneName: string): levelAction => {
	return {type: "RENAME", payload: {parent: levelName, target: sceneName, newName: newSceneName}};
}

export const removeScene = (levelName: string, sceneName: string): levelAction => {
	return {type: "REMOVE", payload: {parent: levelName, target: sceneName}};
}