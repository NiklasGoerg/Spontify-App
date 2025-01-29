import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text, StyleSheet } from "react-native";
import { savePost } from "../api/posts"; // Importiere die savePost Funktion

const SavePostTest = () => {
  const [userId, setUserId] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleSavePost = async () => {
    if (!userId || !challengeId || !photoUrl || !description) {
      Alert.alert("Fehler", "Bitte fülle alle Felder aus");
      return;
    }

    const response = await savePost(userId, challengeId, photoUrl, description);
    if (response) {
      Alert.alert("Erfolg", "Post wurde erfolgreich gespeichert!");
      setUserId("");
      setChallengeId("");
      setPhotoUrl("");
      setDescription("");
    } else {
      Alert.alert("Fehler", "Post konnte nicht gespeichert werden");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>User ID:</Text>
      <TextInput style={styles.input} value={userId} onChangeText={setUserId} placeholder="Gib die User ID ein" />
      
      <Text style={styles.label}>Challenge ID:</Text>
      <TextInput style={styles.input} value={challengeId} onChangeText={setChallengeId} placeholder="Gib die Challenge ID ein" />
      
      <Text style={styles.label}>Foto URL:</Text>
      <TextInput style={styles.input} value={photoUrl} onChangeText={setPhotoUrl} placeholder="Gib die Foto-URL ein" />
      
      <Text style={styles.label}>Beschreibung:</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Gib eine Beschreibung ein" />
      
      <Button title="Post speichern" onPress={handleSavePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});

export default SavePostTest;
