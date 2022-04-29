import { useEffect, useState } from 'react';
import './LevelsPanel.css'
import {FaMap, FaMapMarkerAlt} from 'react-icons/fa';
import {RiArrowDropDownLine, RiArrowDropUpLine} from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../../../../Redux/store';
import { setOptions } from '../../../../Redux/Menu/menuActions';
import { optionState } from '../../../../Redux/Menu/menuReducer';
import { addLevel } from '../../../../Redux/Levels/Levels/levelsActions';
import { scenesState } from '../../../../Redux/Levels/Scenes/sceneReducer';
import { selectScene } from '../../../../Redux/Levels/Scenes/sceneActions';
import { levelsState } from '../../../../Redux/Levels/Levels/levelReducer';

/**
 * LevelsPanel handling the managment of scenes and levels on a higher level
 * @returns JSX implemenation of the panel
 */
const LevelsPanel = () =>
{
	const scenes = useSelector<rootState, scenesState["byId"]>(state => state.levels.scenes.byId)
	const {selectedId, byId} = useSelector<rootState, levelsState>(state => state.levels.levels);
	
	const [expand, setExpand] = useState<boolean[]>([]);

	useEffect(() => {
		setExpand(Array(Object.keys(byId).length).fill(true))
	}, [byId])

	/**
	 * Function handling the expansion of levels on the list
	 * @param index of level being expanded
	 */
	const updateExpand = (index: number) =>
	{
		setExpand(expand.map((_, valueIndex) => {
			if (valueIndex === index)
			{
				return !expand[index];
			}
			return expand[valueIndex];
		}));
	}

	const dispatch = useDispatch();

	/**
	 * Function handling the addition of levels into the game
	 */
	const onAddLevel = () =>
	{
		const counter = Object.keys(byId).length;
		dispatch(addLevel(`Level ${counter + 1}`));
	}

	/**
	 * Function handling the selection of a scene
	 * @param levelId of the parent level
	 * @param sceneId of the scene being selected
	 */
	const onSelectScene = (levelId: string, sceneId: string) =>
	{
		dispatch(selectScene(levelId, sceneId));
	}

	const contextMenu: Array<optionState> = [{optionName: "Add Level", optionFunction: onAddLevel}];

	/**
	 * Function updating the context menu options
	 */
	const handleContextMenu = () =>
	{
		dispatch(setOptions(contextMenu));
	}

	return (
		<div className="panel">
			<div className="header">Levels</div>
			<div className="levels-list" onContextMenu={handleContextMenu} style={{height: "50vh"}}>
				<ul>
					{Object.keys(byId).map((currentLevelId, index) => (
						<li key={currentLevelId} className='menu-item'>
							<div className='menu-title' onClick={() => updateExpand(index)}>
								<FaMap className='icon' /> {byId[currentLevelId].levelName}
								{Object.keys(scenes[currentLevelId].data).length > 0 ?
									expand[index]  ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />
								:
									null
								}
							</div>
							{Object.keys(scenes[currentLevelId].data).length > 0 && expand[index] ?
								<ul className={`sub-menu active`}>
									{Object.keys(scenes[currentLevelId].data).map((currentSceneId) => (
										<li key={currentSceneId} className={`${scenes[currentLevelId].selectedId === currentSceneId && currentLevelId === selectedId ? "active" : ""}`} onClick={() => {onSelectScene(currentLevelId, currentSceneId)}}><FaMapMarkerAlt className='icon'/> {scenes[currentLevelId].data[currentSceneId].sceneName}</li>
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