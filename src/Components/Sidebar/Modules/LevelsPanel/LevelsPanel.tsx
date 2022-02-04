import { useState } from 'react';
import './LevelsPanel.css'
import {FaMap, FaMapMarkerAlt} from 'react-icons/fa';
import {RiArrowDropDownLine, RiArrowDropUpLine} from 'react-icons/ri';

interface LevelsPanelProps {
	levels: string[];
	scenes: string[][];
}

const LevelsPanel = ({levels, scenes}: LevelsPanelProps) => {
	const [expand, setExpand] = useState(false);

	const handleOnClick = () => {
		setExpand(!expand);
	}

	return (
		<div className="panel">
			<div className="header">Levels</div>
			<div className="levels-list" style={{height: "50vh"}}>
				<ul>
					{levels.map((level, index) => (
						<li key={level} className='menu-item'>
							<div className='menu-title' onClick={handleOnClick}>
								<FaMap className='icon' /> {level}
								{scenes[index].length > 0
								?
								<>
									{expand  ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
								</>
								:
								null
								}
							</div>
							{scenes[index].length > 0 && expand
								?
								<ul className={`sub-menu active`}>
									{scenes[index].map((scene) => (
										<li key={scene} className=""><FaMapMarkerAlt className='icon'/> {scene}</li>
									))}
								</ul>
								:
								null
							}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default LevelsPanel;