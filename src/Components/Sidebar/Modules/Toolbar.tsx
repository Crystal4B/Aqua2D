import './Toolbar.css';

import {BsPencilFill, BsEraserFill} from 'react-icons/bs';
import {BiRotateRight, BiRotateLeft} from 'react-icons/bi';
import {GiArrowCursor, GiFoundryBucket} from 'react-icons/gi';
import {CgEditFlipH, CgEditFlipV} from 'react-icons/cg';
import {AiOutlineFolderOpen} from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

import { rootState } from '../../../Redux/store';
import { toolState } from '../../../Redux/Tools/toolReducer';
import { switchTool } from '../../../Redux/Tools/toolActions';

const Toolbar = () => {
	const tool = useSelector<rootState, toolState>(state => state.tool);
	const dispatch = useDispatch();

	const updateToolSelection = (tool: string) => {
		dispatch(switchTool(tool));
	}

	return (
		<div className="toolbar">
			<GiArrowCursor onClick={() => updateToolSelection("MOVE")} className={`button ${tool === 0 ? "active" : ""}`}/>
			<BsPencilFill onClick={() => updateToolSelection("DRAW")} className={`button ${tool === 1 ? "active" : ""}`}/>
			<BsEraserFill onClick={() => updateToolSelection("ERASE")} className={`button ${tool === 2 ? "active" : ""}`}/>
			<GiFoundryBucket onClick={() => updateToolSelection("FILL")} className={`button ${tool === 3 ? "active" : ""}`}/>
			<CgEditFlipH className='button inactive'/>
			<CgEditFlipV className='button inactive'/>
			<BiRotateRight className='button inactive'/>
			<BiRotateLeft className='button inactive'/>
			<AiOutlineFolderOpen className='button'/>
		</div>
	)
}

export default Toolbar;