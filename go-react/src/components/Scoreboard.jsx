import React from 'react'

import {Paper, Typography} from "@mui/material";

import Stone from "./Stone.jsx";


const Scoreboard = ({color, score, turn}) => {
	const isCurrentPlayer = color===turn;
	return (
	<Paper
		sx={{
			p:`${isCurrentPlayer? ".4em" : "calc(.4em + 3px)"} 2em`,
			backgroundColor: "rgb(82 205 82 / 85%)",
			border: (color===turn) ? "3px solid rgb(245,245,245)" : "0",
			transition:theme=>theme.transitions.create(["border", "p"], {duration:theme.transitions.duration.complex}),
			display:"grid",
			gridTemplateColumns:"1fr 1fr",
			columnGap:"1.5em",
			alignItems:"center",
		}}>
		<Stone 
		color={color}
		sx={{
			position: "static",
			height: "2em",
			width: "2em",
			m: "auto",
		}}/>
		<Typography
		variant="h4" 
		color={color==="black" ? "black" : "rgb(245, 245, 245)"} 
		fontWeight="bold" 
		borderBottom="2px solid"
		m="auto"
		noWrap>
		{String(score).padStart(2, '0')}
		</Typography>
		</Paper>
		)
	}

export default Scoreboard;