import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TrackerCard from '@/components/TrackerCard';
import { colors, spacing, typography } from '@/constants/Colors';
import {
  getDayState,
  getLogsForDate,
  getTodayString,
  getTodayTrackersByArea,
} from '@/lib/storage';
import { DayState, REFLECTION_PROMPTS, Tracker, TrackersByArea } from '@/lib/types';

export default function TodayScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trackersByArea, setTrackersByArea] = useState<TrackersByArea[]>([]);
  const [logs, setLogs] = useState<Record<string, number>>({});
  const [dayState, setDayState] = useState<DayState | null>(null);

  const todayString = getTodayString();
  const todayFormatted = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  const loadData = useCallback(async () => {
    try {
      const [trackersData, logsData, stateData] = await Promise.all([
        getTodayTrackersByArea(todayString),
        getLogsForDate(todayString),
        getDayState(todayString),
      ]);

      setTrackersByArea(trackersData);
      setLogs(logsData);
      setDayState(stateData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [todayString]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleTrackerPress = (tracker: Tracker) => {
    router.push(`/respond/${tracker.id}`);
  };

  const handleDayStatePress = () => {
    router.push('/daystate');
  };

  // Get reflection prompt for current day state
  const reflectionPrompt = dayState
    ? REFLECTION_PROMPTS[dayState.label]
    : null;

  // Count totals
  const totalTrackers = trackersByArea.reduce((sum, area) => sum + area.trackers.length, 0);
  const completedTrackers = trackersByArea.reduce((sum, area) =>
    sum + area.trackers.filter(t => logs[t.id] !== undefined).length, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Date Header */}
        <View style={styles.header}>
          <Text style={styles.dateText}>{todayFormatted}</Text>
          {totalTrackers > 0 && (
            <Text style={styles.progressText}>
              {completedTrackers}/{totalTrackers} práticas
            </Text>
          )}
        </View>

        {/* Day State Banner */}
        <Pressable
          style={[styles.dayStateCard, dayState && styles.dayStateCardActive]}
          onPress={handleDayStatePress}
        >
          {dayState ? (
            <View style={styles.dayStateContent}>
              <Text style={styles.dayStateEmoji}>{dayState.emoji || '🌀'}</Text>
              <View style={styles.dayStateText}>
                <Text style={styles.dayStateLabel}>
                  Hoje: <Text style={styles.dayStateName}>{dayState.label}</Text>
                </Text>
                {reflectionPrompt && (
                  <Text style={styles.reflectionPrompt}>"{reflectionPrompt}"</Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.dayStateEmpty}>
              <Text style={styles.dayStateEmptyText}>
                Como está este dia?
              </Text>
              <Text style={styles.dayStateTap}>Toque para definir</Text>
            </View>
          )}
        </Pressable>

        {/* Trackers by Area */}
        {trackersByArea.length > 0 && (
          <View style={styles.areasContainer}>
            {trackersByArea.map((area) => (
              <View key={area.areaId} style={styles.areaSection}>
                <Text style={styles.areaTitle}>{area.areaName}</Text>
                <View style={styles.trackerList}>
                  {area.trackers.map((tracker) => (
                    <TrackerCard
                      key={tracker.id}
                      tracker={tracker}
                      value={logs[tracker.id]}
                      onPress={() => handleTrackerPress(tracker)}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!loading && trackersByArea.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyTitle}>Nenhuma prática para hoje</Text>
            <Text style={styles.emptySubtitle}>
              Configure suas práticas no app web para vê-las aqui.
            </Text>
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
  header: {
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    ...typography.title,
    fontSize: 24,
    textTransform: 'capitalize',
  },
  progressText: {
    fontSize: 14,
    color: colors.textMuted,
  },

  // Day State
  dayStateCard: {
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  dayStateCardActive: {
    borderColor: colors.primary + '40',
    backgroundColor: colors.primary + '08',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  dayStateContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  dayStateEmoji: {
    fontSize: 32,
  },
  dayStateText: {
    flex: 1,
    gap: spacing.xs,
  },
  dayStateLabel: {
    fontSize: 16,
    color: colors.text,
  },
  dayStateName: {
    color: colors.primary,
    fontWeight: '600',
  },
  reflectionPrompt: {
    fontSize: 14,
    color: colors.secondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  dayStateEmpty: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  dayStateEmptyText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  dayStateTap: {
    fontSize: 12,
    color: colors.textDim,
  },

  // Areas Container
  areasContainer: {
    gap: spacing.xl,
  },
  areaSection: {
    gap: spacing.md,
  },
  areaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  trackerList: {
    gap: spacing.sm,
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
  emptySubtitle: {
    ...typography.body,
    color: colors.textDim,
    textAlign: 'center',
  },
});
