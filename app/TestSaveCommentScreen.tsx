import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text, StyleSheet } from "react-native";
import { supabase } from "../supabaseClient"; // Importiere deinen Supabase-Client

const SaveCommentTest = () => {
  const [postId, setPostId] = useState("");
  const [userId, setUserId] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const saveComment = async () => {
    if (!postId || !userId || !commentContent) {
      Alert.alert("Fehler", "Bitte fülle alle Felder aus");
      return;
    }

    try {
      const { data, error } = await supabase.from("comments").insert([
        {
          post_id: postId,
          user_id: userId,
          content: commentContent,
        },
      ]);

      if (error) {
        console.error("Fehler beim Speichern des Kommentars:", error);
        Alert.alert("Fehler", "Kommentar konnte nicht gespeichert werden");
      } else {
        console.log("Kommentar erfolgreich gespeichert:", data);
        Alert.alert("Erfolg", "Kommentar wurde erfolgreich gespeichert!");
        setPostId("");
        setUserId("");
        setCommentContent("");
      }
    } catch (err) {
      console.error("Unerwarteter Fehler:", err);
      Alert.alert("Fehler", "Unerwarteter Fehler beim Speichern des Kommentars");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Post ID:</Text>
      <TextInput style={styles.input} value={postId} onChangeText={setPostId} placeholder="Gib die Post ID ein" />
      
      <Text style={styles.label}>User ID:</Text>
      <TextInput style={styles.input} value={userId} onChangeText={setUserId} placeholder="Gib die User ID ein" />
      
      <Text style={styles.label}>Kommentar:</Text>
      <TextInput style={styles.input} value={commentContent} onChangeText={setCommentContent} placeholder="Gib deinen Kommentar ein" />
      
      <Button title="Kommentar speichern" onPress={saveComment} />
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

export default SaveCommentTest;
