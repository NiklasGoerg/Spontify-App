import { supabase } from "../supabaseClient";

export const updateUsername = async (username: string) => {
  const user = await supabase.auth.getUser(); // Hole den aktuellen Nutzer
  if (!user?.data?.user?.id) {
    console.error("Kein Nutzer angemeldet.");
    return false;
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: username, // Speichere den Benutzernamen im `user_metadata`
    },
  });

  if (error) {
    console.error("Fehler beim Aktualisieren des Benutzernamens:", error.message);
    return false;
  }

  return true;
};
