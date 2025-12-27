import { format, parseISO } from 'date-fns';
import { getCurrentUserId, supabase } from './supabase';
import {
    Area,
    DayState, PREDEFINED_DAY_STATES,
    Tracker,
    TrackersByArea
} from './types';

// ============================================
// STORAGE API
// Reuses Supabase tables from web app
// ============================================

// ============================================
// STRUCTURE (Areas, Objectives, Trackers)
// ============================================

export async function getStructure(): Promise<Area[]> {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    const { data, error } = await supabase
        .from('Area')
        .select(`
      *,
      objectives:Objective(
        *,
        trackers:Tracker(*)
      )
    `)
        .eq('userId', userId)
        .order('order', { ascending: true });

    if (error) {
        console.error('Error fetching structure:', error);
        return [];
    }

    return data || [];
}

// ============================================
// TRACKERS FOR TODAY
// ============================================

export async function getTodayTrackers(dateString: string): Promise<Tracker[]> {
    const grouped = await getTodayTrackersByArea(dateString);
    return grouped.flatMap(g => g.trackers);
}

export async function getTodayTrackersByArea(dateString: string): Promise<TrackersByArea[]> {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    // Get all active trackers with area info
    const { data: areas, error } = await supabase
        .from('Area')
        .select(`
            id,
            name,
            objectives:Objective!inner(
                trackers:Tracker(*)
            )
        `)
        .eq('userId', userId)
        .eq('objectives.status', 'ACTIVE')
        .order('order', { ascending: true });

    if (error || !areas) return [];

    // Filter by rhythm and group by area
    const today = parseISO(dateString);
    const dayOfWeek = today.getDay();
    const dayOfMonth = today.getDate();

    const result: TrackersByArea[] = [];

    areas.forEach((area: any) => {
        const areaTrackers: Tracker[] = [];

        area.objectives?.forEach((obj: any) => {
            obj.trackers?.forEach((tracker: any) => {
                const shouldShow = shouldShowTrackerToday(tracker, dayOfWeek, dayOfMonth);
                if (shouldShow) {
                    areaTrackers.push(tracker);
                }
            });
        });

        if (areaTrackers.length > 0) {
            result.push({
                areaId: area.id,
                areaName: area.name,
                trackers: areaTrackers
            });
        }
    });

    return result;
}

function shouldShowTrackerToday(tracker: Tracker, dayOfWeek: number, dayOfMonth: number): boolean {
    const rhythm = tracker.rhythm || 'DAILY';

    switch (rhythm) {
        case 'DAILY':
            return true;
        case 'WEEKLY':
            if (!tracker.daysOfWeek) return true;
            return tracker.daysOfWeek.split(',').includes(dayOfWeek.toString());
        case 'MONTHLY':
            if (!tracker.dayOfMonth) return true;
            return dayOfMonth === tracker.dayOfMonth;
        case 'CUSTOM':
            // TODO: Implement interval-based logic
            return true;
        default:
            return true;
    }
}

// ============================================
// TRACKER LOGS
// ============================================

export async function getLogsForDate(dateString: string): Promise<Record<string, number>> {
    const userId = await getCurrentUserId();
    if (!userId) return {};

    const { data, error } = await supabase
        .from('DailyLog')
        .select('trackerId, value')
        .eq('date', dateString);

    if (error || !data) return {};

    const logs: Record<string, number> = {};
    data.forEach((log: any) => {
        logs[log.trackerId] = log.value;
    });

    return logs;
}

export async function saveLog(
    trackerId: string,
    dateString: string,
    value: number
): Promise<boolean> {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    // Upsert log
    const { error } = await supabase
        .from('DailyLog')
        .upsert({
            trackerId,
            date: dateString,
            value,
            updatedAt: new Date().toISOString(),
        }, {
            onConflict: 'trackerId,date',
        });

    if (error) {
        console.error('Error saving log:', error);
        return false;
    }

    return true;
}

// ============================================
// DAY STATE
// ============================================

export async function getDayState(dateString: string): Promise<DayState | null> {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data, error } = await supabase
        .from('DayState')
        .select('*')
        .eq('userId', userId)
        .eq('date', dateString)
        .single();

    if (error || !data) return null;

    return {
        id: data.id,
        date: data.date,
        label: data.label,
        emoji: data.emoji,
        description: data.description,
        affectedBlocks: data.affectedBlocks?.split(',').filter(Boolean) || [],
    };
}

export async function setDayState(
    dateString: string,
    label: string,
    emoji?: string,
    description?: string
): Promise<DayState | null> {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const payload = {
        userId,
        date: dateString,
        label,
        emoji: emoji || null,
        description: description || null,
        updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('DayState')
        .upsert(payload, { onConflict: 'userId,date' })
        .select()
        .single();

    if (error) {
        console.error('Error setting day state:', error);
        return null;
    }

    return {
        id: data.id,
        date: data.date,
        label: data.label,
        emoji: data.emoji,
        description: data.description,
    };
}

export async function removeDayState(dateString: string): Promise<boolean> {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
        .from('DayState')
        .delete()
        .eq('userId', userId)
        .eq('date', dateString);

    return !error;
}

// ============================================
// HELPERS
// ============================================

export function getTodayString(): string {
    return format(new Date(), 'yyyy-MM-dd');
}

export { PREDEFINED_DAY_STATES };

