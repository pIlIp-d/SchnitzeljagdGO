import React, { useEffect, useState } from 'react';
import { Quest } from './types';
import { Box, Button, CircularProgress, Dialog, IconButton, List, ListItem, ListItemButton, Stack } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ProgressBar from './ProgressBar';
import CloseIcon from '@mui/icons-material/Close';

interface DropdownProps {
	quests: { [key: string]: Quest };
	selectQuest: (quest: Quest) => void;
	addQuest: () => void;
}


const Dropdown: React.FC<DropdownProps> = ({ quests, selectQuest, addQuest }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	function handleClose() {
		setIsOpen(false);
	}

	const handleListItemClick = (quest: Quest) => {
		handleClose();
		selectQuest(quest);
	};

	const pressGetNewQuest = () => {
		setIsLoading(true);
		addQuest();
	}

	useEffect(() => {
		setIsLoading(false);
	}, [quests]);

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
					{Object.values(quests).map((quest) => (
						<ListItem key={quest.id} onClick={() => handleListItemClick(quest)} >
							<ListItemButton sx={{ boxShadow: 2 }}  >
								<div>
									<div>{quest.name}</div>
									<ProgressBar current={quest.doneNodes?.length ?? 0} max={quest.max} />
								</div>
							</ListItemButton>
						</ListItem >
					))}
				</List>
				{
					isLoading &&
					<Box sx={{ display: 'flex', justifyContent: "Center" }} ><CircularProgress /></Box>
				}
				<Button onClick={pressGetNewQuest}>
					Get a new Quest
				</Button>
			</Dialog >
		</>
	);
};

export default Dropdown;
