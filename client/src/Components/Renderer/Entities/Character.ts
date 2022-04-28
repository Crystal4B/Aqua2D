import { keyboardState, npcState, objectState } from "../../../Redux/Levels/Tilemap/tilemapReducer";
import Input from "../Input";
import EntityTemplate from "./EntityTemplate";

class Character extends EntityTemplate
{
    control: keyboardState | npcState;

    static speed: number = 0.8;

    public constructor(object: objectState)
    {
        super(object);

        this.control = object.controller.control;
        if ('up' in this.control)
        {
            Input.registerKeys(this.control);
        }
    }

    public update()
    {
        if ('up' in this.control)
        {
            if (Input.keys[this.control.up])
            {
                this.y -= Character.speed;
            }
            if (Input.keys[this.control.down])
            {
                this.y += Character.speed;
            }
            if (Input.keys[this.control.left])
            {
                this.x -= Character.speed;
            }
            if (Input.keys[this.control.right])
            {
                this.x += Character.speed;
            }
            if (Input.keys[this.control.attack])
            {
                this.attack();
            }
        }
    }

    private attack()
    {

    }
}

export default Character;