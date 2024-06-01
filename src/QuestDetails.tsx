import React from 'react';
import { Quest } from './types';

type QuestDetailsProps = {
	checkLocation: () => void;
	quest: Quest;
	current: number;
};

const QuestDetails: React.FC<QuestDetailsProps> = ({ checkLocation, quest, current }) => {
	return (
		<div>
			{quest ? (
				<>
					<div className="questDetails-container">
						<h1>{quest.name}</h1>
						<div className="progress-container">
							<progress value={current} max={quest.max} />
							<span className="progress-label">
								{current}/{quest.max}
							</span>
						</div>
						<div className="button-container">
							<button className="location-button" onClick={checkLocation}>
								Check Location
							</button>
						</div>
					</div>
				</>
			) : (
				<p>Quest not found</p>
			)}
		</div>
	);
};

export default QuestDetails;
