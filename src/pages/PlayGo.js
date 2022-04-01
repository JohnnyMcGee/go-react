import React, { useState, useEffect } from "react";
import {Box, Fade, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Backdrop, Snackbar, Modal, CircularProgress, Zoom, Container, AppBar, Toolbar, IconButton, Typography, Stack, Tooltip} from "@mui/material";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import Board from "../components/Board.js";
import Scoreboard from "../components/Scoreboard.js";

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


	useEffect(() => fetchGameData(), []);

	const getAPI = async (endpoint) => {
		let data;
			const res = await fetch("http://localhost:8080" + endpoint);
			data = await res.json();
		return data;
	};

	const fetchGameData = () => {
		getAPI("/game")
			.then(game=>{
				setGameState(game);
				setBackdropOpen(game.ended)
			})
		.catch(e=>console.log(e))
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
				fetchGameData();
			}
	};

	const onNewGameButton = () => {
		const newGameCallback = () => {
			getAPI("/new-game").then((_) => fetchGameData()).catch(e=>console.log(e));
			setDialogOpen(false);
			setSnackbarContent("Started New Game");
			setSnackbarOpen(true);
		};
		if (gameState.ended) {
			newGameCallback();
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
			getAPI("/pass").then(async (_) => fetchGameData()).catch(e=>console.log(e));
			setDialogOpen(false);
			setSnackbarContent(`${capitalize(gameState.turn)} passes`);
			setSnackbarOpen(true);
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

	const displayWinner = () => {
		if (gameState.winner.length > 0) {
			return `${capitalize(gameState.winner)} Wins!`;
		} else {
			return "Draw!";
		}
	}

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
				<Tooltip title="New Game" arrow TransitionComponent={Zoom}>
				<IconButton size="large" aria-label="new game" onClick={onNewGameButton} sx={{color:"rgb(245,245,245)"}}>
				<RefreshIcon fontSize="large"/>
				</IconButton>
				</Tooltip>
				<Tooltip title="Pass" arrow TransitionComponent={Zoom}>
				<IconButton size="large" aria-label="pass" onClick={onPassButton} sx={{color:"rgb(245,245,245)"}}>
				<FastForwardIcon fontSize="large"/>
				</IconButton>
				</Tooltip>
				<Tooltip title="Resign" arrow TransitionComponent={Zoom}>
				<IconButton size="large" aria-label="resign" onClick={onResignButton} sx={{color:"rgb(245,245,245)"}}>
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
			: <Box sx={{
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
		</>
	);
};


export default PlayGo;
