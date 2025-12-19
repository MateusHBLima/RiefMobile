import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../constants/Colors';

interface QuickScaleProps {
    question?: string;
    value?: number | null;
    minLabel?: string;
    maxLabel?: string;
    onSelect: (value: number) => void;
}

export default function QuickScale({
    question,
    value,
    minLabel = 'baixo',
    maxLabel = 'alto',
    onSelect
}: QuickScaleProps) {
    const options = [1, 2, 3, 4, 5];

    return (
        <View style={styles.container}>
            {question && (
                <Text style={styles.question}>{question}</Text>
            )}

            <View style={styles.scaleContainer}>
                <View style={styles.scale}>
                    {options.map((num) => (
                        <Pressable
                            key={num}
                            style={[
                                styles.dot,
                                value === num && styles.dotSelected,
                            ]}
                            onPress={() => onSelect(num)}
                        >
                            <Text style={[
                                styles.dotText,
                                value === num && styles.dotTextSelected,
                            ]}>
                                {num}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.labels}>
                    <Text style={styles.label}>{minLabel}</Text>
                    <Text style={styles.label}>{maxLabel}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: spacing.lg,
    },
    question: {
        ...typography.subtitle,
        textAlign: 'center',
    },
    scaleContainer: {
        alignItems: 'center',
        gap: spacing.md,
    },
    scale: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    dot: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotSelected: {
        backgroundColor: colors.primary + '30',
        borderColor: colors.primary,
    },
    dotText: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textMuted,
    },
    dotTextSelected: {
        color: colors.primary,
    },
    labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: spacing.xs,
    },
    label: {
        ...typography.caption,
        color: colors.textDim,
    },
});
