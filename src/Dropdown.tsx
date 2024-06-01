import React, { useState } from 'react';
import { Quest } from './types';
import { Box, Button, Dialog, Divider, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemText, Modal, Paper, Stack, Typography, styled } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ProgressBar from './ProgressBar';
import CloseIcon from '@mui/icons-material/Close';
import { FastForward } from '@mui/icons-material';

interface DropdownProps {
	quests: Quest[];
	selectQuest: (quest: Quest) => void;
}


const Dropdown: React.FC<DropdownProps> = ({ quests, selectQuest }) => {
	const [isOpen, setIsOpen] = useState(false);


	function handleClose() {
		console.log("closed Dialog");
		setIsOpen(false);
	}

	const handleListItemClick = (quest: Quest) => {
		handleClose();
		selectQuest(quest);
	};

	return (
		<>
			<Button
				variant="outlined"
				onClick={() => setIsOpen(true)}
				startIcon={< KeyboardArrowDownIcon />}
			>
				Quests
			</Button>
			<Dialog aria-labelledby="dialog-title" aria-describedby="dialog-description"
				open={isOpen}
				onClose={handleClose}
			>

				<Box mx={2}>
					<Stack alignItems={"center"} justifyContent={"space-between"} direction={"row"}>
						<h2 id="dialog-title">Your open Quests</h2>
						<IconButton aria-label="close" onClick={handleClose} sx={{ height: "40px", width: "40px" }}>
							<CloseIcon />
						</IconButton>
					</Stack>
				</Box>
				<List>
					{quests.map((quest, index) => (
						<>
							<ListItem key={index} onClick={() => handleListItemClick(quest)} >
								<ListItemButton className='list-item-button-shadow'>
									<ListItemText
										primary={quest.name}
										secondary={
											<ProgressBar current={quest.doneNodes.length} max={quest.max} />
										}
									/>
								</ListItemButton>
							</ListItem >
						</>
					))}
				</List>
			</Dialog >
		</>
	);
};

export default Dropdown;
