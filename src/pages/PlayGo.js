import React, { useState, useEffect } from "react";
import {Box, CircularProgress, Stack, Drawer} from "@mui/material";

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

	// TODO: add buttons to return home, edit settings, and start a new game

	return (
		<>
			<Stack justifyContent="space-between" position="sticky" left={0} top={0} zIndex={1}>
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
			</Stack>
			<Box sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "max-content",
				padding: "6em",
				width: "max-content",
				flexGrow: "1",
			}}>

			<Stack direction="row">

				{
				Object.keys(gameState).length === 0
			? <CircularProgress/>
			: <Board board={gameState.board} turn={gameState.turn} onPlayPoint={onPlayPoint} currentMove={currentMove}/>
			}
			</Stack>


			</Box>
		</>
	);
};


export default PlayGo;

