import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { Link } from "expo-router";
import { supabase } from "../supabaseClient";

const ProfileScreen = () => {
  const [username, setUsername] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [location, setLocation] = useState<string>("überall");

  // Benutzerdaten abrufen
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = await supabase.auth.getUser();
      if (!user?.data?.user?.id) {
        Alert.alert("Fehler", "Benutzer konnte nicht geladen werden.");
        return;
      }

      // Benutzerprofil abrufen
      const { data, error } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.data.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error.message);
        return;
      }

      if (data) {
        setUsername(data.full_name || "");
        setIsUserCreated(true);
      }

      // Challenge-Präferenzen abrufen (nur Standort)
      const { data: preferences, error: prefError } = await supabase
        .from("challenge_preferences")
        .select("location")
        .eq("user_id", user.data.user.id)
        .single();

      if (preferences) {
        setLocation(preferences.location || "überall");
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
      // Benutzer erstellen
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
      // Benutzername aktualisieren
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

  // Standort speichern
  const handleSaveLocation = async () => {
    const user = await supabase.auth.getUser();
    if (!user?.data?.user?.id) {
      Alert.alert("Fehler", "Benutzer ist nicht angemeldet.");
      return;
    }
  
    // Prüfen, ob bereits ein Eintrag existiert
    const { data: existingPreference, error: fetchError } = await supabase
      .from("challenge_preferences")
      .select("id")
      .eq("user_id", user.data.user.id)
      .single();
  
    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Fehler beim Abrufen der Challenge-Präferenzen:", fetchError.message);
      Alert.alert("Fehler", "Challenge-Präferenzen konnten nicht geladen werden.");
      return;
    }
  
    let error;
    if (existingPreference) {
      // Falls ein Eintrag existiert -> UPDATE
      ({ error } = await supabase
        .from("challenge_preferences")
        .update({ location })
        .eq("user_id", user.data.user.id));
    } else {
      // Falls kein Eintrag existiert -> INSERT
      ({ error } = await supabase
        .from("challenge_preferences")
        .insert({ user_id: user.data.user.id, location }));
    }
  
    if (error) {
      console.error("Fehler beim Speichern des Standorts:", error.message);
      Alert.alert("Fehler", "Standort konnte nicht gespeichert werden.");
    } else {
      Alert.alert("Erfolg", "Standort wurde gespeichert!");
    }
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

        {/* Standort Präferenz */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>STANDORT</Text>

          <TextInput
            style={styles.input}
            placeholder="Standort (z. B. Berlin oder überall)"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#888"
          />

          <TouchableOpacity style={styles.actionButton} onPress={handleSaveLocation}>
            <Text style={styles.actionButtonText}>Standort speichern</Text>
          </TouchableOpacity>
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
});

export default ProfileScreen;
