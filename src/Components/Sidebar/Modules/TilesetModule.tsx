import {BsPencilFill, BsEraserFill} from 'react-icons/bs';
import {BiRotateRight, BiRotateLeft} from 'react-icons/bi';
import {GiArrowCursor, GiFoundryBucket} from 'react-icons/gi';
import {CgEditFlipH, CgEditFlipV} from 'react-icons/cg';
import {AiOutlineFolderOpen} from 'react-icons/ai';

const TilesetModule = () => {
    return (
        <div className="panel">
            <div className="header">Tileset</div>
            <div>
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
                <div className="tileset" style={{height: "250px"}}>
                    <img src={"https://assets.codepen.io/21542/TileEditorSpritesheet.2x_2.png"} />
                </div>
            </div>
        </div> 
    )
}

export default TilesetModule;