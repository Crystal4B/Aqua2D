import "./ControlPanel.css"
import { FaPause, FaPlay } from "react-icons/fa";
import { useRef, useState } from "react";
import GameRenderer from "../Renderer/GameRenderer";

/**
 * Level Renderer is a componenet responsible for organizing and managing the level display
 */
const ControlPanel = () =>
{
	const [previewOn, setPreviewOn] = useState(false);
	const divRef = useRef<HTMLDivElement>();
	const windowRef = useRef<Window>();

	const runPreview = () =>
	{
		if (previewOn)
		{
			windowRef.current?.close();
			setPreviewOn(false);
		}
		else
		{
			const div = document.createElement("div");
			if (div)
			{
				divRef.current = div;
				const newWindow = window.open("", "", "width=600,height=600,left=200,top=200");
				if (newWindow)
				{
					windowRef.current = newWindow;
					newWindow.document.body.appendChild(divRef.current);
					newWindow.document.title = "Game Name";
					newWindow.addEventListener("beforeunload", () => {setPreviewOn(false);})
					setPreviewOn(true);
				}
			}
		}
	}

	return (
		<>
		<div className="control-panel">
			{previewOn ? <FaPause onClick={runPreview} className="button"/> : <FaPlay onClick={runPreview} className="button"/>}
		</div>
		{previewOn && divRef.current ? <GameRenderer container={divRef.current}/> : null}
		</>
	);
}

export default ControlPanel;