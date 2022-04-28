import { CombinedState } from "redux";
import { layersState } from "../../Redux/Levels/Layers/layerReducer";
import { levelsState } from "../../Redux/Levels/Levels/levelReducer";
import { PropertiesState } from "../../Redux/Levels/Properties/PropertiesReducer";
import { scenesState } from "../../Redux/Levels/Scenes/sceneReducer";
import { tilemapsState } from "../../Redux/Levels/Tilemap/tilemapReducer";
import { GameData } from "./Data/Data";

const compile = (data: CombinedState<{
    levels: levelsState;
    scenes: scenesState;
    layers: layersState;
    tilemaps: tilemapsState;
    properties: PropertiesState;
}>) =>
{
    let gameData: GameData = {};

    for (const level of Object.values(data.levels.byId))
    {
        for (const scene of Object.values(data.scenes.byId[level.id].data))
        {
            gameData[level.id] = {
                ...gameData[level.id],
                [scene.id]: {
                    size: {
                        width: scene.size.width,
                        height: scene.size.height
                    },
                    tileset: {
                        tileWidth: scene.tileset.tileWidth,
                        tileHeight: scene.tileset.tileHeight,
                        image: scene.tileset.image
                    },
                    layers: {
                        collisions: {
                            tilemap: []
                        }
                    },
                    objects: []
                }
            }

            const layerOrder = data.layers.byId[scene.id].order;

            for (const layerId of layerOrder)
            {
                const tilemap = data.tilemaps.byId[scene.id].data[layerId];

                var objects = gameData[level.id][scene.id].objects;
                objects = objects.concat(tilemap.objects);

                if (layerId.includes("Collision"))
                {
                    gameData[level.id][scene.id] = {
                        ...gameData[level.id][scene.id],
                        layers: {
                            ...gameData[level.id][scene.id].layers,
                            collisions: {
                                tilemap: tilemap.tilemap
                            }
                        },
                        objects: objects
                    }
                } else {
                    gameData[level.id][scene.id] = {
                        ...gameData[level.id][scene.id],
                        layers: {
                            ...gameData[level.id][scene.id].layers,
                            [layerId]: {
                                tilemap: tilemap.tilemap,
                            }
                        },
                        objects: objects
                    }
                }

            }
        }
    }

    return gameData;
}

export default compile;