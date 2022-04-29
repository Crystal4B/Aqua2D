import { objectState } from "../../../Redux/Levels/Tilemap/tilemapReducer";
import Collidable from "./Collidable";

/**
 * Abstract EntityTemplate setting the way Entities work in the game
 */
abstract class EntityTemplate extends Collidable
{
    image: HTMLImageElement;

    index: number;

    /**
     * Simple EntityTemplate constructor
     * @param object which is used in the entity construction
     * @param index of the entity in the data
     */
    public constructor(object: objectState, index: number)
    {
        super(object.x, object.y, object.width, object.height);

        this.index = index;
        this.image = new Image();
        this.image.src = object.image;
    }

    /**
     * Abstract update function for handling the way the entity functions during runtime
     */
    public abstract update(): void;

    /**
     * Simple render function drawing the entity on the screen
     * @param context being rendered on
     */
    public render(context: CanvasRenderingContext2D)
    {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export default EntityTemplate;