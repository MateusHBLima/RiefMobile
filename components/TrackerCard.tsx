import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../constants/Colors';
import { Tracker } from '../lib/types';

interface TrackerCardProps {
    tracker: Tracker;
    value?: number | null;
    onPress: () => void;
}

export default function TrackerCard({ tracker, value, onPress }: TrackerCardProps) {
    const isCompleted = value !== undefined && value !== null;

    // Render value indicator based on tracker type
    const renderValue = () => {
        if (!isCompleted) {
            return <View style={styles.emptyIndicator} />;
        }

        if (tracker.type === 'BOOLEAN') {
            return (
                <View style={[styles.checkIndicator, value === 1 && styles.checkIndicatorDone]}>
                    <Text style={styles.checkText}>{value === 1 ? '✓' : '–'}</Text>
                </View>
            );
        }

        if (tracker.type === 'SCALE') {
            return (
                <View style={styles.scaleIndicator}>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <View
                            key={n}
                            style={[
                                styles.scaleDot,
                                n <= (value || 0) && styles.scaleDotFilled,
                            ]}
                        />
                    ))}
                </View>
            );
        }

        return (
            <Text style={styles.numberValue}>{value}</Text>
        );
    };

    return (
        <Pressable
            style={[styles.card, isCompleted && styles.cardCompleted]}
            onPress={onPress}
        >
            <View style={styles.content}>
                <Text style={styles.name}>{tracker.name}</Text>
                {tracker.description && (
                    <Text style={styles.description}>{tracker.description}</Text>
                )}
                {tracker.minLabel && tracker.maxLabel && (
                    <Text style={styles.hint}>
                        {tracker.minLabel} ↔ {tracker.maxLabel}
                    </Text>
                )}
            </View>

            {renderValue()}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardCompleted: {
        borderColor: colors.primary + '40',
        backgroundColor: colors.primary + '08',
    },
    content: {
        flex: 1,
        gap: spacing.xs,
    },
    name: {
        fontSize: 17,
        fontWeight: '500',
        color: colors.text,
    },
    description: {
        fontSize: 13,
        color: colors.textMuted,
        fontStyle: 'italic',
    },
    hint: {
        fontSize: 12,
        color: colors.textDim,
    },
    emptyIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
    },
    checkIndicator: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkIndicatorDone: {
        backgroundColor: colors.success + '20',
        borderColor: colors.success,
    },
    checkText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.success,
    },
    scaleIndicator: {
        flexDirection: 'row',
        gap: 4,
    },
    scaleDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.border,
    },
    scaleDotFilled: {
        backgroundColor: colors.primary,
    },
    numberValue: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primary,
    },
});
