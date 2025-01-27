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

  const { error } = await supabase
    .from("challenge_preferences")
    .upsert({
      user_id: user.data.user.id,
      preferences,
    }, { onConflict: ["user_id"] });

  if (error) {
    console.error("Fehler beim Speichern der Präferenzen:", error);
  }
};
