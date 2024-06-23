import React, { Fragment, useEffect, useState } from 'react';
import { Quest, QuestGroup } from './types';
import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	Snackbar,
	Stack,
} from '@mui/material';
import ProgressBar from './ProgressBar';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import OverlayButton from './views/OverlayButton';
import { MAX_RANDOM_QUESTS } from './config';
import OSMButton from './views/buttons/OSMButton';

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
	const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
	const [randomQuests, setRandomQuests] = useState<Quest[]>([]);
	const [doneQuests, setDoneQuests] = useState<Quest[]>([]);

	useEffect(() => {
		if (error) setSnackBarOpen(true);
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
	};

	const action = (
		<Fragment>
			<Button color="primary" size="small" onClick={addQuest}>
				RETRY
			</Button>
			<IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackBarOpen(false)}>
				<CloseIcon fontSize="small" />
			</IconButton>
		</Fragment>
	);

	useEffect(() => {
		setIsLoading(false);
		setDailyQuests(Object.values(quests).filter(q => q.group === QuestGroup.Daily));
		setRandomQuests(Object.values(quests).filter(q => !q.done && q.group === QuestGroup.Random));
		setDoneQuests(Object.values(quests).filter(q => q.done));
	}, [quests]);

	return (
		<>
			<OverlayButton
				ariaLabel="open-quest-list"
				onClick={() => setIsOpen(true)}
				sx={{
					top: '30px',
					right: '15px',
				}}
				icon={
					<ChecklistRtlIcon />
				}
			/>

			<Dialog aria-labelledby="dialog-title" aria-describedby="dialog-description" open={isOpen} onClose={handleClose}>
				<Box mx={2}>
					<Stack alignItems={'center'} justifyContent={'space-between'} direction={'row'}>
						<h2 id="dialog-title">Your open Quests</h2>
						<IconButton aria-label="close" onClick={handleClose} sx={{ height: '40px', width: '40px' }}>
							<CloseIcon />
						</IconButton>
					</Stack>
				</Box>
				{dailyQuests.length > 0 && <>
					<Box mx={2} >
						<h3 id="daily-quests-title">Daily Quests</h3>
					</Box>

					<List>
						{dailyQuests.map(quest => (
							<ListItem key={quest.id}>
								<ListItemButton sx={{ boxShadow: 2 }}>
									<Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
										<div onClick={() => handleListItemClick(quest)}>
											<div>{quest.name}</div>
											<ProgressBar current={quest.doneNodes?.length ?? 0} max={quest.max} />
										</div>
										{quest.tagId && <OSMButton showText={false} tagID={quest.tagId} />}
									</Box>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</>
				}
				<Box mx={2}>
					<h3 id="random-quests-title">Random Quests</h3>
				</Box>
				{randomQuests.length > 0 && <>
					<List>
						{randomQuests.map(quest => (
							<ListItem key={quest.id}>
								<ListItemButton sx={{ boxShadow: 2 }}>
									<Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
										<div onClick={() => handleListItemClick(quest)}>
											<div>{quest.name}</div>
											<ProgressBar current={quest.doneNodes?.length ?? 0} max={quest.max} />
										</div>
										{quest.tagId && <OSMButton showText={false} tagID={quest.tagId} />}
										<IconButton onClick={() => removeQuest(quest.id!)}>
											<DeleteIcon />
										</IconButton>
									</Box>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</>
				}
				{isLoading && (
					<Box sx={{ display: 'flex', justifyContent: 'Center' }}>
						<CircularProgress />
					</Box>
				)}
				{randomQuests.length < MAX_RANDOM_QUESTS &&
					<Button disabled={isLoading} onClick={pressGetNewQuest}>Get a new Quest</Button>
				}

				{doneQuests.length > 0 && <>
					<Box mx={2}>
						<h3 id="done-quests-title">Done Quests</h3>
					</Box>
					<List>
						{doneQuests.map(quest => (
							<ListItem key={quest.id}>
								<ListItemButton sx={{ boxShadow: 2 }}>
									<Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
										<div onClick={() => handleListItemClick(quest)}>
											<div>{quest.name}</div>
											<ProgressBar current={quest.doneNodes?.length ?? 0} max={quest.max} />
										</div>
									</Box>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</>
				}
			</Dialog>
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
