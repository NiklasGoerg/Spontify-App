import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchPreferences, savePreferences } from "../api/preferences";


const challengeTypes = [
  { key: "fitness", label: "Fitness" },
  { key: "creativity", label: "Kreativität" },
  { key: "mindfulness", label: "Achtsamkeit" },
  { key: "adventure", label: "Abenteuer" },
  { key: "knowledge", label: "Wissen" },
];

export default function ChallengeTypesScreen() {
  const [preferences, setPreferences] = useState<any>({});
  const navigation = useNavigation();

  // Präferenzen beim Laden der Seite abrufen
  useEffect(() => {
    const loadPreferences = async () => {
      const userPreferences = await fetchPreferences();
      setPreferences(userPreferences);
    };

    loadPreferences();
  }, []);

  // Auswahl umschalten
  const togglePreference = (key: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Präferenzen speichern
  const saveChanges = async () => {
    await savePreferences(preferences);
    alert("Präferenzen gespeichert!");
  };

  return (
    <View style={styles.container}>
      {/* Header mit Zurück-Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Challenge Typen</Text>
      </View>

      {/* Liste der Challenge Typen */}
      <FlatList
        data={challengeTypes}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.challengeTypeButton,
              preferences[item.key] && styles.selectedChallengeTypeButton,
            ]}
            onPress={() => togglePreference(item.key)}
          >
            <Text
              style={[
                styles.challengeTypeText,
                preferences[item.key] && styles.selectedChallengeTypeText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.challengeList}
      />
      {/* Speichern-Button */}
      <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Speichern</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#1e1e1e",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  challengeList: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  challengeTypeButton: {
    backgroundColor: "#1e1e1e",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 15,
  },
  selectedChallengeTypeButton: {
    backgroundColor: "#1864B7",
    borderColor: "#1864B7",
  },
  challengeTypeText: {
    fontSize: 16,
    color: "#fff",
  },
  selectedChallengeTypeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#1864B7",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },  
});
