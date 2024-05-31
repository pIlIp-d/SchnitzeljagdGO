import React from 'react';
import { NodeElement } from './types';

interface Quest {
	nodes: Array<NodeElement>;
	name: string;
	current: number;
	max: number;
}

export const QuestContext = React.createContext<Quest[]>([]);
