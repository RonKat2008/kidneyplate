import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    return finalStatus;
  }
}
export async function setupNotifications() {
  const permissionStatus = await registerForPushNotificationsAsync();
  if (permissionStatus !== 'granted') {
    handleRegistrationError('Failed to get push token for push notification!');
  }
  else{
    await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Breakfast time!',
          body: "Make sure to record your meal!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 9,
          minute: 0,
        },
      });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lunch time!',
          body: "Make sure to record your meal!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 13,
          minute: 0,
        },
      });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Dinner time!',
          body: "Make sure to record your meal!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 19,
          minute: 0,
        },
      });
    }

  }




export default function App() {
 
}
