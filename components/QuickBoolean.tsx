import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../constants/Colors';

interface QuickBooleanProps {
    question?: string;
    value?: boolean | null;
    onSelect: (value: boolean) => void;
}

export default function QuickBoolean({ question, value, onSelect }: QuickBooleanProps) {
    return (
        <View style={styles.container}>
            {question && (
                <Text style={styles.question}>{question}</Text>
            )}

            <View style={styles.buttons}>
                <Pressable
                    style={[
                        styles.button,
                        value === true && styles.buttonSelectedYes,
                    ]}
                    onPress={() => onSelect(true)}
                >
                    <Text style={[
                        styles.buttonText,
                        value === true && styles.buttonTextSelected,
                    ]}>
                        Sim
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.button,
                        value === false && styles.buttonSelectedNo,
                    ]}
                    onPress={() => onSelect(false)}
                >
                    <Text style={[
                        styles.buttonText,
                        value === false && styles.buttonTextSelected,
                    ]}>
                        Não
                    </Text>
                </Pressable>
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
    buttons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    button: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xxl,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        minWidth: 120,
        alignItems: 'center',
    },
    buttonSelectedYes: {
        backgroundColor: colors.success + '20',
        borderColor: colors.success,
    },
    buttonSelectedNo: {
        backgroundColor: colors.textDim + '20',
        borderColor: colors.textDim,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textMuted,
    },
    buttonTextSelected: {
        color: colors.text,
    },
});
