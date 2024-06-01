import React, { useEffect } from 'react';
import { Quest } from './types';

type QuestDetailsProps = {
	checkLocation: () => void;
	quest: Quest;
};

const QuestDetails: React.FC<QuestDetailsProps> = ({ checkLocation, quest }) => {
	return (
		<div className="questDetails-container">
			<h1>{quest.name}</h1>
			{quest.doneNodes.length == quest.max
				? <>
					<div className="progress-container progress-container-done">
						<progress value={quest.doneNodes.length} max={quest.max} />
						<span className="progress-label">
							{quest.doneNodes.length}/{quest.max}
						</span>
					</div>
				</>
				: <>
					<div className="progress-container">
						<progress value={quest.doneNodes.length} max={quest.max} />
						<span className="progress-label">
							{quest.doneNodes.length}/{quest.max}
						</span>
					</div>
					<div className="button-container">
						<button className="location-button" onClick={checkLocation}>
							Check Location
						</button>
					</div>
				</>
			}
		</div>
	);
};

export default QuestDetails;
