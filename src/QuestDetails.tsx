import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QuestContext } from './QuestContext';
import { getCurrentLocation } from './GeoJsonHelper';
import { getDistance } from 'geolib'; // You need to install geolib: npm install geolib

const QuestDetails: React.FC = () => {
	let { name } = useParams<{ name: string }>();
	const quests = useContext(QuestContext);
	const [quest, setQuest] = useState(quests.find(quest => quest.name === name));

	useEffect(() => {
		setQuest(quests.find(quest => quest.name === name));
	}, [name, quests]);

	const checkLocation = async () => {
		const location = await getCurrentLocation();
		if (quest) {
			for (let index = 0; index < quest.nodes.length; index++) {
				const node = quest.nodes[index];
				const distance = getDistance(
					{ latitude: location[0], longitude: location[1] },
					{ latitude: node.lat, longitude: node.lon }
				);
				console.log(`lat ${node.lat}: lon ${node.lon}`);
				console.log(`Distance to node ${index}: ${distance} meters`);

				if (distance < 3) {
					setQuest({ ...quest, current: quest.current + 1 });
					break;
				}
			}
		} else {
			console.log('Quest not found');
		}
	};

	return (
		<div>
			{quest ? (
				<>
					<div className="questDetails-container">
						<h1>{quest.name}</h1>
						<div className="progress-container">
							<progress value={quest.current} max={quest.max} />
							<span className="progress-label">
								{quest.current}/{quest.max}
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
