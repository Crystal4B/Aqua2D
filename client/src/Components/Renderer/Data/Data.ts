import { objectState } from "../../../Redux/Levels/Tilemap/tilemapReducer"
import { tileState } from "../../../Redux/Tools/toolReducer"

/**
 * Interface representing the entire scene data
 */
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

/**
 * Interface representing the entire game data
 */
export interface GameData
{
    [levelId: string]: {
        [sceneId: string]: GameScene;
    }
}

/**
 * Interface representing the game config
 */
export interface Config
{
    currentLevelId: string,
    currentSceneId: string
}

/**
 * Singleton Data class handling the storing and accessing of data
 */
class Data
{
    private static _instance: Data | undefined;
    private gameData: GameData | undefined;
    private config: Config | undefined;

    /**
     * Simple config getter
     * @returns The Config
     */
    getConfig()
    {
        return this.config;
    }

    /**
     * Simple gameData getter
     * @returns The GameData
     */
    getGameData()
    {
        return this.gameData;
    }

    /**
     * Simple config setter
     * @param newConfig the new config settings
     */
    setConfig(newConfig: Config)
    {
        this.config = {...newConfig};
    }

    /**
     * Simple gameData setter
     * @param newGameData the new game data
     */
    setGameData(newGameData: GameData)
    {
        this.gameData = {...newGameData};
    }

    /**
     * Singleton getInstance function creating our instance if not present
     * @returns the instance of the data class
     */
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