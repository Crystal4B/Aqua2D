import './Toolbar.css';

import {BsPencilFill, BsEraserFill} from 'react-icons/bs';
import {BiRotateRight, BiRotateLeft} from 'react-icons/bi';
import {GiArrowCursor, GiFoundryBucket} from 'react-icons/gi';
import {CgEditFlipH, CgEditFlipV} from 'react-icons/cg';
import {AiOutlineFolderOpen, AiOutlinePlus} from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

import { rootState } from '../../../Redux/store';
import { toolState } from '../../../Redux/Tools/toolReducer';
import { rotationTile, switchTileset, switchTool } from '../../../Redux/Tools/toolActions';
import { extractFilesAsURL } from '../../../Helpers/InputHelper';

interface toolbarProps
{
	type: string
}

const Toolbar = (props: toolbarProps) =>
{
	const tool = useSelector<rootState, toolState["tool"]>(state => state.toolbar.tool);
	const dispatch = useDispatch();

	const updateToolSelection = (tool: string) =>
	{
		dispatch(switchTool(tool));
	}

	const updateTileRotation = (rotation: number) =>
	{
		dispatch(rotationTile(rotation));
	}

	const handleInput = ({target}: React.FormEvent<HTMLInputElement>) =>
	{
		const input = target as HTMLInputElement;
		const url = extractFilesAsURL(input);
		if (url)
		{
			dispatch(switchTileset(url));
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