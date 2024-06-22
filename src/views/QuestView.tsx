import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Map from '../map';
import { NodeElement, Quest, WayElement } from '../types';
import QuestGenerator from '../QuestGenerator';
import { fetchNodes } from '../GeoJsonHelper';
import { Box, IconButton, Snackbar } from '@mui/material';
import dbHelper from '../dbHelper';
import { MAX_DIST_TO_NODE } from '../config';
import LocationButton from '../LocationButton';
import QuestListButton from '../QuestListButton';
import QuestDetails from '../QuestDetails';
import CloseIcon from '@mui/icons-material/Close';

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
	const [questLoadingError, setQuestLoadingError] = useState(false);

	function addQuest() {
		loadLocation().then((pos) => {
			setQuestLoadingError(false);
			QuestGenerator(pos, Object.values(quests))
				.then(quest => {
					dbHelper.addNewQuest(userId, quest).then(docRef => {
						quest.id = docRef.id;
						setQuests(oldQuests => {
							oldQuests[docRef.id] = quest;
							return { ...oldQuests };
						});
					});
				})
				.catch(() => {
					setQuestLoadingError(true);
				});
		})
	}


	const loadLocation = useCallback((): Promise<[number, number]> => {
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
	}, []);
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
	}, [userId, loadLocation]);

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
				setNoQuestNearYouOpen(true);
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

	const [noQuestNearYouOpen, setNoQuestNearYouOpen] = useState(false);
	const noQuestNearYouAction = (
		<Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={() => setNoQuestNearYouOpen(false)}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</Fragment>
	);

	return (
		<Box display={"flex"} width={"100%"} height={"100%"} flexDirection={"column"}>
			<Box flexGrow={1} width={"100%"} height={"100%"}>
				{position && quests && (selectedQuestId === null ?
					(
						<Map nodes={doneNodes} quests={quests} position={position} />
					)
					: (
						<Map nodes={quests[selectedQuestId].doneNodes ?? []} quests={quests} position={position} />
					))}
			</Box>

			{selectedQuestId !== null && (
				<QuestDetails quest={quests[selectedQuestId]} checkLocation={checkLocation} onBackClick={() => setSelectedQuestId(null)} />
			)}

			<QuestListButton quests={quests} selectQuest={setSelectedQuest} addQuest={addQuest} error={questLoadingError} />
			<LocationButton loadLocation={loadLocation} error={error} loading={loading} />
			<Snackbar
				open={noQuestNearYouOpen}
				autoHideDuration={5000}
				onClose={() => setNoQuestNearYouOpen(false)}
				message="Not near a Node for this quest!"
				action={noQuestNearYouAction}
			/>
		</Box>
	);
}

export default QuestView;
