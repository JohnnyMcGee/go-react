import React, { useState, useEffect } from "react";
import {Box, CircularProgress, Zoom, Container, AppBar, Toolbar, IconButton, Typography, Stack, Tooltip} from "@mui/material";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import Board from "../components/Board.js";
import Scoreboard from "../components/Scoreboard.js";


const PlayGo = () => {

	const [gameState, setGameState] = useState({})
	const [currentMove, setCurrentMove] = useState([]);
	useEffect(() => fetchGameData(), []);

	const getAPI = async (endpoint) => {
		let data;
			const res = await fetch("http://localhost:8080" + endpoint);
			data = await res.json();
		return data;
	};

	const fetchGameData = async () => {
		getAPI("/game")
			.then(data=>setGameState(data))
		.catch(e=>console.log(e))
	};

		const onPlayPoint = async (point) => {
			console.log(point)
			const move = { x: point.x, y: point.y, color: gameState.turn }
			try {
				await fetch("http://localhost:8080/moves", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(move),
				});
				setCurrentMove([point.x, point.y]);
			} catch (e) {
				console.log(e);
			}
			fetchGameData();
	};

		const onNewGameButtonPressed = async () => {
		getAPI("/new-game").then((_) => fetchGameData()).catch(e=>console.log(e));
	};

	// TODO: add buttons to return home, edit settings, and start a new game, pass, resign current game
	// pretty up current point indicator
	// scrolling with mouse hover?

	return (
		<>
		<AppBar elevation={0} color="transparent">
			<Toolbar>
			<IconButton
				size="large"
				edge="start"
				aria-label="menu"
				sx={{ mr: 2, color:"rgb(245,245,245)",}}
				>
					<MenuRoundedIcon fontSize="large" />
				</IconButton>
				<Stack 
					direction="row"
					flexGrow={1}
					justifyContent="space-evenly"
					sx={{
						position: "absolute",
						left:{
							xs: "64px",
							md: 0,
						},
						right:0,
						}}


					>
				<Scoreboard 
					color="white"
					score={gameState.hasOwnProperty("score") ? gameState.score["white"] : 0}
					turn={gameState.hasOwnProperty("turn") ? gameState.turn : "black"}/>
				<Tooltip title="Pass" arrow TransitionComponent={Zoom}>
				<IconButton size="large" aria-label="pass" sx={{color:"rgb(245,245,245)"}}>
				<FastForwardIcon fontSize="large"/>
				</IconButton>
				</Tooltip>
				<Tooltip title="Resign" arrow TransitionComponent={Zoom}>
				<IconButton size="large" aria-label="resign" sx={{color:"rgb(245,245,245)"}}>
					<FlagRoundedIcon fontSize="large"/>
				</IconButton>
				</Tooltip>

				<Scoreboard 
					color="black" 
					score={gameState.hasOwnProperty("score") ? gameState.score["black"] : 0}
					turn={gameState.hasOwnProperty("turn") ? gameState.turn : "black"}/>
				</Stack>
			</Toolbar>
		</AppBar>
			{
			Object.keys(gameState).length === 0
			? <Container sx={{
				position:"absolute",
				top:"40%",
				display:"grid",
				gridTemplateRows:"1fr 1fr",
				gridRowGap:"2em"
				}}>
			<Typography variant="h5" color="white" textAlign="center">Loading Game Board</Typography>
				<CircularProgress sx={{m:"auto"}}/>
			</Container> 
			:
			<Box sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "max-content",
				padding: "6em",
				width: "max-content",
				flexGrow: "1",
			}}>
				<Board board={gameState.board} turn={gameState.turn} onPlayPoint={onPlayPoint} currentMove={currentMove}/>
			</Box>
			}
		</>
	);
};


export default PlayGo;


{/* <Stack justifyContent="space-between" position="fixed" left={0} top={0} bottom={0} zIndex={1}>
<Scoreboard
	color="white" 
	turn={gameState.hasOwnProperty("turn") ? gameState.turn : "black"} 
	score={gameState.hasOwnProperty("score") ? gameState.score["white"] : 0}
	/>
<Scoreboard 
	color="black" 
	turn={gameState.hasOwnProperty("turn") ? gameState.turn : "black"} 
	score={gameState.hasOwnProperty("score") ? gameState.score["black"] : 0}
	/>
</Stack> */}
