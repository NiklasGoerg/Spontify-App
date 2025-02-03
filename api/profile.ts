import { supabase } from "../supabaseClient";
import { setOnline } from "@/store/feedSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// Benutzername aktualisieren
export const updateUsername = async (username: string) => {
  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: username },
  });

  if (error) {
    console.error(
      "Fehler beim Aktualisieren des Benutzernamens:",
      error.message,
    );
    return false;
  }

  return true;
};

// Session abrufen
export const fetchSession = async (
  setOnlineCallback: (status: boolean) => void,
) => {
  if (!navigator.onLine) {
    console.log("Keine Internetverbindung");
    setOnlineCallback(false);
    return null;
  }

  setOnlineCallback(true);
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Fehler beim Abrufen der Session:", error.message);
    return null;
  }

  return data.session?.user || null;
};

// Benutzer registrieren
export const handleSignUp = async (
  email: string,
  password: string,
  setUserCallback: (user: any) => void,
) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    Alert.alert("Erfolg", `Benutzer erstellt: ${data.user?.email}`);
    setUserCallback(data.user);
  } catch (error: any) {
    Alert.alert("Fehler bei der Registrierung", error.message);
  }
};

// Benutzer anmelden
export const handleLogin = async (
  email: string,
  password: string,
  setUserCallback: (user: any) => void,
) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    Alert.alert("Erfolg", `Willkommen zurück, ${data.user.email}`);
    setUserCallback(data.user);
  } catch (error: any) {
    Alert.alert("Fehler bei der Anmeldung", error.message);
  }
};

// Benutzer abmelden
export const handleSignOut = async (setUserCallback: (user: null) => void) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUserCallback(null);
    Alert.alert("Abgemeldet", "Sie wurden erfolgreich abgemeldet.");
  } catch (error: any) {
    Alert.alert("Fehler beim Abmelden", error.message);
  }
};

// Benutzer-Session auf Gerät speichern
export const saveUserOnDevice = async (user: any) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    console.log("User erfolgreich gespeichert!");
  } catch (error) {
    console.error("Fehler beim Speichern des Users:", error);
  }
};

// Benutzer-Session vom Gerät laden
export const loadUserFromDevice = async () => {
  try {
    const jsonData = await AsyncStorage.getItem("user");
    return jsonData ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error("Fehler beim Laden des Users:", error);
    return null;
  }
};
