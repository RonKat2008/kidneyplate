import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function setupNotifications() {
  // 1. Ask for permissions first
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status !== 'granted') {
    console.log('Notification permissions denied');
    return;
  }

  // 2. Only schedule if permissions granted
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Look at that notification',
      body: "I'm so proud of myself!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 10,
      minute: 0,
    },
  });
}