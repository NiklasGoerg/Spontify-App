import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabaseClient";

// Hole eine zufällige Challenge basierend auf den Präferenzen
export const getRandomChallenge = async (preferences: string[]) => {
  console.log("Filter für Präferenzen:", preferences); // Debug-Log

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .in("type", preferences); // Filtere nach Präferenzen

  console.log("Data Test: ", data);

  if (error) {
    console.error("Fehler beim Abrufen der Challenge:", error.message);
    return null;
  }

  console.log("Gefundene Challenges:", data); // Debug-Log

  if (data && data.length > 0) {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  }

  console.warn("Keine Challenges gefunden.");
  return null;
};

export const fetchChallenges = async () => {
  const { data, error } = await supabase.from("challenges").select("*");

  if (error) {
    console.error("Fehler beim Abrufen der Challenges:", error.message);
    return [];
  }

  console.log("Challenges erfolgreich abgerufen:", data);
  return data || [];
};

export const saveChallengesOnDevice = async (challenges: any[]) => {
  try {
    const jsonData = JSON.stringify(challenges);
    await AsyncStorage.setItem("challenges", jsonData);
    console.log("challenges erfolgreich gespeichert!", jsonData);
  } catch (error) {
    console.error("Fehler beim Speichern der challenges:", error);
  }
};

export const loadChallengesFromDevice = async () => {
  try {
    const jsonData = await AsyncStorage.getItem("challenges");
    return jsonData != null ? JSON.parse(jsonData) : [];
  } catch (error) {
    console.error("Fehler beim Laden der challenges:", error);
    return [];
  }
};
