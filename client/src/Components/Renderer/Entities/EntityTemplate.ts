import { objectState } from "../../../Redux/Levels/Tilemap/tilemapReducer";
import Collidable from "./Collidable";

abstract class EntityTemplate extends Collidable
{
    image: HTMLImageElement;

    public constructor(object: objectState)
    {
        super(object.x, object.y, object.width, object.height);

        this.image = new Image();
        this.image.src = object.image;
    }

    public abstract update(): void;

    public render(context: CanvasRenderingContext2D)
    {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export default EntityTemplate;