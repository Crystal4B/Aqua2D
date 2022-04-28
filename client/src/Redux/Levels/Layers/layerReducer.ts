import { convertNameToId, DEFAULT_SCENE_ID } from "../../../Helpers/LevelsReduxHelper";
import { layerAction } from "./layerActions";

/**
 * TODO: COMMENT
 */
export interface layersState
{
	byId: {
		[sceneId: string]: {
			data: {[layerId: string]: layerState}
			order: string[];
			selectedId: string;
		}
	}
}

/**
 * Interface representing a layer in a scene
 */
export interface layerState
{
	id: string;
	sceneId: string;
	layerName: string;
	locked: boolean;
	visible: boolean;
}

/**
 * Create a layer
 * @param sceneId id of parent scene
 * @param layerName desired layer name
 * @param selected boolean selection value
 * @returns layerState depicting desired layer
 */
const createNewLayer = (sceneId: string, layerName: string): layerState =>
{
	const id = `${sceneId}_${convertNameToId(layerName)}`;
	return {
		id: id,
		sceneId: sceneId,
		layerName: layerName,
		locked: false,
		visible: true
	}
}

/**
 * TODO: COMMENT
 */
const createDefaultState = (): layersState =>
{
	return {
		byId: {
			[DEFAULT_SCENE_ID]: {
				data: {
					[`${DEFAULT_SCENE_ID}_Collision`]: createNewLayer(DEFAULT_SCENE_ID, "Collision"),
					[`${DEFAULT_SCENE_ID}_Layer_1`]: createNewLayer(DEFAULT_SCENE_ID, "Layer 1")
				},
				order: [`${DEFAULT_SCENE_ID}_Layer_1`, `${DEFAULT_SCENE_ID}_Collision`],
				selectedId: `${DEFAULT_SCENE_ID}_Layer_1`
			}
		}
	}
}

/**
 * layerReducer made for parsing layer based actions in the engine
 * @param state a layerState object storing all layer data
 * @param action a layerAction object being used to update the state
 * @returns The new state of the layers
 */
const layerReducer = (state: layersState = createDefaultState(), action: layerAction): layersState =>
{
	const {type, payload} = action;
	switch(type)
	{
	case "ADD_LEVEL":
		if (!payload.levelId)
		{
			return state
		}
		var id = `${convertNameToId(payload.levelId)}_Scene_1`;
		var collision = createNewLayer(id, "Collision");
		var layer1 = createNewLayer(id, "Layer 1");
		return {
			byId: {
				...state.byId,
				[id]: {
					data: {
						[collision.id]: collision,
						[layer1.id]: layer1
					},
					order: [layer1.id, collision.id],
					selectedId: layer1.id
				}
			}
		};
	case "ADD_SCENE":
		if (!payload.levelId || Array.isArray(payload.name) || !payload.name)
		{
			return state
		}
		id = `${payload.levelId}_${convertNameToId(payload.name)}`;
		collision = createNewLayer(id, "Collision");
		layer1 = createNewLayer(id, "Layer 1");
		return {
			byId: {
				...state.byId,
				[id]: {
					data: {
						[collision.id]: collision,
						[layer1.id]: layer1
					},
					order: [layer1.id, collision.id],
					selectedId: layer1.id
				}
			}
		};
	case "ADD_LAYER":
		var option = payload.option;
		if (!option)
		{
			option = "TOP"
		}

		var name = payload.name;
		if (!Array.isArray(name))
		{
			name = Array(1).fill(name);
		}

		var newState = {};
		var newOrder = state.byId[payload.sceneId].order;
		name.forEach((layer) => {
			var layerName = layer;
			if (name === "DEFAULT")
			{
				const length = Object.entries(state).filter(([_, layerData]) => layerData.sceneId === payload.sceneId).length;
				name = `Layer ${length+1}`;
			}
			var newLayer = createNewLayer(payload.sceneId, layerName);
			newState = {
				...newState,
				[newLayer.id]: newLayer
			}
			
			switch(option)
			{
			case "TOP":
				newOrder.unshift(newLayer.id);
				break;
			case "BOTTOM":
				newOrder.push(newLayer.id);
			}
		})

		return {
			byId: {
				...state.byId,
				[payload.sceneId]: {
					...state.byId[payload.sceneId],
					data: Object.assign(state.byId[payload.sceneId].data, newState),
					order: newOrder
				}
			}
		};
	case "RENAME_LAYER":
		if (Array.isArray(payload.name) || !payload.name || !payload.layerId) return state;
		state.byId[payload.sceneId].data[payload.layerId] = {...state.byId[payload.sceneId].data[payload.layerId], layerName: payload.name};
		return state;
	case "MOVE_LAYER":
		if (!payload.layerId)
		{
			return state;
		}

		return state;
	case "SELECT_LAYER":
		if (!payload.layerId)
		{
			return state;
		}

		return {
			byId: {
				...state.byId,
				[payload.sceneId]: {
					...state.byId[payload.sceneId],
					selectedId: payload.layerId
				}
			}
		};
	case "SHOW_LAYER":
		if (!payload.layerId)
		{
			return state;
		}

		return {
			byId: {
				...state.byId,
				[payload.sceneId]: {
					...state.byId[payload.sceneId],
					data: {
						...state.byId[payload.sceneId].data,
						[payload.layerId]: {
							...state.byId[payload.sceneId].data[payload.layerId],
							visible: !state.byId[payload.sceneId].data[payload.layerId].visible
						}
					}
				}
			}
		};
	case "LOCK_LAYER":
		if (!payload.layerId)
		{
			return state;
		}

		return {
			byId: {
				...state.byId,
				[payload.sceneId]: {
					...state.byId[payload.sceneId],
					data: {
						...state.byId[payload.sceneId].data,
						[payload.layerId]: {
							...state.byId[payload.sceneId].data[payload.layerId],
							locked: !state.byId[payload.sceneId].data[payload.layerId].locked
						}
					}
				}
			}
		};
	case "REMOVE_LAYER":
		if (!payload.layerId)
		{
			return state;
		}

		const orderIndex = state.byId[payload.sceneId].order.findIndex((id) => id === payload.layerId);

		delete state.byId[payload.sceneId].data[payload.layerId];
		delete state.byId[payload.sceneId].order[orderIndex];
		return state;
	default:
		return state;
	}
}

export default layerReducer;