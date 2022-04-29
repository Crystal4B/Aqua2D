import { keyboardState } from "../../Redux/Levels/Tilemap/tilemapReducer";

/**
 * Interface defining the state of keys in the input
 */
interface KeyState
{
    [key: string]: boolean;
}

/**
 * Class handling the input in the game
 */
class Input
{
    static keys: KeyState = {}; 

    /**
     * Function for registering new keys into the input handler
     * @param keys the keys being registered
     */
    static registerKeys(keys: keyboardState)
    {
        console.log('setting keys');
        for (const key of Object.values(keys))
        {
            Input.keys[key.toUpperCase()] = false;
        }
        console.log(Input.keys);
    }

    /**
     * Function handling the updating of input key
     */
    static handleKeyDown(event: KeyboardEvent)
    {
        let key = event.key.toUpperCase();
        if (key in Input.keys)
        {
            Input.keys[key] = true;
        }
    }
    
    /**
     * Function handling the updating of input keys
     */
    static handleKeyUp(event: KeyboardEvent)
    {
        let key = event.key.toUpperCase();
        if (key in Input.keys)
        {
            Input.keys[key] = false;
        }
    }
}

export default Input;