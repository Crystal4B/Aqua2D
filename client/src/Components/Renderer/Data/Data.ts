import { objectState } from "../../../Redux/Levels/Tilemap/tilemapReducer"
import { tileState } from "../../../Redux/Tools/toolReducer"

export interface GameScene
{
    size: {
        width: number,
        height: number
    }
    tileset: {
        tileWidth: number,
        tileHeight: number,
        image?: string
    }
    layers: {
        [layerId: string]: {
            tilemap: tileState[][]
        }
        collisions: {
            tilemap: tileState[][]
        }
    }
    connections: {
        up?: string,
        down?: string,
        left?: string,
        right?: string   
    }
    objects: objectState[]
}

export interface GameData
{
    [levelId: string]: {
        [sceneId: string]: GameScene;
    }
}

export interface Config
{
    currentLevelId: string,
    currentSceneId: string
}

class Data
{
    private static _instance: Data | undefined;
    private gameData: GameData | undefined;
    private config: Config | undefined;

    getConfig()
    {
        return this.config;
    }

    getGameData()
    {
        return this.gameData;
    }

    setConfig(newConfig: Config)
    {
        this.config = {...newConfig};
    }

    setGameData(newGameData: GameData)
    {
        this.gameData = {...newGameData};
    }

    static getInstance()
    {
        if (!this._instance)
        {
            this._instance = new Data();
        }
        return this._instance;
    }
}

export default Data;