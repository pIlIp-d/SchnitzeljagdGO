import React from 'react';
import { Quest } from './types';

export const QuestContext = React.createContext<Quest[]>([]);
