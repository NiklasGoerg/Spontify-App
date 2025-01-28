import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { Link } from "expo-router"; // Für die Verlinkung
import { supabase } from "../supabaseClient";

const ProfileScreen = () => {
  const [username, setUsername] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false); // Prüfen, ob der Benutzer schon in der users-Tabelle existiert

  // Aktuellen Benutzernamen und Status abrufen
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = await supabase.auth.getUser();
      if (!user?.data?.user?.id) {
        Alert.alert("Fehler", "Benutzer konnte nicht geladen werden.");
        return;
      }

      // Prüfen, ob der Benutzer schon in der users-Tabelle existiert
      const { data, error } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.data.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error.message);
        Alert.alert("Fehler", "Benutzerprofil konnte nicht geladen werden.");
        return;
      }

      if (data) {
        setUsername(data.full_name || ""); // Benutzername aus der Tabelle laden
        setIsUserCreated(true); // Benutzer existiert in der users-Tabelle
      }
    };

    fetchUserProfile();
  }, []);

  // Benutzername speichern oder aktualisieren
  const handleSaveUsername = async () => {
    if (!username.trim()) {
      Alert.alert("Fehler", "Der Benutzername darf nicht leer sein.");
      return;
    }

    setIsSaving(true);

    const user = await supabase.auth.getUser();
    if (!user?.data?.user?.id) {
      Alert.alert("Fehler", "Benutzer ist nicht angemeldet.");
      setIsSaving(false);
      return;
    }

    if (!isUserCreated) {
      // Benutzer in der users-Tabelle erstellen
      const { error } = await supabase.from("users").insert({
        id: user.data.user.id,
        full_name: username,
        email: user.data.user.email,
      });

      if (error) {
        console.error("Fehler beim Erstellen des Benutzers:", error.message);
        Alert.alert("Fehler", "Benutzer konnte nicht erstellt werden.");
        setIsSaving(false);
        return;
      }

      setIsUserCreated(true);
    } else {
      // Benutzername in der users-Tabelle aktualisieren
      const { error } = await supabase
        .from("users")
        .update({ full_name: username })
        .eq("id", user.data.user.id);

      if (error) {
        console.error("Fehler beim Aktualisieren des Benutzernamens:", error.message);
        Alert.alert("Fehler", "Benutzername konnte nicht aktualisiert werden.");
        setIsSaving(false);
        return;
      }
    }

    Alert.alert("Erfolg", "Benutzername erfolgreich gespeichert!");
    setIsSaving(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Link href="/">
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </Link>
      </View>

      <View style={styles.profileContainer}>
        {/* Profilbild */}
        <Image
          source={require("@/assets/images/profile-pic.jpg")}
          style={styles.profileImage}
        />

        {/* Benutzername anzeigen und bearbeiten */}
        <TextInput
          style={styles.input}
          placeholder="Benutzername"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSaveUsername}
          disabled={isSaving}
        >
          <Text style={styles.actionButtonText}>
            {isSaving ? "Speichern..." : "Benutzernamen speichern"}
          </Text>
        </TouchableOpacity>

        {/* Abschnitt Challenge Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>CHALLENGE SETTINGS</Text>
          <Link href="/ChallengeTypesScreen" asChild>
            <TouchableOpacity style={styles.challengeButton}>
              <Text style={styles.challengeButtonText}>Challenge preference</Text>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Button: Logout */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  topBar: {
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 10,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#fff",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#1864B7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 30,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsSection: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  challengeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e1e1e",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  challengeButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  arrow: {
    fontSize: 16,
    color: "#fff",
  },
});

export default ProfileScreen;
