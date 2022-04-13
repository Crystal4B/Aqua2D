import "./PropertiesPanel.css"
import React, { useState } from "react";
import Card from "./Card";
import { useSelector } from "react-redux";
import { rootState } from "../../../../Redux/store";
import { PropertiesState } from "../../../../Redux/Levels/Properties/PropertiesReducer";
import SceneProperies from "./SceneProperties";
import ObjectProperies from "./ObjectProperties";

const PropertiesPanel = () => {
	const properties = useSelector<rootState, PropertiesState>(state => state.levels.properties);

	const renderProperties = () =>
	{
		switch (properties.focusedType)
		{
		case "Scene":
			return (
				<SceneProperies focusedId={properties.focusedId}/>
			)
		case "Object":
			return (
				<ObjectProperies focusedId={properties.focusedId}/>
			)
		}
		return null;
	}

	return (
		<div className="panel">
			<div className="header">Properties</div>
			<div className="properties-list" style={{height: "50vh"}}>
				{renderProperties()}
			</div>
		</div>
	)
}

export default PropertiesPanel;