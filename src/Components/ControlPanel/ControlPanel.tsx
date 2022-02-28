import "./ControlPanel.css"
import { FaPlay } from "react-icons/fa";

/**
 * Level Renderer is a componenet responsible for organizing and managing the level display
 */
const ControlPanel = () =>
{
	const runPreview = () =>
	{
		
	}

	return (
		<div className="control-panel">
			<FaPlay onClick={runPreview} className="button"/>
		</div>
	);
}

export default ControlPanel;