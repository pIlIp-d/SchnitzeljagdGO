import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { NodeElement, Quest } from "./types";

export default {
    addFoundNode(userId: string, questID: string, wayID: number, node: NodeElement) {
        const filteredNode = { id: node.id, lat: node.lat, lon: node.lon, type: node.type, questID: questID, wayID: wayID };
        return getDoc(doc(db, `users/${userId}`)).then(((snapshot) => {
            if (snapshot.exists()) {
                updateDoc(doc(db, `users/${userId}`), {
                    ["doneNodes"]: arrayUnion(filteredNode)
                });
            } else
                setDoc(doc(db, `users/${userId}`), {
                    ["doneNodes"]: arrayUnion(filteredNode)
                });
            return filteredNode;
        }));
    },
    getDoneNodes(userId: string): Promise<NodeElement[]> {
        return getDoc(doc(db, `users/${userId}`)).then(((snapshot) => {
            if (snapshot.exists() && snapshot.data().doneNodes) {
                return snapshot.data().doneNodes as NodeElement[];
            } else
                return [];
        }));
    },
    addNewQuest(userId: string, quest: Quest) {
        return addDoc(collection(db, `users/${userId}/quests`), quest);
    },
    async getQuests(userId: string) {
        const snapshot = await getDocs(collection(db, `users/${userId}/quests`));
        return snapshot.docs.map((d) => {
            return { ...d.data() as Quest, id: d.id };
        });
    }
}