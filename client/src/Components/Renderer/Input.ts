import { keyboardState } from "../../Redux/Levels/Tilemap/tilemapReducer";

interface KeyState
{
    [key: string]: boolean;
}

class Input
{
    static keys: KeyState = {}; 

    static registerKeys(keys: keyboardState)
    {
        for (const key of Object.values(keys))
        {
            Input.keys[key.toUpperCase()] = false;
        }
    }

    static handleKeyDown(event: KeyboardEvent)
    {
        let key = event.key.toUpperCase();
        if (key in Input.keys)
        {
            Input.keys[key] = true;
        }
    }
    
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