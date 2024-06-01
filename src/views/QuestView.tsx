import { useEffect, useRef, useState } from 'react';
import QuestDetails from '../QuestDetails';
import Map from '../map';
import { NodeElement, Quest } from '../types';
import Dropdown from '../Dropdown';
import QuestGenerator from '../QuestGenerator';
import { fetchNodes, getCurrentLocation } from '../GeoJsonHelper';
import { Box } from '@mui/material';
import { Flare } from '@mui/icons-material';


type QuestViewProps = {
}

function QuestView({ }: QuestViewProps) {
	const firstRender = useRef(true);
	const [selectedQuestId, setSelectedQuestId] = useState<number | null>(null);
	const [quests, setQuests] = useState<Quest[]>([]);
	const [position, setPosition] = useState<[number, number]>();



	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			QuestGenerator()
				.then(quest => {
					console.log(quest);
					setQuests(oldQuests => [...oldQuests, quest]);
				})
				.catch(e => console.error(e));
			QuestGenerator()
				.then(quest => {
					console.log(quest);
					setQuests(oldQuests => [...oldQuests, quest]);
				})
				.catch(e => console.error(e));

			getCurrentLocation().then(pos => {
				setPosition(pos);
			});
		}
	});
	const addFoundNode = (node: NodeElement, wayId: number, questSelector: string) => {
		console.log("ADD");

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
			console.log(nodes, ways);

			for (const node of nodes) {
				const wayOfNode = ways.filter(way => way.nodes.includes(node.id))[0];
				console.log(wayOfNode);

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
		console.log(quest);
		console.log(
			quests.indexOf(quest)
		);
		setSelectedQuestId(quests.indexOf(quest));
	}

	return (
		<Box display={'flex'} flexDirection={'column'} minHeight={"100%"} height={"100%"}>
			<h2>
				SchnitzeljagdGO
			</h2>
			{
				selectedQuestId !== null ?
					<QuestDetails quest={quests[selectedQuestId]} checkLocation={checkLocation} />
					: <Dropdown quests={quests} selectQuest={setSelectedQuest} />
			}
			<Box width={"100%"} flex={1}>
				{position && quests && (
					<Map nodes={quests.flatMap(q => q.doneNodes)} position={position} />
				)}
			</Box>
		</Box>
	);
}

export default QuestView;
