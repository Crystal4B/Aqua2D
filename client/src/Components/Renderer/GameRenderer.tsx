import { useEffect, useRef } from "react";
import {createPortal} from "react-dom"
import { useSelector } from "react-redux";
import { CombinedState } from "redux";
import { layersState } from "../../Redux/Levels/Layers/layerReducer";
import { levelsState } from "../../Redux/Levels/Levels/levelReducer";
import { PropertiesState } from "../../Redux/Levels/Properties/PropertiesReducer";
import { scenesState } from "../../Redux/Levels/Scenes/sceneReducer";
import { tilemapsState } from "../../Redux/Levels/Tilemap/tilemapReducer";
import { rootState } from "../../Redux/store";
import compile from "./Compiler";
import Data from "./Data/Data";
import Game from "./Game";

type Props = {
	container: HTMLDivElement
}

/**
 * Renderer displaying the main game on the screen
 * @returns JSX implementation the game view
 */
const GameRenderer: React.FC<Props> = ({container}) =>
{
	const levels = useSelector<rootState, CombinedState<{
		levels: levelsState;
		scenes: scenesState;
		layers: layersState;
		tilemaps: tilemapsState;
		properties: PropertiesState;
	}>>(state => state.levels);

	const scene = levels.scenes.byId[levels.properties.startLevelId].data[levels.properties.startSceneId];

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D>();

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas)
		{
			return;
		}
		
		const context = canvas.getContext("2d");
		if (context)
		{
			contextRef.current = context;

			context.fillStyle = '#000'
			context.fillRect(0, 0, canvas.width, canvas.height);
		}

		let data = Data.getInstance();
		data.setConfig({
			currentLevelId: levels.properties.startLevelId,
			currentSceneId: levels.properties.startSceneId
		})
		data.setGameData(compile(levels));

		new Game(canvasRef);
	}, [levels])

	return createPortal(
		<canvas ref={canvasRef} 
				width={scene.size.width}
				height={scene.size.height} 
				style={{height: '100%', width: '100%'}}
				tabIndex={0}
		/>, container);
}

export default GameRenderer;