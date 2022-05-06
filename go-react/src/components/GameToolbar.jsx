import React from 'react'

import {AppBar, Toolbar, IconButton, Stack, Tooltip, Zoom} from "@mui/material";

import FastForwardIcon from "@mui/icons-material/FastForward";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CastleOutlinedIcon from '@mui/icons-material/CastleOutlined';
import CastleRoundedIcon from '@mui/icons-material/CastleRounded';

import Scoreboard from "../components/Scoreboard.js";

const GameToolbar = ({score, turn, showTerritory, onNewGame, onPass, onResign, onShowTerritory}) => {
	return (
		<AppBar elevation={0} color="transparent">
			<Toolbar>
				<Stack 
					direction="row"
					flexGrow={1}
					justifyContent="space-between"
					sx={{
						position: "absolute",
						left:0,
						right:0,
						}}>
					<Scoreboard 
						color="white"
						score={score["white"]}
						turn={turn}/>
					<Tooltip title="New Game" arrow TransitionComponent={Zoom}>
						<IconButton size="large" aria-label="new game" onClick={onNewGame} sx={{color:"rgb(245,245,245)"}}>
							<RefreshRoundedIcon fontSize="large"/>
						</IconButton>
					</Tooltip>
					<Tooltip title="Pass" arrow TransitionComponent={Zoom}>
						<IconButton size="large" aria-label="pass" onClick={onPass} sx={{color:"rgb(245,245,245)"}}>
							<FastForwardIcon fontSize="large"/>
						</IconButton>
					</Tooltip>
					<Tooltip title="Resign" arrow TransitionComponent={Zoom}>
						<IconButton size="large" aria-label="resign" onClick={onResign} sx={{color:"rgb(245,245,245)"}}>
							<FlagRoundedIcon fontSize="large"/>
						</IconButton>
					</Tooltip>
					<Tooltip title={(showTerritory ? "Hide" : "Show") + " Territory"} arrow TransitionComponent={Zoom}>
						<IconButton size="large" aria-label="resign" onClick={onShowTerritory} sx={{color:"rgb(245,245,245)"}}>
							{showTerritory 
								? <CastleRoundedIcon fontSize="large" />
								: <CastleOutlinedIcon fontSize="large"/>
							}
						</IconButton>
					</Tooltip>
					<Scoreboard 
						color="black" 
						score={score["black"]}
						turn={turn}/> 
				</Stack>
			</Toolbar>
        </AppBar>
	)
}

export default GameToolbar
