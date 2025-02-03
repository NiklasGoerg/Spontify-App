import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabaseClient";

const defaultPreferences = {
  fitness: true,
  creativity: true,
  mindfulness: true,
  adventure: true,
  knowledge: true,
};

// Präferenzen abrufen
export const fetchPreferences = async () => {
  const user = await supabase.auth.getUser();
  if (!user?.data?.user?.id) return defaultPreferences;

  const { data, error } = await supabase
    .from("challenge_preferences")
    .select("preferences")
    .eq("user_id", user.data.user.id)
    .single();

  if (error || !data) {
    console.error("Fehler beim Abrufen der Präferenzen:", error);
    return defaultPreferences; // Standard-Präferenzen zurückgeben
  }

  return data.preferences;
};

// Präferenzen speichern
export const savePreferences = async (preferences: any) => {
  const user = await supabase.auth.getUser();
  if (!user?.data?.user?.id) return;

  const { error } = await supabase.from("challenge_preferences").upsert(
    {
      user_id: user.data.user.id,
      preferences,
    },
    { onConflict: ["user_id"] },
  );

  if (error) {
    console.error("Fehler beim Speichern der Präferenzen:", error);
  }
};

export const savePreferencesOnDevice = async (preferences: any[]) => {
  try {
    const jsonData = JSON.stringify(preferences);
    await AsyncStorage.setItem("preferences", jsonData);
    console.log("preferences erfolgreich gespeichert!", jsonData);
  } catch (error) {
    console.error("Fehler beim Speichern der preferences:", error);
  }
};

export const loadPreferencesFromDevice = async () => {
  try {
    const jsonData = await AsyncStorage.getItem("preferences");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Fehler beim Laden der preferences:", error);
    return [];
  }
};
