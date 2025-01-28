import { supabase } from "../supabaseClient";

// Freunde abrufen
export const fetchFriends = async () => {
  const user = await supabase.auth.getUser();
  if (!user?.data?.user?.id) return [];

  const { data, error } = await supabase
    .from("friends")
    .select("id, friend_id, friend_name, status, created_at")
    .eq("user_id", user.data.user.id);

  if (error) {
    console.error("Fehler beim Abrufen der Freunde:", error.message);
    return [];
  }

  return data || [];
};

// Nutzer suchen
export const searchUsers = async (query: string) => {
  if (!query.trim()) {
    return [];
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, avatar_url")
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);

  if (error) {
    console.error("Fehler bei der Suche:", error.message);
    return [];
  }

  return data || [];
};

// Freund hinzufügen
export const addFriend = async (friendId: string, friendName: string) => {
  const user = await supabase.auth.getUser();
  if (!user?.data?.user?.id) return false;

  const { error } = await supabase
    .from("friends")
    .insert({
      user_id: user.data.user.id,
      friend_id: friendId,
      friend_name: friendName,
      status: "active",
    });

  if (error) {
    console.error("Fehler beim Hinzufügen eines Freundes:", error.message);
    return false;
  }

  return true;
};

// Freund entfernen
export const removeFriend = async (friendshipId: string) => {
  const { error } = await supabase
    .from("friends")
    .delete()
    .eq("id", friendshipId);

  if (error) {
    console.error("Fehler beim Entfernen eines Freundes:", error.message);
    return false;
  }

  return true;
};
