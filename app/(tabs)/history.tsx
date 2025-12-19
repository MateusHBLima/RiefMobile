import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { colors, spacing, typography } from '@/constants/Colors';
import { getDayState, getLogsForDate } from '@/lib/storage';
import { DayState } from '@/lib/types';

interface DayEntry {
    dateString: string;
    dateFormatted: string;
    dayState: DayState | null;
    completedCount: number;
    totalCount: number;
}

export default function HistoryScreen() {
    const [days, setDays] = useState<DayEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const entries: DayEntry[] = [];
            const today = new Date();

            // Load last 7 days
            for (let i = 0; i < 7; i++) {
                const date = subDays(today, i);
                const dateString = format(date, 'yyyy-MM-dd');
                const dateFormatted = i === 0
                    ? 'Hoje'
                    : i === 1
                        ? 'Ontem'
                        : format(date, "EEEE, d", { locale: ptBR });

                const [dayState, logs] = await Promise.all([
                    getDayState(dateString),
                    getLogsForDate(dateString),
                ]);

                const completedCount = Object.keys(logs).length;

                entries.push({
                    dateString,
                    dateFormatted,
                    dayState,
                    completedCount,
                    totalCount: 0, // TODO: Get total trackers for day
                });
            }

            setDays(entries);
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Histórico</Text>

                {days.map((day) => (
                    <View key={day.dateString} style={styles.dayCard}>
                        <View style={styles.dayHeader}>
                            <Text style={styles.dayDate}>{day.dateFormatted}</Text>
                            {day.completedCount > 0 && (
                                <Text style={styles.dayCount}>
                                    {day.completedCount} registros
                                </Text>
                            )}
                        </View>

                        {day.dayState && (
                            <View style={styles.dayStateRow}>
                                <Text style={styles.dayStateEmoji}>{day.dayState.emoji}</Text>
                                <Text style={styles.dayStateLabel}>{day.dayState.label}</Text>
                            </View>
                        )}

                        {!day.dayState && day.completedCount === 0 && (
                            <Text style={styles.emptyDay}>Nenhum registro</Text>
                        )}
                    </View>
                ))}

                {!loading && days.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>📅</Text>
                        <Text style={styles.emptyTitle}>Sem histórico ainda</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    content: {
        padding: spacing.lg,
        paddingTop: spacing.xl,
    },
    title: {
        ...typography.title,
        marginBottom: spacing.lg,
    },

    // Day Cards
    dayCard: {
        padding: spacing.lg,
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dayDate: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        textTransform: 'capitalize',
    },
    dayCount: {
        fontSize: 12,
        color: colors.textMuted,
    },
    dayStateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    dayStateEmoji: {
        fontSize: 20,
    },
    dayStateLabel: {
        fontSize: 14,
        color: colors.primary,
    },
    emptyDay: {
        fontSize: 13,
        color: colors.textDim,
        marginTop: spacing.sm,
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.xxl,
        gap: spacing.md,
    },
    emptyEmoji: {
        fontSize: 48,
    },
    emptyTitle: {
        ...typography.subtitle,
        color: colors.textMuted,
    },
});
