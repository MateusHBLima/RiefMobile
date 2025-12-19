import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// ============================================
// NOTIFICATION SYSTEM
// Core experience for Rief - gentle prompts
// ============================================

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Notification Types
export type NotificationType = 'morning' | 'tracker' | 'midday' | 'evening' | 'daystate';

export interface ScheduledNotification {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    hour: number;
    minute: number;
    trackerId?: string;
}

// ============================================
// PERMISSION & SETUP
// ============================================

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    if (!Device.isDevice) {
        console.log('Must use physical device for notifications');
        return undefined;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Failed to get push token for notifications');
        return undefined;
    }

    // For local notifications only, we don't need a push token
    return 'local';
}

// ============================================
// NOTIFICATION CATEGORIES (Quick Actions)
// ============================================

export async function setupNotificationCategories() {
    // Boolean tracker category - respond with Sim/Não
    await Notifications.setNotificationCategoryAsync('boolean_tracker', [
        {
            identifier: 'yes',
            buttonTitle: 'Sim ✓',
            options: { opensAppToForeground: false },
        },
        {
            identifier: 'no',
            buttonTitle: 'Não',
            options: { opensAppToForeground: false },
        },
    ]);

    // Scale tracker category - quick 1-5
    await Notifications.setNotificationCategoryAsync('scale_tracker', [
        { identifier: '1', buttonTitle: '1', options: { opensAppToForeground: false } },
        { identifier: '2', buttonTitle: '2', options: { opensAppToForeground: false } },
        { identifier: '3', buttonTitle: '3', options: { opensAppToForeground: false } },
        { identifier: '4', buttonTitle: '4', options: { opensAppToForeground: false } },
        { identifier: '5', buttonTitle: '5', options: { opensAppToForeground: false } },
    ]);

    // Day state prompt
    await Notifications.setNotificationCategoryAsync('daystate_prompt', [
        {
            identifier: 'open',
            buttonTitle: 'Definir',
            options: { opensAppToForeground: true },
        },
    ]);
}

// ============================================
// SCHEDULING
// ============================================

export async function scheduleMorningNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Bom dia',
            body: 'Como você acorda hoje?',
            data: { type: 'daystate' },
            categoryIdentifier: 'daystate_prompt',
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 7,
            minute: 0,
        },
    });
}

export async function scheduleMiddayNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Pause',
            body: 'Como está seu coração agora?',
            data: { type: 'midday' },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 12,
            minute: 0,
        },
    });
}

export async function scheduleEveningNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Boa noite',
            body: 'Como foi o dia?',
            data: { type: 'evening' },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 21,
            minute: 0,
        },
    });
}

export async function scheduleTrackerNotification(
    trackerId: string,
    trackerName: string,
    trackerType: 'BOOLEAN' | 'SCALE',
    hour: number,
    minute: number
) {
    const category = trackerType === 'BOOLEAN' ? 'boolean_tracker' : 'scale_tracker';
    const body = trackerType === 'BOOLEAN'
        ? `${trackerName} hoje?`
        : `Como foi ${trackerName.toLowerCase()}?`;

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Pause',
            body,
            data: { type: 'tracker', trackerId },
            categoryIdentifier: category,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
        },
    });
}

// ============================================
// MANAGEMENT
// ============================================

export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledNotifications() {
    return Notifications.getAllScheduledNotificationsAsync();
}

// ============================================
// DEFAULT SCHEDULE
// ============================================

export async function setupDefaultNotifications() {
    // Cancel existing
    await cancelAllNotifications();

    // Set up categories
    await setupNotificationCategories();

    // Schedule daily prompts
    await scheduleMorningNotification();
    await scheduleMiddayNotification();
    await scheduleEveningNotification();

    console.log('Default notifications scheduled');
}
