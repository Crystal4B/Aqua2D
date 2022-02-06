import { useState } from 'react';
import './LevelsPanel.css'
import {FaMap, FaMapMarkerAlt} from 'react-icons/fa';
import {RiArrowDropDownLine, RiArrowDropUpLine} from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../../../../Redux/store';
import { levelsState } from '../../../../Redux/Levels/levelReducer';
import { setOptions } from '../../../../Redux/Menu/menuActions';
import { optionState } from '../../../../Redux/Menu/menuReducer';
import { addLevel, selectScene } from '../../../../Redux/Levels/levelsActions';

const LevelsPanel = () =>
{
	const [expand, setExpand] = useState(true);

	const levels = useSelector<rootState, levelsState["levels"]>(state => state.levels.levels)

	const handleOnClick = () =>
	{
		setExpand(!expand);
	}

	const dispatch = useDispatch();

	const onAddLevel = () =>
	{
		dispatch(addLevel("DEFAULT"));
	}

	const onAddScene = () =>
	{

	}

	const onSelectScene = (level: string, scene: string) =>
	{
		dispatch(selectScene(level, scene));
	}

	const contextMenu: Array<optionState> = [{optionName: "Add Level", optionFunction: onAddLevel}, {optionName: "Add Scene", optionFunction: onAddScene}];

	const handleContextMenu = () =>
	{
		dispatch(setOptions(contextMenu));
	}

	return (
		<div className="panel">
			<div className="header">Levels</div>
			<div className="levels-list" onContextMenu={handleContextMenu} style={{height: "50vh"}}>
				<ul>
					{levels.map((level) => (
						<li key={level.levelName} className='menu-item'>
							<div className='menu-title' onClick={handleOnClick}>
								<FaMap className='icon' /> {level.levelName}
								{level.scenes.length > 0
								?
								<>
									{expand  ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
								</>
								:
								null
								}
							</div>
							{level.scenes.length > 0 && expand
								?
								<ul className={`sub-menu active`}>
									{level.scenes.map((scene) => (
										<li key={scene.sceneName} className={`${scene.sceneSelected ? "active" : ""}`} onClick={() => {onSelectScene(level.levelName, scene.sceneName)}}><FaMapMarkerAlt className='icon'/> {scene.sceneName}</li>
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