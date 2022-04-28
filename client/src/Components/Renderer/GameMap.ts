import { tileState } from "../../Redux/Tools/toolReducer";
import { GameScene } from "./Data/Data";

class GameMap
{
    scene: GameScene;
    image: HTMLImageElement;
    preloadedCavnas: HTMLCanvasElement;

    constructor(scene: GameScene)
    {
        this.image = new Image();
        if (scene.tileset.image)
            this.image.src = scene.tileset.image;

        this.scene = scene;
            
        this.preloadedCavnas = document.createElement("canvas");
        this.preloadedCavnas.width = scene.size.width;
        this.preloadedCavnas.height = scene.size.height;
        let context = this.preloadedCavnas.getContext('2d');
        if (context)
            this.render(context, true);

    }

    /**
	 * draw completes a drawing of a single tile on the canvas
	 * @param tile Tile being drawn onto the screen
	 * @param x the x position in tileset coordinates
	 * @param y the y position in tileset coordinates
	 */
	draw(context: CanvasRenderingContext2D, tile: tileState, x: number, y: number)
	{
        if (tile.rotation % 360 !== 0 && tile.rotation !== 0)
        {
            const TO_RADIANS = Math.PI/180;
            const cx = x * this.scene.tileset.tileWidth + this.scene.tileset.tileWidth / 2;
            const cy = y * this.scene.tileset.tileHeight +  this.scene.tileset.tileHeight / 2;

            context.save();
            context.translate(cx, cy);
            context.rotate(tile.rotation * TO_RADIANS);
            context.translate(-cx, -cy);
        }
        context.drawImage(this.image, tile.xCoord * this.scene.tileset.tileWidth, tile.yCoord * this.scene.tileset.tileHeight, this.scene.tileset.tileWidth, this.scene.tileset.tileHeight, x * this.scene.tileset.tileHeight, y * this.scene.tileset.tileHeight, this.scene.tileset.tileWidth, this.scene.tileset.tileHeight);
        if (tile.rotation % 360 !== 0 || tile.rotation !== 0)
        {
            context.restore();
        }
	}

    render(context: CanvasRenderingContext2D, preload: boolean)
    {
        if (preload)
        {
            for (const layer of Object.values(this.scene.layers))
            {
                for (let i = 0; i < layer.tilemap.length; i++)
                {
                    for (let j = 0; j < layer.tilemap[i].length; j++)
                    {
                        if (layer.tilemap[i][j].xCoord === -1 || layer.tilemap[i][j].yCoord === -1)
                            continue;
    
                        this.draw(context, layer.tilemap[i][j], i, j);
                    }
                }
            }
        }
        else
        {
            context.drawImage(this.preloadedCavnas, 0, 0);
        }
    }
}

export default GameMap;