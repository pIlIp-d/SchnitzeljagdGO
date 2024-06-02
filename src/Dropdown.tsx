import React, { useState } from 'react';
import { Quest } from './types';
import { Box, Button, Dialog, IconButton, List, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ProgressBar from './ProgressBar';
import CloseIcon from '@mui/icons-material/Close';

interface DropdownProps {
	quests: Quest[];
	selectQuest: (quest: Quest) => void;
	addQuest: () => void;
}


const Dropdown: React.FC<DropdownProps> = ({ quests, selectQuest, addQuest }) => {
	const [isOpen, setIsOpen] = useState(false);


	function handleClose() {
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
								<ListItemButton sx={{ boxShadow: 2 }}  >
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
				<Button onClick={addQuest}>
					Get a new Quest
				</Button>
			</Dialog >
		</>
	);
};

export default Dropdown;
