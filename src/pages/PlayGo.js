import React, { useState, useEffect } from "react";
import {Box, CircularProgress} from "@mui/material";

import Board from "../components/Board.js";

const PlayGo = () => {

	const [gameState, setGameState] = useState({})
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
			} catch (e) {
				console.log(e);
			}
			fetchGameData();
	};

		const onNewGameButtonPressed = async () => {
		getAPI("/new-game").then((_) => fetchGameData()).catch(e=>console.log(e));
	};

	return (
		<Box sx={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: "max-content",
			padding: "6em",
			width: "max-content",
			flexGrow: "1",
		}}>
		{
			Object.keys(gameState).length === 0
		? <CircularProgress/>
		: <Board board={gameState.board} turn={gameState.turn} onPlayPoint={onPlayPoint}/>
		}
		</Box>
	);
};

export default PlayGo;

