import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import QuickBoolean from '@/components/QuickBoolean';
import QuickScale from '@/components/QuickScale';
import { colors, spacing, typography } from '@/constants/Colors';
import { getTodayString, saveLog } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { Tracker } from '@/lib/types';

export default function RespondScreen() {
    const { trackerId } = useLocalSearchParams<{ trackerId: string }>();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tracker, setTracker] = useState<Tracker | null>(null);
    const [value, setValue] = useState<number | null>(null);

    useEffect(() => {
        loadTracker();
    }, [trackerId]);

    const loadTracker = async () => {
        if (!trackerId) return;

        try {
            const { data, error } = await supabase
                .from('Tracker')
                .select('*')
                .eq('id', trackerId)
                .single();

            if (data) {
                setTracker(data as Tracker);
            }
        } catch (error) {
            console.error('Error loading tracker:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = async (newValue: number | boolean) => {
        const numValue = typeof newValue === 'boolean' ? (newValue ? 1 : 0) : newValue;
        setValue(numValue);

        // Auto-save
        setSaving(true);
        try {
            await saveLog(trackerId!, getTodayString(), numValue);

            // Close after brief delay to show selection
            setTimeout(() => {
                router.back();
            }, 300);
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        router.back();
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    if (!tracker) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Tracker não encontrado</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Close Button */}
            <Pressable style={styles.closeButton} onPress={handleClose}>
                <FontAwesome name="times" size={24} color={colors.textMuted} />
            </Pressable>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.trackerName}>{tracker.name}</Text>

                <View style={styles.inputContainer}>
                    {tracker.type === 'BOOLEAN' && (
                        <QuickBoolean
                            question="Você fez hoje?"
                            value={value === null ? null : value === 1}
                            onSelect={(v) => handleSelect(v)}
                        />
                    )}

                    {tracker.type === 'SCALE' && (
                        <QuickScale
                            question="Como foi?"
                            value={value}
                            minLabel={tracker.minLabel || 'baixo'}
                            maxLabel={tracker.maxLabel || 'alto'}
                            onSelect={(v) => handleSelect(v)}
                        />
                    )}

                    {tracker.type === 'NUMBER' && (
                        <View style={styles.numberInput}>
                            <Text style={styles.placeholder}>
                                Entrada numérica (em desenvolvimento)
                            </Text>
                        </View>
                    )}
                </View>

                {saving && (
                    <View style={styles.savingIndicator}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={styles.savingText}>Salvando...</Text>
                    </View>
                )}
            </View>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    trackerName: {
        ...typography.title,
        textAlign: 'center',
        marginBottom: spacing.xxl,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },
    numberInput: {
        padding: spacing.xl,
    },
    placeholder: {
        color: colors.textDim,
        textAlign: 'center',
    },
    savingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.xl,
    },
    savingText: {
        color: colors.textMuted,
        fontSize: 14,
    },
    errorText: {
        color: colors.error,
        fontSize: 16,
        textAlign: 'center',
    },
});
