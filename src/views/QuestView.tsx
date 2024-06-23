import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Map from '../map';
import { NodeElement, Quest, QuestGroup, WayElement } from '../types';
import QuestGenerator from '../QuestGenerator';
import { fetchNodes } from '../GeoJsonHelper';
import { Box, IconButton, Snackbar } from '@mui/material';
import dbHelper from '../dbHelper';
import { MAX_DIST_TO_NODE } from '../config';
import LocationButton from '../LocationButton';
import QuestListButton from '../QuestListButton';
import QuestDetails from '../QuestDetails';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';

type QuestViewProps = {
	userId: string;
}

function QuestView({ userId }: QuestViewProps) {
	const { questId } = useParams();
	const navigate = useNavigate();

	const firstRender = useRef(true);

	// TODO limit amount of open quests + add extra tab for done quests or other point system to not load all quests every time
	const [quests, setQuests] = useState<{ [key: string]: Quest }>({});
	const [position, setPosition] = useState<[number, number]>([0, 0]);
	const [doneNodes, setDoneNodes] = useState<NodeElement[]>([]);

	const [loading, setLoading] = useState(false);
	const [loadingForQuestCheck, setLoadingForQuestCheck] = useState(false);
	const [error, setError] = useState(false);
	const [questLoadingError, setQuestLoadingError] = useState(false);

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

	const addQuest = useCallback((group: QuestGroup = QuestGroup.Random) => {
		loadLocation().then((pos) => {
			setQuestLoadingError(false);
			QuestGenerator(pos, Object.values(quests), group)
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
	}, [quests, userId, loadLocation]);

	const removeQuest = useCallback((questID: string) => {
		if (questID) {
			dbHelper.removeQuest(userId, questID).then((doneNodes) => {
				setDoneNodes(doneNodes);
				if (questId == questID)
					navigate("/");
				setQuests((oldQuests) => {
					delete oldQuests[questID];
					return structuredClone(oldQuests);
				})
			}).then(() => {

			});
		}
	}, [navigate, questId, userId]);


	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			loadLocation();
			dbHelper.getQuests(userId).then(quests => {
				let foundDailyQuest = false;
				for (const q in quests) {
					if (quests[q].group === QuestGroup.Daily) {
						foundDailyQuest = true;
						if (new Date(quests[q].startDate).toLocaleDateString() !== new Date().toLocaleDateString()) {
							foundDailyQuest = false;
							// if quest from yesterday isnt done yet remove it
							if (!quests[q].done)
								removeQuest(quests[q].id!);
						}
					}
				}
				if (!foundDailyQuest)
					addQuest(QuestGroup.Daily);
				setQuests(quests);
			}).then(() => {
				dbHelper.getDoneNodes(userId).then((nodes) => {
					setDoneNodes(nodes);
				})
			});
		}
	}, [userId, loadLocation, removeQuest, addQuest]);

	const addFoundNode = (node: NodeElement, way: WayElement, quest: Quest) => {
		dbHelper.addFoundNode(userId, quest.id!, way.id, node).then((r) => {
			setDoneNodes(oldNodes => [...oldNodes, r]);
		});
	}

	const checkLocation = async () => {
		//TODO sort by nearest
		if (questId) {
			setLoadingForQuestCheck(true);
			const quest = quests[questId];
			const { nodes, ways } = await fetchNodes(quest.selector, position, MAX_DIST_TO_NODE);

			let success = false;
			for (const node of nodes) {
				const wayOfNode = ways.filter(way => way.nodes.includes(node.id))[0];
				// if node hasn't been found already and is not part of already found way
				if (wayOfNode && (!quest.doneNodes
					|| !quest.doneNodes.some(n => n.id === node.id || n.wayID == wayOfNode.id))) {
					addFoundNode(node, wayOfNode, quest);
					success = true;
					break;
				}
			}
			if (!success) {
				setNoQuestNearYouOpen(true);
			}
			setLoadingForQuestCheck(false);
		} else {
			console.log('Quest not found');
		}
	};

	function setSelectedQuest(quest: Quest) {
		navigate("/quest/" + quest.id as string);
	}

	useEffect(() => {
		setQuests((oldQuests) => {
			Object.keys(oldQuests).forEach(key => {
				const nodes = doneNodes.filter(n => n.questID === key);
				oldQuests[key].doneNodes = nodes;
				oldQuests[key].done = oldQuests[key].max <= nodes.length;
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
				{position && quests && (!questId || !(questId in quests) ?
					(
						<Map nodes={doneNodes} quests={quests} position={position} />
					)
					: (
						<Map nodes={quests[questId].doneNodes ?? []} quests={quests} position={position} />
					))}
			</Box>

			{questId && questId in quests && (
				<QuestDetails quest={quests[questId]} checkLocation={checkLocation} onBackClick={() => navigate("/")} loading={loadingForQuestCheck} />
			)}

			<QuestListButton quests={quests} selectQuest={setSelectedQuest} addQuest={addQuest} removeQuest={removeQuest} error={questLoadingError} />
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
