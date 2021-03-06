import { tileState } from "../../Tools/toolReducer"
import { objectState } from "./tilemapReducer"

/**
 * Interface representing the actions available for tilemaps
 */
export interface tilemapAction
{
	type: "ADD_LEVEL" | "ADD_SCENE" | "ADD_LAYER" | "ADD_TILE" | "RESIZE_SCENE" | "RESIZE_TILES" | "REMOVE_TILE" | "ADD_OBJECT" | "MOVE_OBJECT" | "REMOVE_OBJECT" | "UPDATE_OBJECT"
	payload: {
		levelId?: string
		name?: string
		sceneId: string
		layerId: string
		xPos?: number
		yPos?: number
		tile?: tileState
		objectIndex?: number
		object?: objectState
		size?: {
			width: number,
			height: number,
		}
		tileset?: {
			tileWidth?: number,
			tileHeight?: number
		}
	}
}

/**
 * Function for creating an action for adding an object to a scene
 * @param sceneId of the parent scene
 * @param layerId of the parent scene
 * @param object the object being added
 * @returns formatted action ready for dispatch
 */
export const addObject = (sceneId: string, layerId: string, object: objectState): tilemapAction =>
{
	return {
		type: "ADD_OBJECT",
		payload: {
			sceneId: sceneId,
			layerId: layerId,
			object: object
		}
	};
}

/**
 * Function for creating an action for moving an object in a scene
 * @param sceneId of the parent scene
 * @param layerId of the parent layer
 * @param objectIndex of the object in the layer
 * @param xPos new x position
 * @param yPos new y position
 * @returns formatted action ready for dispatch
 */
export const moveObject = (sceneId: string, layerId: string, objectIndex: number, xPos: number, yPos: number) =>
{
	return {
		type: "MOVE_OBJECT",
		payload: {
			sceneId: sceneId,
			layerId: layerId,
			objectIndex: objectIndex,
			xPos: xPos,
			yPos: yPos
		}
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

/**
 * Function for creating a update action for objects in a layer
 * @param sceneId the id of the parent scene
 * @param layerId the id of the parent layer
 * @param objectIndex the index of the object in the scene
 * @param object the new object being used to update the old one
 * @returns the formatted action ready for dispatch
 */
export const updateObject = (sceneId: string, layerId: string, objectIndex: number, object: objectState): tilemapAction =>
{
	object.x = object.x as number;
	object.y = object.y as number;

	return {
		type: "UPDATE_OBJECT",
		payload: {
			sceneId: sceneId,
			layerId: layerId,
			objectIndex: objectIndex,
			object: object
		}
	}
}