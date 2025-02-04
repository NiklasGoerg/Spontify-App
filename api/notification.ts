import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Berechtigungen anfragen
export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// Zufällige Zeit zwischen 07:00 und 22:00 Uhr berechnen
function getRandomNotificationTime() {
  const minHour = 7;
  const maxHour = 22;
  const randomHour =
    Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
  const randomMinute = Math.floor(Math.random() * 60);

  const now = new Date();
  now.setHours(randomHour, randomMinute, 0, 0);

  return now;
}

// Notification planen
export async function scheduleDailyNotification() {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  // Prüfen, ob für heute bereits eine Notification existiert
  const lastScheduledDate = await AsyncStorage.getItem("lastNotificationDate");
  const today = new Date().toDateString();

  if (lastScheduledDate === today) {
    console.log("Benachrichtigung für heute bereits geplant.");
    return;
  }

  const triggerTime = getRandomNotificationTime();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Neue Challenge 🔥",
      body: "Tippe hier, um deine heutige Challenge anzusehen!",
    },
    trigger: { date: triggerTime },
  });

  console.log(
    `Benachrichtigung für ${triggerTime.toLocaleTimeString()} geplant.`,
  );
  await AsyncStorage.setItem("lastNotificationDate", today);
}
