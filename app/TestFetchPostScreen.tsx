import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text, FlatList, StyleSheet } from "react-native";
import { fetchPostsByUser } from "../api/posts"; // Importiere die fetchPostsByUser Funktion

const FetchPostsByUserTest = () => {
  const [userId, setUserId] = useState("");
  const [posts, setPosts] = useState([]);

  const handleFetchPosts = async () => {
    if (!userId) {
      Alert.alert("Fehler", "Bitte gib eine User ID ein");
      return;
    }

    const response = await fetchPostsByUser(userId);
    if (response) {
      setPosts(response);
    } else {
      Alert.alert("Fehler", "Beiträge konnten nicht abgerufen werden");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>User ID:</Text>
      <TextInput
        style={styles.input}
        value={userId}
        onChangeText={setUserId}
        placeholder="Gib die User ID ein"
      />
      
      <Button title="Beiträge abrufen" onPress={handleFetchPosts} />
      
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postUser}>User ID: {item.user_id}</Text>
            <Text style={styles.postChallenge}>Challenge ID: {item.challenge_id}</Text>
            <Text style={styles.postUrl}>Bild URL: {item.photo_url}</Text>
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
  postContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  postUser: {
    fontWeight: "bold",
  },
  postChallenge: {
    marginTop: 5,
  },
  postUrl: {
    color: "blue",
    marginTop: 5,
  },
});

export default FetchPostsByUserTest;
