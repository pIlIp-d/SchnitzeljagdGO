import React from 'react';
import { Quest } from './types';
import ProgressBar from './ProgressBar';
import { Button, Typography, Box } from '@mui/material';

type QuestDetailsProps = {
	checkLocation: () => void;
	quest: Quest;
};

const QuestDetails: React.FC<QuestDetailsProps> = ({ checkLocation, quest }) => {
	return (
		<Box display={"flex"} flexDirection={'column'}>

			<Typography >
				{quest.name}
			</Typography>
			{quest.doneNodes.length == quest.max
				? <ProgressBar max={quest.max} current={quest.doneNodes.length} />
				: <>
					<ProgressBar max={quest.max} current={quest.doneNodes.length} />
					<Button onClick={checkLocation}>
						Check Location
					</Button>
				</>
			}
		</Box>
	);
};

export default QuestDetails;
