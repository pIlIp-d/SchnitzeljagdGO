import React from 'react';
import { Quest } from './types';
import ProgressBar from './ProgressBar';
import { Button, Typography, Box, IconButton, Card } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type QuestDetailsProps = {
	checkLocation: () => void;
	quest: Quest;
	onBackClick: () => void;
	loading: boolean;
};

const QuestDetails: React.FC<QuestDetailsProps> = ({ checkLocation, loading, quest, onBackClick }) => {
	return (
		<Card className="questOverlayCard">
			<Box display={'flex'} flexDirection={'row'} justifyContent={'right'}>
				<IconButton aria-label="back" onClick={onBackClick} sx={{ height: '40px', width: '40px' }}>
					<CloseIcon />
				</IconButton>
			</Box>
			<Box display={'flex'} px={'1rem'} pb={'1rem'} flexDirection={'column'}>
				<Typography>{quest.name}</Typography>
				{quest.doneNodes?.length && quest.doneNodes?.length >= quest.max ? (
					<ProgressBar max={quest.max} current={quest.doneNodes?.length} />
				) : (
					<>
						<ProgressBar max={quest.max} current={quest.doneNodes?.length ?? 0} />
						<Button disabled={loading} onClick={checkLocation}>Check Location</Button>
					</>
				)}
			</Box>
		</Card>
	);
};

export default QuestDetails;
