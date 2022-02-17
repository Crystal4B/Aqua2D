import "./LayersPanel.css"

import { AiFillLock, AiFillUnlock, AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setOptions } from "../../../../Redux/Menu/menuActions";
import { optionState } from "../../../../Redux/Menu/menuReducer";
import { rootState } from "../../../../Redux/store";
import { layerState, levelsState } from "../../../../Redux/Levels/levelReducer";
import { addLayer, lockLayer, selectLayer, showLayer } from "../../../../Redux/Levels/levelsActions";

const LayersPanel = () =>
{
	const layers = useSelector<rootState, {[id: string]: layerState}>((state) => Object.fromEntries(Object.entries(state.levels.layers).filter(([_, layer]) => layer.sceneId === state.levels.selectedSceneId)));
	const sceneId = useSelector<rootState, levelsState["selectedSceneId"]>(state => state.levels.selectedSceneId);

	const onAddLayerTop = () =>
	{
		dispatch(addLayer(sceneId, "DEFAULT"));
	}
	
	const onAddLayerBottom = () =>
	{
		dispatch(addLayer(sceneId, "DEFAULT"));
	}

	// TODO: CLEAN THIS UP
	const contextMenu: Array<optionState> = [{optionName: "Add layer at top", optionFunction: onAddLayerTop}, {optionName: "Add layer at bottom", optionFunction: onAddLayerBottom}];

	const dispatch = useDispatch();
	const handleContextMenu = () =>
	{
		dispatch(setOptions(contextMenu));
	}

	const handleChangeVisibility = (id: string) =>
	{
		dispatch(showLayer(id));
	}

	const handleChangeLocking = (id: string) =>
	{
		dispatch(lockLayer(id));
	}
	
	const handleChangeSelection = (id: string) =>
	{
		dispatch(selectLayer(id));
	}

	return (
		<div className="panel">
			<div className="header">Layers</div>
			<div className="content" style={{height: "50vh"}} onContextMenu={handleContextMenu}>
				<ul>
					{Object.keys(layers).map((layerId) => 
						{return <li key={layerId} className={layers[layerId].selected ? "selected" : ""}>
							<span onClick={() => handleChangeSelection(layerId)}>{layers[layerId].layerName}</span>
							{layers[layerId].visible ? <AiFillEye className="icon" onClick={() => handleChangeVisibility(layerId)}/> : <AiFillEyeInvisible className="icon" onClick={() => handleChangeVisibility(layerId)}/>}
							{layers[layerId].locked ? <AiFillLock className="icon" onClick={() => handleChangeLocking(layerId)}/> : <AiFillUnlock className="icon" onClick={() => handleChangeLocking(layerId)}/>}
						</li>}
					)}
				</ul>
			</div>
		</div>
	);
}

export default LayersPanel;