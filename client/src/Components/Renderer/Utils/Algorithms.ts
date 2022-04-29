import { tileState } from "../../../Redux/Tools/toolReducer";
import Data from "../Data/Data";
import Collidable from "../Entities/Collidable";
import EntityTemplate from "../Entities/EntityTemplate";
import Game from "../Game";

/**
 * Interface representing coordinates on the 2d plane
 */
export interface Coordinates
{
    x: number,
    y: number
}

/**
 * Interface representing a node inside the A* algorithm
 */
export interface node
{
    x: number,
    y: number,
    g: number,
    h: number,
    f: number,
    parent?: node
}

/**
 * Function for calculating the manhattanDistance heuristic
 * @param from node being tested
 * @param to the target node
 * @returns the manhattan distance between the two nodes
 */
function manhattanDistance(from: node, to: node)
{
    return Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
}

/**
 * Function for splitting a node into valid children
 * @param parent the node being split
 * @param collisionMap the map being used to check for valid tiles
 * @returns The valid children of the parent node
 */
function splitNode(parent: node, collisionMap: tileState[][])
{
    const common = {
        g: parent.g + 1,
        h: 0,
        f: 0,
        parent: parent
    }

    var children = [{
        x: parent.x + 1,
        y: parent.y,
        ...common
    },
    {
        x: parent.x - 1,
        y: parent.y,
        ...common
    },
    {
        x: parent.x,
        y: parent.y + 1,
        ...common
    },
    {
        x: parent.x,
        y: parent.y - 1,
        ...common
    }]

    var results: node[] = [];
    for (const child of children)
    {
        if (child.x !== -1 && child.y !== -1 &&child.x < collisionMap.length && child.y < collisionMap[child.x].length && (collisionMap[child.x][child.y].xCoord === -1 || collisionMap[child.x][child.y].yCoord === -1))
        {
            results.push(child);
        }
    }
    return results;
}

/**
 * The A* algorithm for enemy pathfinding
 * @param startX the starting x position of the enemy
 * @param startY the starting y position of the enemy
 * @param endX the ending x position of the target in Tile coordiantes
 * @param endY the ending y position of the target in Tile coordinates
 * @returns The best path found by the algorithm or an empty array if no path was found
 */
export function aStar(startX: number, startY: number, endX: number, endY: number)
{
    // Grab current map
    let data = Data.getInstance();
    let gameData = data.getGameData();
    let config = data.getConfig();
    if (!gameData || !config)
        return [];

    // Get collision layer of map
    let collisionMap = gameData[config.currentLevelId][config.currentSceneId].layers.collisions.tilemap;
    let {tileWidth} = gameData[config.currentLevelId][config.currentSceneId].tileset;

    // Convert coordinates to Nodes
    const end: node = {
        x: endX,
        y: endY,
        g: 0,
        h: 0,
        f: 0
    }

    const start: node = {
        x: Math.floor(startX / tileWidth),
        y: Math.floor(startY / tileWidth),
        g: 0,
        h: 0,
        f: 0
    }

    start.h = manhattanDistance(start, end);
    start.f = start.g + start.h;

    // Create our lists
    const open = [start];
    const closed: node[] = [];

    // Start search
    while (open.length > 0)
    {
        const current = open[0];
        open.splice(0, 1);
        if (current.x === end.x && current.y === end.y)
        {
            let result: node[] = [current];
            while(result[0].parent)
            {
                result.unshift(result[0].parent);
            }
            result.splice(0, 1); // First tile in path is always starting tile
            return result;
        }

        const children = splitNode(current, collisionMap);
        for (const child of children)
        {
            let openIndex = open.findIndex((value) => value.x === child.x && value.y === child.y);
            let closedIndex = closed.findIndex((value) => value.x === child.x && value.y === child.y);

            if ((openIndex !== -1 && open[openIndex].g <= child.g) || (closedIndex !== -1 && closed[closedIndex].g <= child.g))
            {
                continue;
            }
            else if (openIndex !== -1)
            {
                open[openIndex].g = child.g;
                open[openIndex].f = open[openIndex].g + open[openIndex].h;
                open[openIndex].parent = child.parent;
            }
            else if (closedIndex !== -1)
            {
                let node = closed[closedIndex];
                node.g = child.g;
                node.f = node.g + node.h;

                closed.splice(closedIndex, 1);
                open.push(node)
            }
            else
            {
                child.h = manhattanDistance(child, end);
                child.f = child.g + child.h;
                open.push(child);
            }
        }
        // Sort by the final cost of each node
        open.sort((n1: node, n2: node) => {
            if (n1.f < n2.f)
            {
                return -1;
            }
            if (n1.f > n2.f)
            {
                return 1;
            }
            return 0;
        });

        closed.push(current);
    }

    return [];
}

