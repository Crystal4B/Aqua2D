/**
 * Collidable object class containing the AABB algorithm
 */
class Collidable
{
    x: number;
    y: number;
    width: number;
    height: number;

    /**
     * Simple Collidable constructor
     * @param x position of the object
     * @param y position of the object
     * @param width of the object
     * @param height of the object
     */
    constructor(x: number, y: number, width: number, height: number)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Function handling the narrow collision checks between two collidables
     * @param obj being tested for collisions
     * @returns boolean value defining whether the objects are colliding or not
     */
    public AABB(obj: Collidable)
    {
        return (this.x < obj.x + obj.width &&
                this.x + this.width > obj.x &&
                this.y < obj.y + obj.height &&
                this.y + this.height > obj.y);
    }
}

export default Collidable