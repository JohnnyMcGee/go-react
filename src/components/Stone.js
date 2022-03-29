import React from "react";

import {Paper} from "@mui/material";

const Stone = (props) => {
	const bgGradient = props.color === "black"
	? "radial-gradient(ellipse at 60% 10%, rgb(66, 66, 66) 20%, black 95% )"
	: "radial-gradient(ellipse at 60% 10%, white 40%, rgb(190, 190, 190) 95%)";
		let hidden = {};
		if (props.isOpen) {
			hidden = {
				"&:hover":{
					opacity:0.5,
					cursor:"pointer",
				},
				"&:active":{
					top:"-.5em",
					left:"-.25em",
					height:"4.1em",
					width:"4.1em",
					opacity:1,
				},
				"&:focus":{
					height:"100px",
				}
			}
		}
	return (
		<Paper
			elevation={props.isOpen ? 12 : 8}
      onClick={props.isOpen ? props.onClick : null}
		sx={{
			position: "absolute",
			borderRadius: "50%",
			height: "4em",
			width: "4em",
			margin:0,
			opacity:props.isOpen ? 0 : 1,
				background: bgGradient,
				transition: (theme) => theme.transitions.create(["height", "width", "top", "left", "opacity"], {
					duration: theme.transitions.duration.standard,
				}),
				transition: (theme) => theme.transitions.create(["opacity"], {
				duration: theme.transitions.duration.short}),
        ...hidden
			}}
		/>
		);
}

export default Stone;