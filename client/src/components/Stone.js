import {Paper} from "@mui/material";

const Stone = ({isOpen, color, onClick, sx, ...props}) => {

	const bgGradient = color === "black"
	? "radial-gradient(ellipse at 60% 10%, rgb(66, 66, 66) 20%, black 95% )"
	: "radial-gradient(ellipse at 60% 10%, white 40%, rgb(190, 190, 190) 95%)";
		let hidden = {};
		if (isOpen) {
			hidden = {
				"&:hover":{
					opacity:0.5,
					cursor:"pointer",
				},
				"&:active":{
					top:"-.6em",
					left:"-.25em",
					height:"4.1em",
					width:"4.1em",
					opacity:1,
				},
				"&:focus":{
					opacity:1
				},
			}
		}
	return (
		<Paper
		{...props}
		tabIndex="0"
			elevation={isOpen ? 12 : 8}
				onClick={isOpen ? onClick : null}
		sx={{
			position: "absolute",
			borderRadius: "50%",
			height: "4em",
			width: "4em",
			margin:0,

			opacity:isOpen ? 0 : 1,
				background: bgGradient,
				transition: (theme) => theme.transitions.create(["height", "width", "top", "left", "opacity"], {
					duration: theme.transitions.duration.standard,
				}),
			...sx,
			...hidden,
			}}
		/>
		);
}

export default Stone;
