import './Toolbar.css';

import {BsPencilFill, BsEraserFill} from 'react-icons/bs';
import {BiRotateRight, BiRotateLeft} from 'react-icons/bi';
import {GiArrowCursor, GiFoundryBucket} from 'react-icons/gi';
import {CgEditFlipH, CgEditFlipV} from 'react-icons/cg';
import {AiOutlineFolderOpen, AiOutlinePlus} from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

import { rootState } from '../../../Redux/store';
import { toolState } from '../../../Redux/Tools/toolReducer';
import { rotationTile, switchTool } from '../../../Redux/Tools/toolActions';
import { extractFilesAsURL } from '../../../Helpers/InputHelper';
import { switchTileset } from '../../../Redux/Levels/Scenes/sceneActions';

/**
 * Interface representing the props required by the toolbar
 */
interface toolbarProps
{
	type: string
}

/**
 * Toolbar component displaying multiple button options and handling changes in tools
 * @returns JSX implementation of the toolbar
 */
const Toolbar = (props: toolbarProps) =>
{
	const tileset = useSelector<rootState, {levelId: string, sceneId: string, tileset: {image?: string, tileWidth: number, tileHeight: number}}>(state => {
		const levelId = state.levels.levels.selectedId;
		const sceneId = state.levels.scenes.byId[levelId].selectedId;
		const tileset = state.levels.scenes.byId[levelId].data[sceneId].tileset;

		return {
			levelId: levelId,
			sceneId: sceneId,
			tileset: tileset
		}
	})

	const tool = useSelector<rootState, toolState["tool"]>(state => state.toolbar.tool);
	const dispatch = useDispatch();

	/**
	 * Function handling the update of selection of a tool
	 * @param tool being selected
	 */
	const updateToolSelection = (tool: string) =>
	{
		dispatch(switchTool(tool));
	}

	/**
	 * Function handling the update of tile rotation
	 * @param rotation being changed
	 */
	const updateTileRotation = (rotation: number) =>
	{
		dispatch(rotationTile(rotation));
	}

	/**
	 * Function handling the update of tileset in the tileset panel
	 */
	const handleInput = ({target}: React.FormEvent<HTMLInputElement>) =>
	{
		const input = target as HTMLInputElement;
		const url = extractFilesAsURL(input);
		if (url)
		{
			dispatch(switchTileset(tileset.levelId, tileset.sceneId, url));
		}
	}

	return (
		<div className="toolbar">
			{props.type === 'tileset' ? (
				<>
					<GiArrowCursor onClick={() => updateToolSelection("Move")} className={`button ${tool === "Move" ? "active" : ""}`}/>
					<BsPencilFill onClick={() => updateToolSelection("Draw")} className={`button ${tool === "Draw" ? "active" : ""}`}/>
					<BsEraserFill onClick={() => updateToolSelection("Erase")} className={`button ${tool === "Erase" ? "active" : ""}`}/>
					<GiFoundryBucket onClick={() => updateToolSelection("Fill")} className={`button ${tool === "Fill" ? "active" : ""}`}/>
					<CgEditFlipH className={`button ${tool !== "Draw" ? "inactive" : ""}`}/>
					<CgEditFlipV className={`button ${tool !== "Draw" ? "inactive" : ""}`}/>
					<BiRotateRight onClick={() => updateTileRotation(90)} className={`button ${tool !== "Draw" ? "inactive" : ""}`}/>
					<BiRotateLeft onClick={() => updateTileRotation(-90)} className={`button ${tool !== "Draw" ? "inactive" : ""}`}/>
					<input type={"file"} id="file" onChange={handleInput}/>
					<label htmlFor='file'>
						<AiOutlineFolderOpen className='button'/>
					</label>
				</>
			) : props.type === 'objects' ? (
				<>
					<AiOutlinePlus className='button' style={{float: 'right'}}/>
				</>
			) : null
			}
		</div>
	)
}

export default Toolbar;