import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { fetchOwnPost } from "@/api/posts";
import { supabase } from "../supabaseClient";

const TestFetchOwnPostScreen = () => {
  const [post, setPost] = useState(null);

  const handleFetchOwnPost = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    
    if (error || !user?.user) {
      console.error("❌ Fehler: Kein eingeloggter User gefunden.");
      return;
    }

    const userId = user.user.id;
    console.log("👤 Eingeloggte User-ID:", userId);

    const latestPost = await fetchOwnPost(userId);
    setPost(latestPost);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test: Fetch Own Post</Text>
      <Button title="Fetch My Latest Post" onPress={handleFetchOwnPost} />
      {post && (
        <View style={styles.postContainer}>
          <Text style={styles.postText}>Post ID: {post.id}</Text>
          <Text style={styles.postText}>Challenge: {post.challenge?.title}</Text>
          <Text style={styles.postText}>Created At: {new Date(post.created_at).toLocaleString()}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  postContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  postText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default TestFetchOwnPostScreen;
