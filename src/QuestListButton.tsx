import React, { Fragment, useEffect, useState } from 'react';
import { Quest } from './types';
import { Box, Button, CircularProgress, Dialog, IconButton, List, ListItem, ListItemButton, Snackbar, Stack } from '@mui/material';
import ProgressBar from './ProgressBar';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';

interface QuestListButtonProps {
	quests: { [key: string]: Quest };
	selectQuest: (quest: Quest) => void;
	addQuest: () => void;
	removeQuest: (questID: string) => void;
	error: boolean;
}


const QuestListButton: React.FC<QuestListButtonProps> = ({ quests, selectQuest, addQuest, removeQuest, error }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [snackBarOpen, setSnackBarOpen] = useState(false);
	useEffect(() => {
		if (error)
			setSnackBarOpen(true);
	}, [error]);



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

	const action = (
		<Fragment>
			<Button color="primary" size="small" onClick={addQuest}>
				RETRY
			</Button>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={() => setSnackBarOpen(false)}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</Fragment>
	);


	useEffect(() => {
		setIsLoading(false);
	}, [quests]);

	return (
		<>
			<IconButton
				aria-label="open-quest-list"
				onClick={() => setIsOpen(true)}
				className="customOverlayIconButton"
				sx={{
					top: "30px",
					right: "15px"
				}}
			>
				<ChecklistRtlIcon className="customOverlayIcon" />
			</IconButton>
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
						<ListItem key={quest.id}  >
							<ListItemButton sx={{ boxShadow: 2 }} >
								<Box display={'flex'} justifyContent={"space-between"} width={"100%"}>
									<div onClick={() => handleListItemClick(quest)}>
										<div>{quest.name}</div>
										<ProgressBar current={quest.doneNodes?.length ?? 0} max={quest.max} />
									</div>
									<IconButton onClick={() => removeQuest(quest.id!)}>
										<DeleteIcon />
									</IconButton>
								</Box>
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
			<Snackbar
				open={snackBarOpen}
				autoHideDuration={5000}
				onClose={() => setSnackBarOpen(false)}
				message="No more Quests near you."
				action={action}
			/>
		</>
	);
};

export default QuestListButton;
