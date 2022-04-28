import React from "react";
import Data, { GameData } from "./Data/Data";
import Character from "./Entities/Character";
import Collidable from "./Entities/Collidable";
import Enemy from "./Entities/Enemy";
import EntityTemplate from "./Entities/EntityTemplate";
import GameMap from "./GameMap";
import Input from "./Input";

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
        
        for (const object of gameData[config.currentLevelId][config.currentSceneId].objects)
        {
            switch(object.controller.type)
            {
            case "player":
                this.entities.push(new Character(object));
                break;
            case "npc":
                this.entities.push(new Enemy(object, this.checkSurroundings));
                break;
            }
        }

        Game.game = this;

        this.render();
    }

    getInstance()
    {
        if (Game.game)
        {
            return Game.game;
        }
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