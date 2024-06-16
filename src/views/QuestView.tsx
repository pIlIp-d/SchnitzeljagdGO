import { useEffect, useRef, useState } from 'react';
import QuestDetails from '../QuestDetails';
import Map from '../map';
import { NodeElement, Quest, WayElement } from '../types';
import Dropdown from '../Dropdown';
import QuestGenerator from '../QuestGenerator';
import { fetchNodes, getCurrentLocation } from '../GeoJsonHelper';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import dbHelper from '../dbHelper';
import { MAX_DIST_TO_NODE } from '../config';

type QuestViewProps = {
	userId: string;
}

function QuestView({ userId }: QuestViewProps) {
	const firstRender = useRef(true);

	// TODO change to map with real quest ID -> add router + url to that questview 
	const [selectedQuestId, setSelectedQuestId] = useState<number | null>(null);
	// TODO limit amount of open quests + add extra tab for done quests or other point system to not load all quests every time
	const [quests, setQuests] = useState<Quest[]>([]);
	const [position, setPosition] = useState<[number, number]>();
	const [doneNodes, setDoneNodes] = useState<NodeElement[]>([]);

	function addQuest() {
		console.log(quests);
		QuestGenerator()
			.then(quest => {
				dbHelper.addNewQuest(userId, quest).then(docRef => {
					quest.id = docRef.id;
					setQuests(oldQuests => [...oldQuests, quest]);
				});
			})
			.catch(e => console.error(e));
	}

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			dbHelper.getQuests(userId).then(quests => {
				console.log(quests);
				setQuests(quests);
			}).then(() => {
				dbHelper.getDoneNodes(userId).then((nodes) => {
					setDoneNodes(nodes);
				})
			}); getCurrentLocation().then(pos => {
				setPosition(pos);
			});
		}
	}, [userId]);

	const addFoundNode = (node: NodeElement, way: WayElement, quest: Quest) => {
		setQuests((oldQuests) => {
			return oldQuests.map((q) => {
				if (quest.id && q.id === quest.id) {
					dbHelper.addFoundNode(userId, q.id, way.id, node).then((r) => {
						setDoneNodes(oldNodes => [...oldNodes, r]);
					});
				}
				return q;
			})
		});
	}

	const checkLocation = async () => {
		if (selectedQuestId !== null) {
			const quest = quests[selectedQuestId];
			const { nodes, ways } = await fetchNodes(quest.selector, MAX_DIST_TO_NODE);

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
		setSelectedQuestId(quests.indexOf(quest));
	}

	useEffect(() => {
		setQuests((oldQuests) => {
			return oldQuests.map(q => {
				q.doneNodes = doneNodes.filter(n => q.id === n.questID);
				return q;
			});
		});
	}, [doneNodes]);

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
		</Box>
	);
}

export default QuestView;
