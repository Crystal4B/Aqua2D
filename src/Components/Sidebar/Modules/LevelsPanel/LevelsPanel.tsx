import { useState } from 'react';
import './LevelsPanel.css'
import {FaMap, FaMapMarkerAlt} from 'react-icons/fa';
import {RiArrowDropDownLine, RiArrowDropUpLine} from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../../../../Redux/store';
import { levelState, sceneState } from '../../../../Redux/Levels/levelReducer';
import { setOptions } from '../../../../Redux/Menu/menuActions';
import { optionState } from '../../../../Redux/Menu/menuReducer';
import { addLevel, selectScene } from '../../../../Redux/Levels/levelsActions';

const LevelsPanel = () =>
{
	const [expand, setExpand] = useState(true);

	const levels = useSelector<rootState, {[id: string]: levelState}>(state => state.levels.levels);
	const scenes = useSelector<rootState, {[id: string]: sceneState}>(state => state.levels.scenes);

	const handleOnClick = () =>
	{
		setExpand(!expand);
	}

	const dispatch = useDispatch();

	const onAddLevel = () =>
	{
		dispatch(addLevel("DEFAULT"));
	}

	const onSelectScene = (scene: string) =>
	{
		dispatch(selectScene(scene));
	}

	const contextMenu: Array<optionState> = [{optionName: "Add Level", optionFunction: onAddLevel}];

	const handleContextMenu = () =>
	{
		dispatch(setOptions(contextMenu));
	}

	return (
		<div className="panel">
			<div className="header">Levels</div>
			<div className="levels-list" onContextMenu={handleContextMenu} style={{height: "50vh"}}>
				<ul>
					{Object.keys(levels).map((currentLevelId) => (
						<li key={currentLevelId} className='menu-item'>
							<div className='menu-title' onClick={handleOnClick}>
								<FaMap className='icon' /> {levels[currentLevelId].levelName}
								{Object.keys(Object.fromEntries(Object.entries(scenes).filter(([_, {levelId}]) => levelId === currentLevelId))).length > 0
								?
								<>
									{expand  ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
								</>
								:
								null
								}
							</div>
							{Object.keys(Object.fromEntries(Object.entries(scenes).filter(([_, {levelId}]) => levelId === currentLevelId))).length > 0 && expand
								?
								<ul className={`sub-menu active`}>
									{Object.keys(Object.fromEntries(Object.entries(scenes).filter(([_, {levelId}]) => levelId === currentLevelId))).map((currentSceneId) => (
										<li key={currentSceneId} className={`${scenes[currentSceneId].selected ? "active" : ""}`} onClick={() => {onSelectScene(currentSceneId)}}><FaMapMarkerAlt className='icon'/> {scenes[currentSceneId].sceneName}</li>
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