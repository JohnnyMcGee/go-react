import React, { useState, useEffect } from "react";
import {Box, Fade, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Backdrop, Snackbar, CircularProgress, Container, Typography, Stack} from "@mui/material";
import Board from "../components/Board.js";
import GameToolbar from "../components/GameToolbar.js";

const FadeTransition = (props) => <Fade {...props} timeout={{enter:1600, exit:450}}/>;
const capitalize = (str) => `${str.slice(0,1).toUpperCase() + str.slice(1).toLowerCase()}`

const PlayGo = () => {

	const [gameState, setGameState] = useState({})
	const [currentMove, setCurrentMove] = useState([]);
	const [backdropOpen, setBackdropOpen] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarContent, setSnackbarContent] = useState('');
	const [dialogContent, setDialogContent] = useState({title: "", message:"", callback:()=>{},})
	const [dialogOpen, setDialogOpen] = useState(false);
	const [showTerritory, setShowTerritory] = useState(false);


	useEffect(() => {
		fetchGameData()
	}, []);

	const autoPlay = async (numGames, trainInterval) => {
		console.log("auto play");
		while (true) {
			const game = await fetchGameData()
			if (game.ended) {
				console.log(numGames)
				numGames--
				if (numGames <=0) {
					break
				} else {
					if (numGames % trainInterval === 0) {
						console.log("training AI players...")
						await getAPI("/train-netplayer")
					}
					await newGameCallback()
				}
			}
			await getAIPlayerMove()
		}
		console.log("game over")
}

	const getAPI = async (endpoint) => {
		let data;
			const res = await fetch("http://localhost:8080" + endpoint);
			data = await res.json();
		return data;
	};

	const fetchGameData = async () => {
		try {
			const game = await getAPI("/game");
			setGameState(game);
			setBackdropOpen(game.ended)
			return game
		} catch(e) {
			console.log(e)
		}
	};

		const onPlayPoint = async (point) => {
			if (!gameState.ended) {
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
				await fetchGameData();
				getAIPlayerMove("white", false);
			}
	};



	const getAIPlayerMove = async () => {
		try {
			// const endpoint = (randomize ? "/random-move/" + color: "/netplayer-move/");
			const endpoint = "/netplayer-move";
			const playerMove = await getAPI(endpoint);
			if (playerMove === "pass") {
				setSnackbarContent("White passes.");
				setSnackbarOpen(true);
			} else {
				setCurrentMove([playerMove.x, playerMove.y]);
			}
			return await fetchGameData()
		} catch(e) {
			console.log(e);
		}
	}

	const newGameCallback = async () => {
		try {
			await getAPI("/new-game")
			await fetchGameData()
			setDialogOpen(false);
			setSnackbarContent("Started New Game");
			setSnackbarOpen(true);
		} catch(e) {
			console.log(e)
		}
	};

	const onNewGameButton = async () => {
		if (gameState.ended) {
			await newGameCallback();
		} else {
			setDialogContent({
				title: "Start a New Game",
				message: "Are you sure? This will end the current game.",
				callback: newGameCallback,
			});
				setDialogOpen(true);
		}
	};

	const onPassButton = () => {
		const passCallback = () => {
			try {
				(async() => {
					await getAPI("/pass")
					await fetchGameData()
					getAIPlayerMove("white", false);
				})();
				setDialogOpen(false);
				setSnackbarContent(`${capitalize(gameState.turn)} passes`);
				setSnackbarOpen(true);
			} catch (error) {
				console.log(error)
			}
		}
		if (gameState.ended) {
			return
		} else if (gameState.passed) {
			setDialogContent({
				title: "Pass",
				message: "Are you sure? If both players pass consecutively, the game will end.",
				callback:passCallback,
			});
			setDialogOpen(true);
		} else {
			passCallback();
		}
	};

	const onResignButton = async () => {
		const resignCallback = () => {
			getAPI("/resign").then((_)=>fetchGameData()).catch(e=>console.log(e));
			setDialogOpen(false);
			setSnackbarContent(`${capitalize(gameState.turn)} resigned.`);
			setSnackbarOpen(true);
		}
		if (gameState.ended) {
			return
		}
		setDialogContent({
			title: "Resign Game",
			message: "Are you sure? If you resign, your opponent automatically wins.",
			callback:resignCallback,
		})
		setDialogOpen(true);

	}

	const onShowTerritoryButton = () => {
		setShowTerritory(!showTerritory);
	}


	const displayWinner = () => {
		if (gameState.winner.length > 0) {
			return `${capitalize(gameState.winner)} Wins!`;
		} else {
			return "Draw!";
		}
	}

	// TODO: add buttons to return home, edit settings
	// pretty up current point indicator
	// scrolling with mouse hover?

	return (
		<>
		<GameToolbar
			score={gameState.hasOwnProperty("score") ? gameState.score : {"black":0, "white":0}}
			turn={gameState.hasOwnProperty("turn")? gameState.turn : "black"}
			showTerritory={showTerritory}
			onNewGame={onNewGameButton}
			onPass={onPassButton}
			onResign={onResignButton}
			onShowTerritory={onShowTerritoryButton}
		/>
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
			: <>
			<Box sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "max-content",
				padding: "6em",
				width: "max-content",
				flexGrow: "1",
			}}>
				<Board
					board={gameState.board}
					turn={gameState.turn}
					onPlayPoint={onPlayPoint}
					currentMove={currentMove}
					showTerritory={showTerritory}
				/>
			</Box>
			<Backdrop open={backdropOpen} onClick={()=>setBackdropOpen(false)}>
			<Stack textAlign="center">
				<Typography variant="h1" fontWeight="bold" sx={{color:"rgba(245,245,245, .5)"}}>
					Game Over
				</Typography>
				<Typography variant="h2" fontWeight="bold" sx={{color: "rgba(245,245,245,.5)",}}>
					{displayWinner()}
				</Typography>
			</Stack>
			</Backdrop>
			</>
			}
			<Snackbar TransitionComponent={FadeTransition} open={snackbarOpen} autoHideDuration={2500} message={snackbarContent} anchorOrigin={{vertical: "bottom", horizontal: "center"}}onClose={()=>setSnackbarOpen(false)}/>
			<Dialog
				open={dialogOpen}
				onClose={()=>setDialogOpen(false)}
				>
					<DialogTitle>
						{dialogContent.title}
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
				{dialogContent.message}
					</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={dialogContent.callback}>Yes</Button>
						<Button onClick={()=>setDialogOpen(false)} autoFocus>
							No
						</Button>
					</DialogActions>
					</Dialog>
					<Button variant="contained" onClick={()=>autoPlay(50, 10)} sx={{position:"fixed", left:"2em", bottom:"2em"}}>Auto</Button>
		</>
	);
};


export default PlayGo;
