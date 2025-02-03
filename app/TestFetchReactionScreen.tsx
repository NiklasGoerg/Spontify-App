import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { fetchReactions } from "../api/posts"; // Importiere die fetchReactions Funktion

const FetchReactionsTest = () => {
  const [postId, setPostId] = useState("");
  const [reactions, setReactions] = useState([]);

  const handleFetchReactions = async () => {
    if (!postId) {
      Alert.alert("Fehler", "Bitte gib eine Post ID ein");
      return;
    }

    const response = await fetchReactions(postId);
    if (response) {
      setReactions(response);
    } else {
      Alert.alert("Fehler", "Reaktionen konnten nicht abgerufen werden");
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

      <Button title="Reaktionen abrufen" onPress={handleFetchReactions} />

      <FlatList
        data={reactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reactionContainer}>
            <Text style={styles.reactionUser}>User ID: {item.user_id}</Text>
            <Text style={styles.reactionType}>
              Reaktion: {item.reaction_type}
            </Text>
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
  reactionContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  reactionUser: {
    fontWeight: "bold",
  },
  reactionType: {
    marginTop: 5,
  },
});

export default FetchReactionsTest;
