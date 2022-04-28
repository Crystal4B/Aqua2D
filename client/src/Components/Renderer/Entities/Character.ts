import { keyboardState, objectState } from "../../../Redux/Levels/Tilemap/tilemapReducer";
import Data from "../Data/Data";
import Game from "../Game";
import Input from "../Input";
import { checkCollision } from "../Utils/Algorithms";
import Enemy from "./Enemy";
import EntityTemplate from "./EntityTemplate";

class Character extends EntityTemplate
{
    control: keyboardState | undefined;

    static speed: number = 0.8;

    public constructor(object: objectState, index: number)
    {
        super(object, index);

        if ('up' in object.controller.control)
        {
            this.control = object.controller.control;
            Input.registerKeys(this.control);
        }
    }

    public update()
    {
        if (this.control)
        {
            if (Input.keys[this.control.up])
            {
                this.y -= Character.speed;
                let collider = checkCollision(this);
                if (collider instanceof Enemy)
                {
                    let game = Game.getInstance();
                    if (game)
                        game.removeEntity(this.index);
                }
                else if (collider === true)
                {
                    this.y += Character.speed;
                }
            }
            if (Input.keys[this.control.down])
            {
                this.y += Character.speed;
                let collider = checkCollision(this);
                if (collider instanceof Enemy)
                {
                    let game = Game.getInstance();
                    if (game)
                        game.removeEntity(this.index);
                }
                else if (collider === true)
                {
                    this.y -= Character.speed;
                }
            }
            if (Input.keys[this.control.left])
            {
                this.x -= Character.speed;
                let collider = checkCollision(this);
                if (collider instanceof Enemy)
                {
                    let game = Game.getInstance();
                    if (game)
                        game.removeEntity(this.index);
                }
                else if (collider === true)
                {
                    this.x += Character.speed;
                }
            }
            if (Input.keys[this.control.right])
            {
                this.x += Character.speed;
                let collider = checkCollision(this);
                if (collider instanceof Enemy)
                {
                    let game = Game.getInstance();
                    if (game)
                        game.removeEntity(this.index);
                }
                else if (collider === true)
                {
                    this.x -= Character.speed;
                }
            }
            if (Input.keys[this.control.attack])
            {
                this.attack();
            }
        }

        this.checkPosition();
    }

    private checkPosition()
    {
        // Grab current map
        let data = Data.getInstance();
        let gameData = data.getGameData();
        let config = data.getConfig();
        if (!gameData || !config)
            return undefined;

        // Grab map size
        let {width, height} = gameData[config.currentLevelId][config.currentSceneId].size;
        if (this.x < 0 - this.width) // only if the entire character is gone
        {
            this.x = width - this.width;
            let game = Game.getInstance();
            if (game)
                game.sceneEvent({
                    type: "SCENE_CHANGE",
                    payload: {
                        direction: "left",
                        target: this
                    }
                });
        }
        else if (this.x > width)
        {
            this.x = 0;
            let game = Game.getInstance();
            if (game)
                game.sceneEvent({
                    type: "SCENE_CHANGE",
                    payload: {
                        direction: "right",
                        target: this
                    }
                });
        }
        if (this.y < 0 - this.height) // only if the entire character is gone
        {
            this.y = height - this.height;
            let game = Game.getInstance();
            if (game)
                game.sceneEvent({
                    type: "SCENE_CHANGE",
                    payload: {
                        direction: "up",
                        target: this
                    }
                });
        }
        else if (this.y > height)
        {
            this.y = 0;
            let game = Game.getInstance();
            if (game)
                game.sceneEvent({
                    type: "SCENE_CHANGE",
                    payload: {
                        direction: "down",
                        target: this
                    }
                });
        }

    }

    private attack()
    {

    }
}

export default Character;