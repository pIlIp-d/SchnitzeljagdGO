import { useEffect, useRef, useState } from 'react';
import QuestDetails from '../QuestDetails';
import Map from '../map';
import { NodeElement, Quest, WayElement } from '../types';
import Dropdown from '../Dropdown';
import QuestGenerator from '../QuestGenerator';
import { fetchNodes } from '../GeoJsonHelper';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import dbHelper from '../dbHelper';
import { MAX_DIST_TO_NODE } from '../config';
import LocationButton from '../LocationButton';

type QuestViewProps = {
	userId: string;
}

function QuestView({ userId }: QuestViewProps) {
	const firstRender = useRef(true);

	const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
	// TODO limit amount of open quests + add extra tab for done quests or other point system to not load all quests every time
	const [quests, setQuests] = useState<{ [key: string]: Quest }>({});
	const [position, setPosition] = useState<[number, number]>([0, 0]);
	const [doneNodes, setDoneNodes] = useState<NodeElement[]>([]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	function addQuest() {
		console.log(quests);
		// maybe reask for position

		loadLocation().then((pos) => {
			QuestGenerator(pos)
				.then(quest => {
					dbHelper.addNewQuest(userId, quest).then(docRef => {
						quest.id = docRef.id;
						setQuests(oldQuests => {
							oldQuests[docRef.id] = quest;
							return { ...oldQuests };
						});
					});
				})
				.catch(e => console.error(e));
		})
	}

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			loadLocation();
			dbHelper.getQuests(userId).then(quests => {
				setQuests(quests);
			}).then(() => {
				dbHelper.getDoneNodes(userId).then((nodes) => {
					setDoneNodes(nodes);
				})
			});
		}
	}, [userId]);

	const addFoundNode = (node: NodeElement, way: WayElement, quest: Quest) => {
		if (quest.id)
			dbHelper.addFoundNode(userId, quest.id, way.id, node).then((r) => {
				setDoneNodes(oldNodes => [...oldNodes, r]);
			});
	}

	const checkLocation = async () => {
		if (selectedQuestId !== null) {
			const quest = quests[selectedQuestId];
			const { nodes, ways } = await fetchNodes(quest.selector, position, MAX_DIST_TO_NODE);

			let success = false;
			for (const node of nodes) {
				const wayOfNode = ways.filter(way => way.nodes.includes(node.id))[0];
				// if node has already been found or is part of already found way
				if (wayOfNode && quest.doneNodes
					&& !quest.doneNodes.some(n => n.id === node.id || n.wayID == wayOfNode.id)) {
					addFoundNode(node, wayOfNode, quest);
					success = true;
					break;
				}
			}
			if (!success) {
				// TODO show message
				console.log("Not near a Node for this quest!");
			}

		} else {
			console.log('Quest not found');
		}
	};

	function setSelectedQuest(quest: Quest) {
		setSelectedQuestId(quest.id as string);
	}

	useEffect(() => {
		setQuests((oldQuests) => {
			Object.keys(oldQuests).forEach(key => {
				oldQuests[key].doneNodes = doneNodes.filter(n => n.questID === key);
			});
			return { ...oldQuests };
		});
	}, [doneNodes]);


	const getCurrentLocation = (): Promise<[number, number]> => {
		return new Promise((resolve, reject) => {
			if (navigator.geolocation)
				navigator.geolocation.getCurrentPosition(
					position => resolve([position.coords.latitude, position.coords.longitude]),
					reject
				);
			else reject('Geolocation is not supported by this browser.');
		});
	};

	const loadLocation = (): Promise<[number, number]> => {
		return new Promise((resolve) => {
			setLoading(true);
			setError(false);
			getCurrentLocation().then(pos => {
				setError(false);
				setLoading(false);
				setPosition(pos);
				resolve(pos);
			}).catch(() =>
				setError(true)
			);
		});
	}
	return (
		<Box display={"flex"} width={"100%"} height={"100%"} flexDirection={"column"}>
			<Typography variant="h2" component="div" >
				SchnitzeljagdGO
			</Typography>
			{selectedQuestId === null ? (
				<Dropdown quests={quests} selectQuest={setSelectedQuest} addQuest={addQuest} />
			) : (
				<Box display={"flex"} flexDirection={'row'}>
					<IconButton aria-label="back" onClick={() => setSelectedQuestId(null)} sx={{ height: "40px", width: "40px" }}>
						<ArrowBackIosIcon />
					</IconButton>
					<QuestDetails quest={quests[selectedQuestId]} checkLocation={checkLocation} />
				</Box>
			)}
			<Box flexGrow={1} width={"100%"}>
				{position && quests && (selectedQuestId === null ?
					(
						<Map nodes={doneNodes} position={position} />
					)
					: (
						<Map nodes={quests[selectedQuestId].doneNodes ?? []} position={position} />
					))}
			</Box>
			<LocationButton loadLocation={loadLocation} error={error} loading={loading} />
		</Box>
	);
}

export default QuestView;
