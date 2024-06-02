import { useEffect, useRef, useState } from 'react';
import QuestDetails from '../QuestDetails';
import Map from '../map';
import { NodeElement, Quest } from '../types';
import Dropdown from '../Dropdown';
import QuestGenerator from '../QuestGenerator';
import { fetchNodes, getCurrentLocation } from '../GeoJsonHelper';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

type QuestViewProps = {
}

function QuestView({ }: QuestViewProps) {
	const firstRender = useRef(true);
	const [selectedQuestId, setSelectedQuestId] = useState<number | null>(null);
	const [quests, setQuests] = useState<Quest[]>([]);
	const [position, setPosition] = useState<[number, number]>();


	function addQuest() {
		QuestGenerator()
			.then(quest => {
				setQuests(oldQuests => [...oldQuests, quest]);
			})
			.catch(e => console.error(e));
	}

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			addQuest();
			addQuest();
			getCurrentLocation().then(pos => {
				setPosition(pos);
			});
		}
	});
	const addFoundNode = (node: NodeElement, wayId: number, questSelector: string) => {
		setQuests((oldQuests) => {
			return oldQuests.map((q) => {
				if (q.selector === questSelector) {
					if (wayId)
						q.doneWays.push(wayId);
					q.doneNodes.push(node);
				}
				return q;
			})
		});
	}

	const checkLocation = async () => {
		if (selectedQuestId !== null) {
			const quest = quests[selectedQuestId];
			const { nodes, ways } = await fetchNodes(quest.selector, 1000);

			for (const node of nodes) {
				const wayOfNode = ways.filter(way => way.nodes.includes(node.id))[0];
				// if node has already been found or is part of already found way
				if (!quest.doneNodes.some(foundNode => foundNode.id === node.id)
					&& !quest.doneWays.some(foundWay => foundWay === wayOfNode.id)) {
					addFoundNode(node, wayOfNode?.id, quest.selector);
					break;
				}
			}
		} else {
			console.log('Quest not found');
		}
	};

	function setSelectedQuest(quest: Quest) {
		setSelectedQuestId(quests.indexOf(quest));
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
						<Map nodes={quests.flatMap(q => q.doneNodes)} position={position} />
					)
					: (
						<Map nodes={quests[selectedQuestId].doneNodes} position={position} />
					))}
			</Box>
		</Box>
	);
}

export default QuestView;
