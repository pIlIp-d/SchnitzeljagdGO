import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import { NodeElement, Quest } from './types';

export default {
	addFoundNode(userId: string, questID: string, wayID: number, node: NodeElement) {
		const filteredNode = { id: node.id, lat: node.lat, lon: node.lon, type: node.type, questID: questID, wayID: wayID };
		return getDoc(doc(db, `users/${userId}`)).then(snapshot => {
			if (snapshot.exists()) {
				updateDoc(doc(db, `users/${userId}`), {
					['doneNodes']: arrayUnion(filteredNode),
				});
			} else
				setDoc(doc(db, `users/${userId}`), {
					['doneNodes']: arrayUnion(filteredNode),
				});
			return filteredNode;
		});
	},
	getDoneNodes(userId: string): Promise<NodeElement[]> {
		return getDoc(doc(db, `users/${userId}`)).then(snapshot => {
			if (snapshot.exists() && snapshot.data().doneNodes) {
				return snapshot.data().doneNodes as NodeElement[];
			} else return [];
		});
	},
	addNewQuest(userId: string, quest: Quest) {
		return addDoc(collection(db, `users/${userId}/quests`), quest);
	},
	removeQuest(userId: string, questID: string): Promise<NodeElement[]> {
		return new Promise((resolve, reject) => {
			// remove nodes
			let newDoneNodes: NodeElement[] = [];
			getDoc(doc(db, `users/${userId}`))
				.then(snapshot => {
					if (snapshot.exists()) {
						newDoneNodes = (snapshot.data()['doneNodes'] as NodeElement[]).filter(node => node.questID !== questID);
						updateDoc(doc(db, `users/${userId}`), {
							['doneNodes']: newDoneNodes,
						}).catch(reject);
					}
				})
				.then(() => {
					// remove quest
					deleteDoc(doc(db, `users/${userId}/quests/${questID}`)).then(() => {
						resolve(newDoneNodes);
					});
				})
				.catch(reject);
		});
	},
	async getQuests(userId: string) {
		const snapshot = await getDocs(collection(db, `users/${userId}/quests`));
		const questList = snapshot.docs.map(d => {
			return { ...(d.data() as Quest), id: d.id };
		});
		// list -> map
		const questMap: { [key: string]: Quest } = {};
		for (const quest of questList) {
			questMap[quest.id as string] = quest;
		}
		return questMap;
	},
};
