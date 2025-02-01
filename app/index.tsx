import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { supabase } from "../supabaseClient"; // Supabase-Client importieren
import LoginForm from "./login"; // Deine Login-Formular-Komponente
import { Provider } from "react-redux";
import store from "@/store/store";
import FeedScreen from "./FeedScreen"; // Dein Feed-Bildschirm
import { fetchFriends } from "@/api/friends";
import { fetchFriendsPosts } from "@/api/posts";

export default function HomeScreen() {
  const [email, setEmail] = useState(""); // E-Mail des Benutzers
  const [password, setPassword] = useState(""); // Passwort des Benutzers
  const [user, setUser] = useState(null); // Benutzer-Session

  // Authentifizierungsstatus überwachen
  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Fehler beim Abrufen der Session:", error.message);
        setUser(null);
      } else {
        setUser(data?.session?.user || null);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      },
    );

    const loadData = async () => {
      const friendsData = await fetchFriends();
      console.log("index: ", friendsData);

      const posts = await fetchFriendsPosts(friendsData);
    };

    loadData();

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Benutzer registrieren
  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      Alert.alert("Erfolg", `Benutzer erstellt: ${data.user.email}`);
    } catch (error) {
      Alert.alert("Fehler bei der Registrierung", error.message);
    }
  };

  // Benutzer anmelden
  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      Alert.alert("Erfolg", `Willkommen zurück, ${data.user.email}`);
    } catch (error) {
      Alert.alert("Fehler bei der Anmeldung", error.message);
    }
  };

  // Benutzer abmelden
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      Alert.alert("Abgemeldet", "Sie wurden erfolgreich abgemeldet.");
    } catch (error) {
      Alert.alert("Fehler beim Abmelden", error.message);
    }
  };

  return (
    <Provider store={store}>
      <View style={styles.container}>
        {user ? (
          <FeedScreen onSignOut={handleSignOut} /> // Feed anzeigen, wenn Benutzer angemeldet ist
        ) : (
          <LoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onRegister={handleSignUp}
            onLogin={handleLogin}
          />
        )}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    justifyContent: "center",
    alignItems: "center",
  },
});
