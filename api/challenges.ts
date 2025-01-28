import { supabase } from "../supabaseClient";

// Hole eine zufällige Challenge basierend auf den Präferenzen
export const getRandomChallenge = async (preferences: string[]) => {
    console.log("Filter für Präferenzen:", preferences); // Debug-Log
  
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .in("type", preferences); // Filtere nach Präferenzen
    
    console.log("Data Test: ", data)
  
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
