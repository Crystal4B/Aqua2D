import {GiTreasureMap} from 'react-icons/gi';
import {RiArrowDropDownLine, RiArrowDropUpLine} from 'react-icons/ri';

const LevelsModule = () => {
    return (
        <div className="panel">
            <div className="header">Levels</div>
            <div className="levels-list" style={{height: "300px"}}>
                <ul>
                    <li><GiTreasureMap className='icon'/>Level 1<RiArrowDropDownLine /></li>
                    <li><GiTreasureMap className='icon'/>Level 2<RiArrowDropDownLine /></li>
                </ul>
            </div>
        </div>
    )
}

export default LevelsModule;