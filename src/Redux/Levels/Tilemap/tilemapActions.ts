import { tileState } from "../../Tools/toolReducer"

/**
 * TODO: COMMENT
 */
export interface tilemapAction
{
	type: "ADD_LEVEL" | "ADD_SCENE" | "ADD_LAYER" | "ADD_TILE" | "REMOVE_TILE"
	payload: {
		levelId?: string,
		name?: string,
		sceneId: string,
		layerId: string,
		xPos: number,
		yPos: number,
		tile?: tileState
	}
}

/**
 * Function for creating an action for adding a tile to a layer in a scene
 * @param sceneId of the parent scene
 * @param layerId of the layer being edited
 * @param xPos of tile on the grid
 * @param yPos of tile on the grid
 * @param tile the tile being placed
 * @returns prepared action ready for dispatch
 */
export const setTile = (sceneId: string, layerId: string, xPos: number, yPos: number, tile: tileState): tilemapAction =>
{
	return {
		type: "ADD_TILE",
		payload: {
			sceneId: sceneId,
			layerId: layerId,
			xPos: xPos,
			yPos: yPos,
			tile: tile
		}
	};
}

/**
 * Function for creating an action for removing a tile from a layer in a scene
 * @param sceneId of the parent scene
 * @param layerId of the layer being edited
 * @param xPos of tile on the grid
 * @param yPos of tile on the grid
 * @returns prepared action ready for dispatch
 */
export const resetTile = (sceneId: string, layerId: string, xPos: number, yPos: number): tilemapAction =>
{
	return {
		type: "REMOVE_TILE",
		payload: {
			sceneId: sceneId,
			layerId: layerId,
			xPos: xPos,
			yPos: yPos,
		}
	};
}