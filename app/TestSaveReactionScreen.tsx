import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text, StyleSheet } from "react-native";
import { saveReaction } from "../api/posts"; // Importiere die saveReaction Funktion

const SaveReactionTest = () => {
  const [postId, setPostId] = useState("");
  const [userId, setUserId] = useState("");
  const [reactionType, setReactionType] = useState("");

  const handleSaveReaction = async () => {
    if (!postId || !userId || !reactionType) {
      Alert.alert("Fehler", "Bitte fülle alle Felder aus");
      return;
    }

    const response = await saveReaction(postId, userId, reactionType);
    if (response) {
      Alert.alert("Erfolg", "Reaktion wurde erfolgreich gespeichert!");
      setPostId("");
      setUserId("");
      setReactionType("");
    } else {
      Alert.alert("Fehler", "Reaktion konnte nicht gespeichert werden");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Post ID:</Text>
      <TextInput style={styles.input} value={postId} onChangeText={setPostId} placeholder="Gib die Post ID ein" />
      
      <Text style={styles.label}>User ID:</Text>
      <TextInput style={styles.input} value={userId} onChangeText={setUserId} placeholder="Gib die User ID ein" />
      
      <Text style={styles.label}>Reaktionstyp:</Text>
      <TextInput style={styles.input} value={reactionType} onChangeText={setReactionType} placeholder="Gib die Reaktion ein (z.B. Like, Love)" />
      
      <Button title="Reaktion speichern" onPress={handleSaveReaction} />
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

export default SaveReactionTest;