/**
 * Function for selecting a random valid location in an area
 * @param range the distance in tiles that the location can be selected from
 * @param originX x position marking the centre of the area being chosen from
 * @param originY y position marking the centre of the area being chosen from
 * @returns a random coordinate or undefined in case of error
 */
export function selectRandomLocation(range: number, originX: number, originY: number): Coordinates | undefined
{
    // Grab current map
    let data = Data.getInstance();
    let gameData = data.getGameData();
    let config = data.getConfig();
    if (!gameData || !config)
        return undefined;

    // Get collision layer of map
    let collisionMap = gameData[config.currentLevelId][config.currentSceneId].layers.collisions.tilemap;
    let {tileWidth, tileHeight} = gameData[config.currentLevelId][config.currentSceneId].tileset;

    // Localize coordinates
    let x = Math.floor(originX / tileWidth);
    let y = Math.floor(originY / tileHeight);

    // Calculate random range
    let xMin = x - range < 0 ? 0 : x - range; // we can assume 0 is abs minimum
    let xMax = x + range >= collisionMap.length ? collisionMap.length-1 : x + range;
    let yMin = y - range < 0 ? 0 : y - range; // we can assume 0 is abs minimum
    let yMax = y + range >= collisionMap[xMax].length ? collisionMap[xMax].length-1 : y + range;

    // Find candidates
    let candidates = [];
    for (let i = xMin; i < xMax; i++)
    {
        for (let j = yMin; j < yMax; j++)
        {
            if (collisionMap[i][j].xCoord === -1 && collisionMap[i][j].yCoord === -1)
            {
                candidates.push({x: i, y: j});
            }
        }
    }

    // Select random value
    let randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
}

/**
 * Function for converting canvas coordaintes to tile coordinates
 * @param x in canvas coordinates
 * @param y in canvas coordinates
 * @returns Tile coordinates or undefined in case of error
 */
export function canvasCoordsToTileCoords(x: number, y: number): Coordinates | undefined
{
    // Grab current map
    let data = Data.getInstance();
    let gameData = data.getGameData();
    let config = data.getConfig();
    if (!gameData || !config)
        return undefined;

    // Grab tilesize
    let {tileWidth, tileHeight} = gameData[config.currentLevelId][config.currentSceneId].tileset;

    return {x: Math.floor(x / tileWidth), y: Math.floor(y / tileHeight)}
}

/**
 * Function for making sure that coordinates are reachable in a map
 * @param map the map being checked against
 * @param coords the coordinates being checked
 * @returns valid coordinates for the provided map
 */
export function checkRange(map: tileState[][], coords: Coordinates)
{
    // Make sure they are within reach
    if (coords.x >= map.length)
    {
        coords.x = map.length-1;
    }
    else if (coords.x < 0)
    {
        coords.x = 0;
    }
    if (coords.y >= map[coords.x].length)
    {
        coords.y = map[coords.x].length-1;
    }
    else if (coords.y < 0)
    {
        coords.y = 0;
    }

    return coords;
}

/**
 * Function for checking collisions in a wide and narrow phase
 * @param entity being checked for collisions
 * @returns boolean value in case of collision with wall or entity when colliding with another collidable
 */
export function checkCollision(entity: Collidable)
{
    // Grab current map
    let data = Data.getInstance();
    let gameData = data.getGameData();
    let config = data.getConfig();
    if (!gameData || !config)
        return undefined;

    let collisionMap = gameData[config.currentLevelId][config.currentSceneId].layers.collisions;

    // Wide Phase
    let topLeft = canvasCoordsToTileCoords(entity.x, entity.y);
    let bottomRight = canvasCoordsToTileCoords(entity.x + entity.width, entity.y + entity.height);

    if (!topLeft || !bottomRight)
        return false;
    
    // Make sure they are within reach
    topLeft = checkRange(collisionMap.tilemap, topLeft);
    bottomRight = checkRange(collisionMap.tilemap, bottomRight);

    // Check walls
    for (let i = topLeft.x; i <= bottomRight.x; i++)
    {
        for (let j = topLeft.y; j <= bottomRight.y; j++)
        {
            if (collisionMap.tilemap[i][j].xCoord !== -1 || collisionMap.tilemap[i][j].yCoord !== -1)
            {
                return true;
            }
        }
    }

    let game = Game.getInstance();
    if (!game)
        return false;

    for (const otherEntity of game.entities)
    {
        if ((entity as EntityTemplate).index === (otherEntity as EntityTemplate).index)
        {
            continue;
        }

        if (entity.AABB(otherEntity))
        {
            return otherEntity;
        }
    }
}
