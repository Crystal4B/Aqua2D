import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom";

const Renderer = () =>
{
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const newWindow = useRef(null);

	useEffect(() =>{
		// Create container element on client-side
		setContainer(document.createElement("div"));
	}, []);

	useEffect(() => {
		if (container)
		{
			newWindow.current = window.open("", "", "width=600,heigh=600,left=200,top=200");
			newWindow.current.document.body.appendChild(container);

			const curWindow = newWindow.current;

			return () => curWindow.close();
		}
	}, [container]);

	return container && createPortal(props.children, container);
}