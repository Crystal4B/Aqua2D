export const DEFAULT_LEVEL_ID = "Level_1";
export const DEFAULT_SCENE_ID = "Level_1_Scene_1";

/**
 * convertNameToId converts a name of an object to the format required for ids
 * @param name the name of the object being converted
 * @returns the name of the object converted to id format
 */
export const convertNameToId = (name: string): string =>
{
	const id = name.replaceAll(" ", "_");
	return id;
}