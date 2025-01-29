import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text, FlatList, StyleSheet } from "react-native";
import { fetchComments } from "../api/posts"; // Importiere die fetchComments Funktion

const FetchCommentsTest = () => {
  const [postId, setPostId] = useState("");
  const [comments, setComments] = useState([]);

  const handleFetchComments = async () => {
    if (!postId) {
      Alert.alert("Fehler", "Bitte gib eine Post ID ein");
      return;
    }

    const response = await fetchComments(postId);
    if (response) {
      setComments(response);
    } else {
      Alert.alert("Fehler", "Kommentare konnten nicht abgerufen werden");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Post ID:</Text>
      <TextInput
        style={styles.input}
        value={postId}
        onChangeText={setPostId}
        placeholder="Gib die Post ID ein"
      />
      
      <Button title="Kommentare abrufen" onPress={handleFetchComments} />
      
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentUser}>User ID: {item.user_id}</Text>
            <Text style={styles.commentText}>{item.content}</Text>
          </View>
        )}
      />
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
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  commentUser: {
    fontWeight: "bold",
  },
  commentText: {
    marginTop: 5,
  },
});

export default FetchCommentsTest;
