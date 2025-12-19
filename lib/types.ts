// ============================================
// RIEF MOBILE - TYPE DEFINITIONS
// Shared with web app (c:\Antigravity\Journaling)
// ============================================

// Tracker Types
export type TrackerType = 'BOOLEAN' | 'NUMBER' | 'SCALE' | 'CURRENCY' | 'REFACTOR';
export type TrackerNature = 'METRIC' | 'SIGNAL';
export type TrackerRhythm = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
export type ObjectiveStatus = 'PREPARATION' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

// Core Entities
export interface Area {
    id: string;
    name: string;
    order: number;
    objectives?: Objective[];
}

export interface Objective {
    id: string;
    areaId: string;
    title: string;
    status: ObjectiveStatus;
    isNorthStar: boolean;
    trackers?: Tracker[];
}

export interface Tracker {
    id: string;
    objectiveId: string;
    name: string;
    type: TrackerType;
    nature: TrackerNature;
    rhythm: TrackerRhythm;
    target?: number;
    unit?: string;
    minLabel?: string;
    maxLabel?: string;
    habitBad?: string;
    habitGood?: string;
    daysOfWeek?: string; // "0,1,3" for Sun, Mon, Wed
    dayOfMonth?: number;
    interval?: number;
    habitEnabled: boolean;
    indicatorEnabled: boolean;
}

export interface TrackerLog {
    id: string;
    trackerId: string;
    date: string;
    value: number;
}

export interface RichTrackerLog {
    id: string;
    logId: string;
    qualityRating?: number;
    contextNote?: string;
    feelingNote?: string;
}

// Day State (Consciousness Layer)
export interface DayState {
    id: string;
    date: string;
    label: string;
    emoji?: string;
    description?: string;
    affectedBlocks?: string[];
}

// Predefined Day States
export const PREDEFINED_DAY_STATES: Omit<DayState, 'id' | 'date'>[] = [
    { label: 'Jejum', emoji: '🕯️', description: 'Dia de abstinência intencional' },
    { label: 'Retiro', emoji: '🏕️', description: 'Tempo de recolhimento' },
    { label: 'Luto', emoji: '🖤', description: 'Espaço para a dor' },
    { label: 'Doença', emoji: '🤒', description: 'Corpo pedindo cuidado' },
    { label: 'Descanso', emoji: '🛌', description: 'Dia de recuperação' },
    { label: 'Foco Profundo', emoji: '🎯', description: 'Imersão total' },
    { label: 'Renovação', emoji: '🌿', description: 'Novo começo' },
];

// Routine (Context, not Goal)
export interface Routine {
    id: string;
    name: string;
    isActive: boolean;
    daysOfWeek?: string;
    blocks: RoutineBlock[];
}

export interface RoutineBlock {
    id: string;
    routineId: string;
    name: string;
    emoji?: string;
    startTime: string;
    endTime: string;
    areaId?: string;
    order: number;
}

// Reflection Prompts (for Day States)
export const REFLECTION_PROMPTS: Record<string, string> = {
    'Jejum': 'Como estou vivendo este jejum no meio das responsabilidades?',
    'Retiro': 'O que este tempo de recolhimento está revelando?',
    'Luto': 'O que preciso permitir-me sentir hoje?',
    'Doença': 'Como posso ser gentil comigo mesmo hoje?',
    'Descanso': 'O que significa descansar de verdade para mim?',
    'Foco Profundo': 'O que merece minha atenção plena hoje?',
    'Renovação': 'O que estou deixando para trás? O que estou abraçando?',
};
