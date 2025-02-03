import { supabase } from "../supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export const checkConnectionOnWeb = async () => {
  try {
    const response = await fetch("https://httpbin.org/get", { method: "GET" });
    console.log("Response: ", response);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Benutzer beim App-Start initialisieren
export const initializeUser = async (
  setUserCallback: (user: any) => void,
  setOnlineCallback: (status: boolean) => void,
) => {
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected || !(await checkConnectionOnWeb())) {
    console.log("Offline-Modus: Lade gespeicherten Benutzer");
    const storedUser = await loadUserFromDevice();
    if (storedUser) {
      setUserCallback(storedUser);
    }
    setOnlineCallback(false);
    return;
  }

  console.log(
    "Online-Modus: Prüfe Session",
    netInfo,
    await checkConnectionOnWeb(),
  );
  const sessionUser = await fetchSession();
  if (sessionUser) {
    await saveUserOnDevice(sessionUser);
    setUserCallback(sessionUser);
  }
};

// Session abrufen
const fetchSession = async () => {
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected || !(await checkConnectionOnWeb())) return null;
  const { data, error } = await supabase.auth.getSession();
  return error ? null : data.session?.user || null;
};

// Benutzer registrieren
export const registerUser = async (
  email: string,
  password: string,
  setUserCallback: (user: any) => void,
) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    Alert.alert("Erfolg", `Benutzer erstellt: ${data.user?.email}`);
    setUserCallback(data.user);
    await saveUserOnDevice(data.user);
  } catch (error: any) {
    Alert.alert("Fehler bei der Registrierung", error.message);
  }
};

// Benutzer anmelden
export const loginUser = async (
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
    await saveUserOnDevice(data.user);
  } catch (error: any) {
    Alert.alert("Fehler bei der Anmeldung", error.message);
  }
};

// Benutzer abmelden
export const logoutUser = async (setUserCallback: (user: null) => void) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUserCallback(null);
    await AsyncStorage.removeItem("user");
    Alert.alert("Abgemeldet", "Sie wurden erfolgreich abgemeldet.");
  } catch (error: any) {
    Alert.alert("Fehler beim Abmelden", error.message);
  }
};

// Benutzer-Session auf Gerät speichern
const saveUserOnDevice = async (user: any) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Fehler beim Speichern des Users:", error);
  }
};

// Benutzer-Session vom Gerät laden
const loadUserFromDevice = async () => {
  try {
    const jsonData = await AsyncStorage.getItem("user");
    return jsonData ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error("Fehler beim Laden des Users:", error);
    return null;
  }
};
