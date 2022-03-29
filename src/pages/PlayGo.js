import React, { useState, useEffect } from "react";
import {Box, CircularProgress} from "@mui/material";

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import "./board.css";

const boardSize = 9;

const PlayGo = () => {

	const [gameState, setGameState] = useState({})
	useEffect(() => fetchGameData(), []);
	let currentMove = 

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
		<Box className="container">
			{
				Object.keys(gameState).length === 0
			? <CircularProgress/>
			: <Box className="board" sx={{
	gridTemplateRows: `repeat(${boardSize - 1}, 6em) 0`,
	gridTemplateColumns: `repeat(${boardSize - 1}, 6em) 0`,
		}}>
			{gameState.board.map((row, y) =>
				row.map((point, x) => (
					<Box className="board-square" key={`${point.x}${point.y}`} >
						<Box sx={{position:"absolute", top:"calc(-2em - 1.5px)", left:"calc(-2em - 1.5px)"}}>
						<Point point={point} turn={gameState.turn} onPlayPoint={onPlayPoint}/>
						</Box>
						</Box>
				)))}
		</Box>
		}
		</Box>

	// <div>
	// <div className="scoreboard">
	// <h3>{`Black: ${gameState.score["black"]}`}</h3>
	// <button onClick={() => onNewGameButtonPressed()}>New Game</button>
	// <h3>{`White: ${gameState.score["white"]}`}</h3>
	// </div>
	// <div
	// className="board"
	// style={{
	// gridTemplateRows: `repeat(${boardSize - 1}, 6em) 0`,
	// gridTemplateColumns: `repeat(${boardSize - 1}, 6em) 0`,
	// }}
	// >
	// {gameState.board.map((row, y) =>
	// row.map((point, x) => (
	// <Point point={point} key={Math.random()}/>
	// ))
	// )}
	// </div>
	// </div>
	// </div>
	);
};

export default PlayGo;





const Point = ({point, turn, onPlayPoint}) => {
	const isOpenPoint = point.color === "";
	const isPermitted = point.permit[turn] === true;
	if (!isOpenPoint) {
		return (<Box className={"stone"} sx={{backgroundColor:point.color}} />);
	}
	else if (isPermitted) {
		return (<Box className={"hidden stone"} sx={{backgroundColor:turn}} onClick={()=>onPlayPoint(point)}/>);
	} 
	else {
		return (<CloseRoundedIcon className="hidden" sx={{height:"2.5em", width:"2.5em", color:"#ce0000"}}/>);
	}
}
