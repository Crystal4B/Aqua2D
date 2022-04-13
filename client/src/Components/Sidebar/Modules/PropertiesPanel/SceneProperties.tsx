import { useDispatch, useSelector } from "react-redux";
import { moveScene, renameScene, resizeScene, resizeTiles } from "../../../../Redux/Levels/Scenes/sceneActions";
import { sceneState } from "../../../../Redux/Levels/Scenes/sceneReducer";
import { rootState } from "../../../../Redux/store";
import Card from "./Card";

interface SceneProperiesProps
{
	focusedId: string
}

const SceneProperies: React.FC<SceneProperiesProps> = ({focusedId}) =>
{
	const scene = useSelector<rootState, sceneState>(state => state.levels.scenes.byId[state.levels.levels.selectedId].data[focusedId]);

	const dispatch = useDispatch();

	const handleNameChange = (event: React.ChangeEvent) =>
	{
		// Dispatch new name
		const value = (event.target as HTMLInputElement).value;
		dispatch(renameScene(scene.levelId, scene.id, value));
	}

	const handlePositionChange = (event: React.ChangeEvent) =>
	{
		// Dispatch new position
		let name = (event.target as HTMLInputElement).name;
		let value = (event.target as HTMLInputElement).value;

		switch(name)
		{
		case "x":
			dispatch(moveScene(scene.levelId, scene.id, +value, scene.position.yPos));
			break;
		case "y":
			dispatch(moveScene(scene.levelId, scene.id, scene.position.xPos, +value));
			break;
		case "width":
			dispatch(resizeScene(scene.levelId, scene.id, +value*scene.tileset.tileWidth, scene.size.height));
			break;
		case "height":
			dispatch(resizeScene(scene.levelId, scene.id, scene.size.width, +value*scene.tileset.tileHeight));
			break;
		case "tile-width":
			dispatch(resizeTiles(scene.levelId, scene.id, +value, scene.tileset.tileHeight));
			break;
		case "tile-height":
			dispatch(resizeTiles(scene.levelId, scene.id, scene.tileset.tileWidth, +value));
			break;
		}
	}

	return (
		<>
			<Card title="Common">
				<label htmlFor="name">Name:</label>
				<input name="name" type="text" value={scene.sceneName} onChange={handleNameChange}/>
			</Card>
			<hr className="rounded"/>
			<Card title="Positioning">
				<label htmlFor="x">X:</label>
				<input name="x" type={"number"} value={scene.position.xPos} onChange={handlePositionChange}/>
				<br/>
				<label htmlFor="y">Y:</label>
				<input name="y" type={"number"} value={scene.position.yPos} onChange={handlePositionChange}/>
				<br/>
				<label htmlFor="width">Width:</label>
				<input name="width" type={"number"} value={scene.size.width/scene.tileset.tileWidth} onChange={handlePositionChange}/>
				<br/>
				<label htmlFor="height">Height:</label>
				<input name="height" type={"number"} value={scene.size.height/scene.tileset.tileHeight} onChange={handlePositionChange}/>
			</Card>
			<hr className="rounded"/>
			<Card title="Properties">
				<label htmlFor="tile-width">Tile Width:</label>
				<input name="tile-width" type={"number"} value={scene.tileset.tileWidth} onChange={handlePositionChange}/>
				<br/>
				<label htmlFor="tile-height">Tile Height:</label>
				<input name="tile-height" type={"number"} value={scene.tileset.tileHeight} onChange={handlePositionChange}/>
			</Card>
		</>
	)
}

export default SceneProperies;