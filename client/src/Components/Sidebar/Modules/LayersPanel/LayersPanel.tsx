import "./LayersPanel.css"

import { AiFillLock, AiFillUnlock, AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setOptions } from "../../../../Redux/Menu/menuActions";
import { optionState } from "../../../../Redux/Menu/menuReducer";
import { rootState } from "../../../../Redux/store";
import { addLayer, lockLayer, selectLayer, showLayer } from "../../../../Redux/Levels/Layers/layerActions";
import { layerState } from "../../../../Redux/Levels/Layers/layerReducer";

/**
 * Panel handling creation and settings of layers
 * @returns JSX implementation of the panel
 */
const LayersPanel = () =>
{
	const sceneId = useSelector<rootState, string>(state => state.levels.scenes.byId[state.levels.levels.selectedId].selectedId);
	const {data, order, selectedId} = useSelector<rootState, {data: {[layerId: string]: layerState}, order: string[], selectedId: string}>(state => state.levels.layers.byId[sceneId]);

	/**
	 * Function adding a layer to the top of the list
	 */
	const onAddLayerTop = () =>
	{
		var counter = Object.keys(data).length;
		dispatch(addLayer(sceneId, `Layer ${counter}`, "TOP"));
	}
	
	/**
	 * Function adding a layter to the bottom of the list
	 */
	const onAddLayerBottom = () =>
	{
		var counter = Object.keys(data).length;
		dispatch(addLayer(sceneId, `Layer ${counter}`, "BOTTOM"));
	}

	// Setting context menu options
	const contextMenu: Array<optionState> = [{optionName: "Add layer at top", optionFunction: onAddLayerTop}, {optionName: "Add layer at bottom", optionFunction: onAddLayerBottom}];

	const dispatch = useDispatch();
	
	/**
	 * Function setting context menu options
	 */
	const handleContextMenu = () =>
	{
		dispatch(setOptions(contextMenu));
	}

	/**
	 * Function handling change of visibility in a layer
	 * @param id of layer being changed
	 */
	const handleChangeVisibility = (id: string) =>
	{
		dispatch(showLayer(sceneId, id));
	}

	/**
	 * Function handling change in locking of a layer
	 * @param id of the layer being changed
	 */
	const handleChangeLocking = (id: string) =>
	{
		dispatch(lockLayer(sceneId, id));
	}
	
	/**
	 * Function handling selection of a layer
	 * @param id of the layer being selected
	 */
	const handleChangeSelection = (id: string) =>
	{
		dispatch(selectLayer(sceneId, id));
	}

	return (
		<div className="panel">
			<div className="content" style={{height: "50vh"}} onContextMenu={handleContextMenu}>
				<ul>
					{order.map((layerId) => {
						return <li key={layerId} className={layerId === selectedId ? "selected" : ""}>
							<span onClick={() => handleChangeSelection(layerId)}>{data[layerId].layerName}</span>
							{data[layerId].visible ? <AiFillEye className="icon" onClick={() => handleChangeVisibility(layerId)}/> : <AiFillEyeInvisible className="icon" onClick={() => handleChangeVisibility(layerId)}/>}
							{data[layerId].locked ? <AiFillLock className="icon" onClick={() => handleChangeLocking(layerId)}/> : <AiFillUnlock className="icon" onClick={() => handleChangeLocking(layerId)}/>}
						</li>
					})}
				</ul>
			</div>
		</div>
	);
}

export default LayersPanel;