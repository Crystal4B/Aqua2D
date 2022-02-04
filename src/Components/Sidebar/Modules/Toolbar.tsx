import './Toolbar.css';
import {BsPencilFill, BsEraserFill} from 'react-icons/bs';
import {BiRotateRight, BiRotateLeft} from 'react-icons/bi';
import {GiArrowCursor, GiFoundryBucket} from 'react-icons/gi';
import {CgEditFlipH, CgEditFlipV} from 'react-icons/cg';
import {AiOutlineFolderOpen} from 'react-icons/ai';

const Toolbar = () => {
	return (
		<div className="toolbar">
			<GiArrowCursor className='button active'/>
			<BsPencilFill className='button'/>
			<BsEraserFill className='button'/>
			<GiFoundryBucket className='button'/>
			<CgEditFlipH className='button inactive'/>
			<CgEditFlipV className='button inactive'/>
			<BiRotateRight className='button inactive'/>
			<BiRotateLeft className='button inactive'/>
			<AiOutlineFolderOpen className='button'/>
		</div>
	)
}

export default Toolbar;