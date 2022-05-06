import {Paper} from "@mui/material";
import React, { useState } from "react";

const Stone = ({isOpen, color, onClick, sx, ...props}) => {
	const [clicked,  setClicked] = useState(false);

	const pos = {
		position: "absolute",
		borderRadius: "50%",
		height: "4em",
		width: "4em",
		margin:0,
	}

	const bgGradient = color === "black"
	? "radial-gradient(ellipse at 60% 10%, rgb(66, 66, 66) 20%, black 95% )"
	: "radial-gradient(ellipse at 60% 10%, white 40%, rgb(190, 190, 190) 95%)";
	
	const hidden = (isOpen && !clicked)
	? {
		"&:hover":{
			opacity: 0.5,
			cursor:"pointer",
		},
		"&:active":{
			top:"-.6em",
			left:"-.25em",
			height:"4.1em",
			width:"4.1em",
			opacity:1,
			cursor:"pointer",
		},
	}
	: {opacity: 1};

	const handleClick = () => {
		if (isOpen) {
			onClick();
			setClicked(true);
		}
	}

	return (
		<div onClick={handleClick} style={{...pos, ...sx}}>
		<Paper
			{...props}
			elevation={isOpen ? 12 : 8}
			sx={{
				opacity:isOpen ? 0 : 1,
				background: bgGradient,
				transition: (theme) => theme.transitions.create(["height", "width", "top", "left", "opacity"], {
					duration: theme.transitions.duration.standard,
				}),
				...pos,
				...sx,
				...hidden,
			}}
		/>
		</div>
	);
}

export default Stone;
