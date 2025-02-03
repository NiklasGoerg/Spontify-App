import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabaseClient";

// Hole eine zufällige Challenge basierend auf den Präferenzen, Standort und aktueller Zeit
export const getRandomChallenge = async (preferences: string[]) => {
  console.log("Filter für Präferenzen:", preferences);

  // Hole die Challenge-Einstellungen des Nutzers
  const user = await supabase.auth.getUser();
  if (!user?.data?.user?.id) {
    console.error("Benutzer nicht angemeldet.");
    return null;
  }

  // Hole die Präferenzen und den Standort des Nutzers
  const { data: preferencesData, error: preferencesError } = await supabase
    .from("challenge_preferences")
    .select("preferences, location")
    .eq("user_id", user.data.user.id)
    .single();

  if (preferencesError) {
    console.error("Fehler beim Abrufen der Benutzerpräferenzen:", preferencesError.message);
    return null;
  }

  if (!preferencesData) {
    console.warn("Keine Präferenzen gefunden.");
    return null;
  }

  const userLocation = preferencesData.location || "überall";
  console.log("Benutzerpräferenzen:", preferencesData);

  // Aktuelle Uhrzeit abrufen
  const currentTime = new Date();
  const currentHours = String(currentTime.getHours()).padStart(2, "0");
  const currentMinutes = String(currentTime.getMinutes()).padStart(2, "0");
  const currentTimeString = `${currentHours}:${currentMinutes}`;

  console.log("Aktuelle Zeit:", currentTimeString);

  // Challenges aus der Datenbank holen, gefiltert nach Präferenzen & Ort
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .in("type", preferences)
    .or(`location.eq.${userLocation},location.eq.überall`);

  if (error) {
    console.error("Fehler beim Abrufen der Challenge:", error.message);
    return null;
  }

  console.log("Gefundene Challenges vor Zeitfilter:", data);

  // Zeitfilter: Nur Challenges, die in die aktuelle Zeitspanne passen
  const filteredChallenges = data.filter((challenge) => {
    if (!challenge.time) return true; // Falls keine Zeit definiert ist, ist sie immer gültig

    const [startTime, endTime] = challenge.time.split("-");
    return startTime <= currentTimeString && currentTimeString <= endTime;
  });

  console.log("Gefundene Challenges nach Zeitfilter:", filteredChallenges);

  if (filteredChallenges.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredChallenges.length);
    return filteredChallenges[randomIndex];
  }

  console.warn("Keine passende Challenge gefunden.");
  return null;
};
