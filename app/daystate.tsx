import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { colors, spacing, typography } from '@/constants/Colors';
import { getTodayString, PREDEFINED_DAY_STATES, setDayState } from '@/lib/storage';

export default function DayStateScreen() {
    const router = useRouter();
    const [customMode, setCustomMode] = useState(false);
    const [customLabel, setCustomLabel] = useState('');
    const [customEmoji, setCustomEmoji] = useState('✨');

    const handleSelectState = async (label: string, emoji?: string, description?: string) => {
        await setDayState(getTodayString(), label, emoji, description);
        router.back();
    };

    const handleCustomSubmit = async () => {
        if (!customLabel.trim()) return;
        await handleSelectState(customLabel.trim(), customEmoji);
    };

    const handleClose = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Close Button */}
            <Pressable style={styles.closeButton} onPress={handleClose}>
                <FontAwesome name="times" size={24} color={colors.textMuted} />
            </Pressable>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Como está este dia?</Text>
                <Text style={styles.subtitle}>
                    Isso não muda sua rotina. Muda sua postura.
                </Text>

                {!customMode ? (
                    <>
                        {/* Predefined States */}
                        <View style={styles.stateGrid}>
                            {PREDEFINED_DAY_STATES.map((state) => (
                                <Pressable
                                    key={state.label}
                                    style={styles.stateCard}
                                    onPress={() => handleSelectState(state.label, state.emoji, state.description)}
                                >
                                    <Text style={styles.stateEmoji}>{state.emoji}</Text>
                                    <Text style={styles.stateLabel}>{state.label}</Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* Custom Option */}
                        <Pressable
                            style={styles.customButton}
                            onPress={() => setCustomMode(true)}
                        >
                            <Text style={styles.customButtonText}>
                                + Criar estado personalizado
                            </Text>
                        </Pressable>
                    </>
                ) : (
                    /* Custom State Form */
                    <View style={styles.customForm}>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.emojiInput}
                                value={customEmoji}
                                onChangeText={setCustomEmoji}
                                placeholder="🌟"
                                placeholderTextColor={colors.textDim}
                                maxLength={2}
                            />
                            <TextInput
                                style={styles.labelInput}
                                value={customLabel}
                                onChangeText={setCustomLabel}
                                placeholder="Nome do estado..."
                                placeholderTextColor={colors.textDim}
                                autoFocus
                            />
                        </View>

                        <View style={styles.buttonRow}>
                            <Pressable
                                style={styles.submitButton}
                                onPress={handleCustomSubmit}
                            >
                                <Text style={styles.submitButtonText}>Aplicar</Text>
                            </Pressable>
                            <Pressable
                                style={styles.backButton}
                                onPress={() => setCustomMode(false)}
                            >
                                <Text style={styles.backButtonText}>Voltar</Text>
                            </Pressable>
                        </View>
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
    closeButton: {
        position: 'absolute',
        top: spacing.xl,
        right: spacing.lg,
        zIndex: 10,
        padding: spacing.sm,
    },
    content: {
        padding: spacing.xl,
        paddingTop: spacing.xxl * 2,
    },
    title: {
        ...typography.title,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body,
        color: colors.textMuted,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },

    // State Grid
    stateGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        justifyContent: 'center',
    },
    stateCard: {
        width: '45%',
        padding: spacing.lg,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        gap: spacing.sm,
    },
    stateEmoji: {
        fontSize: 36,
    },
    stateLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.text,
    },

    // Custom Button
    customButton: {
        marginTop: spacing.xl,
        padding: spacing.md,
        alignItems: 'center',
    },
    customButtonText: {
        color: colors.primary,
        fontSize: 15,
    },

    // Custom Form
    customForm: {
        gap: spacing.lg,
    },
    inputRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    emojiInput: {
        width: 60,
        height: 50,
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        textAlign: 'center',
        fontSize: 24,
        color: colors.text,
    },
    labelInput: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        fontSize: 16,
        color: colors.text,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    submitButton: {
        flex: 1,
        padding: spacing.md,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    submitButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        padding: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 12,
        backgroundColor: colors.surface,
        alignItems: 'center',
    },
    backButtonText: {
        color: colors.textMuted,
        fontSize: 16,
    },
});
