import React from "react";
import Data from "./Data/Data";
import Character from "./Entities/Character";
import Collidable from "./Entities/Collidable";
import Enemy from "./Entities/Enemy";
import EntityTemplate from "./Entities/EntityTemplate";
import GameMap from "./GameMap";
import Input from "./Input";

interface GameEvent
{
    type: "SCENE_CHANGE"
    payload: {
        direction: "up" | "down" | "left" | "right"
        target: EntityTemplate;
    }
}

class Game
{
    static game: Game | undefined;

    canvas: React.RefObject<HTMLCanvasElement>;

    map: GameMap | undefined;
    entities: EntityTemplate[];

    constructor(canvas: React.RefObject<HTMLCanvasElement>)
    {
        this.canvas = canvas;
        let concreteCanvas = this.canvas.current;
        if (concreteCanvas)
        {
            concreteCanvas.addEventListener('keydown', Input.handleKeyDown);
            concreteCanvas.addEventListener('keyup', Input.handleKeyUp);
        }
        this.entities = [];
        
        let data = Data.getInstance();
        let gameData = data.getGameData();
        let config = data.getConfig();

        if (!gameData || !config)
            return;

        this.map = new GameMap(gameData[config.currentLevelId][config.currentSceneId]);
        
        for (let i = 0; i < gameData[config.currentLevelId][config.currentSceneId].objects.length; i++)
        {
            const object = gameData[config.currentLevelId][config.currentSceneId].objects[i];

            switch(object.controller.type)
            {
            case "player":
                this.entities.push(new Character(object, i));
                break;
            case "npc":
                this.entities.push(new Enemy(object, i));
                break;
            }
        }

        Game.game = this;

        this.render();
    }

    static getInstance()
    {
        if (Game.game)
        {
            return Game.game;
        }
    }

    removeEntity(index: number)
    {
        // Grab current map
        let data = Data.getInstance();
        let gameData = data.getGameData();
        let config = data.getConfig();
        if (!gameData || !config)
            return undefined;

        gameData[config.currentLevelId][config.currentSceneId].objects.splice(index, 1);
        this.entities.splice(index, 1);
    }

    checkSurroundings(range: number, originX: number, originY: number)
    {
        let surroundingEntities: EntityTemplate[] = [];

        if (!this.map)
            return surroundingEntities;

        let rangeWidth = this.map.scene.tileset.tileWidth * range;
        let rangeHeight = this.map.scene.tileset.tileHeight * range;

        let surroundingBox = new Collidable(originX, originY, rangeWidth, rangeHeight);
        for (const entity of this.entities)
        {
            if (surroundingBox.AABB(entity))
            {
                surroundingEntities.push(entity);
            }
        }

        return surroundingEntities;
    }

    updateMap()
    {
        // Grab current map
        let data = Data.getInstance();
        let gameData = data.getGameData();
        let config = data.getConfig();
        if (!gameData || !config)
            return undefined;

        this.map = new GameMap(gameData[config.currentLevelId][config.currentSceneId]);

        this.entities = [];
        for (let i = 0; i < gameData[config.currentLevelId][config.currentSceneId].objects.length; i++)
        {
            const object = gameData[config.currentLevelId][config.currentSceneId].objects[i];

            switch(object.controller.type)
            {
            case "player":
                this.entities.push(new Character(object, i));
                break;
            case "npc":
                this.entities.push(new Enemy(object, i));
                break;
            }
        }
    }

    sceneEvent(event: GameEvent)
    {
        // Grab current map
        let data = Data.getInstance();
        let gameData = data.getGameData();
        let config = data.getConfig();
        if (!gameData || !config)
            return undefined;

        let connections = gameData[config.currentLevelId][config.currentSceneId].connections;

        switch(event.payload.direction)
        {
        case "up":
            if (connections.up)
            {
                data.setConfig({
                    ...config,
                    currentSceneId: connections.up,
                })
                let character = gameData[config.currentLevelId][config.currentSceneId].objects[(event.payload.target as Character).index];
                character.x = event.payload.target.x
                character.y = event.payload.target.y

                // Move character to new scene
                gameData[config.currentLevelId][config.currentSceneId].objects.splice((event.payload.target as Character).index, 1);
                gameData[config.currentLevelId][connections.up].objects.push(character);
                data.setGameData({...gameData});

                this.updateMap();
            }
            break;
        case "down":
            if (connections.down)
            {
                data.setConfig({
                    ...config,
                    currentSceneId: connections.down,
                })
                let character = gameData[config.currentLevelId][config.currentSceneId].objects[(event.payload.target as Character).index];
                character.x = event.payload.target.x
                character.y = event.payload.target.y

                // Move character to new scene
                gameData[config.currentLevelId][config.currentSceneId].objects.splice((event.payload.target as Character).index, 1);
                gameData[config.currentLevelId][connections.down].objects.push(character);
                data.setGameData({...gameData});

                this.updateMap();
            }
            break;
        case "left":
            if (connections.left)
            {
                data.setConfig({
                    ...config,
                    currentSceneId: connections.left,
                })
                let character = gameData[config.currentLevelId][config.currentSceneId].objects[(event.payload.target as Character).index];
                character.x = event.payload.target.x
                character.y = event.payload.target.y

                // Move character to new scene
                gameData[config.currentLevelId][config.currentSceneId].objects.splice((event.payload.target as Character).index, 1);
                gameData[config.currentLevelId][connections.left].objects.push(character);
                data.setGameData({...gameData});

                this.updateMap();
            }
            break;
        case "right":
            if (connections.right)
            {
                data.setConfig({
                    ...config,
                    currentSceneId: connections.right,
                })
                let character = gameData[config.currentLevelId][config.currentSceneId].objects[(event.payload.target as Character).index];
                character.x = event.payload.target.x
                character.y = event.payload.target.y

                // Move character to new scene
                gameData[config.currentLevelId][config.currentSceneId].objects.splice((event.payload.target as Character).index, 1);
                gameData[config.currentLevelId][connections.right].objects.push(character);
                data.setGameData({...gameData});

                this.updateMap();
            }
            break;
        }
    }

    render()
    {
        let canvas = this.canvas.current;
        if (!canvas)
            return;

        let context = canvas.getContext('2d');
        if (!context)
            return;

        let data = Data.getInstance();
        let gameData = data.getGameData();
        let config = data.getConfig();
        if (!gameData || !config || !this.map)
            return;

        // Clear the screen
        context.clearRect(0, 0, gameData[config.currentLevelId][config.currentSceneId].size.width, gameData[config.currentLevelId][config.currentSceneId].size.width);

        this.map.render(context, false);

        // Update entities and enemies
        for (const entity of this.entities)
        {
            entity.update();
            entity.render(context);
        }

        // repeat
        requestAnimationFrame(this.render.bind(this));
    }
}

export default Game;