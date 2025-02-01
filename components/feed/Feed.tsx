import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  setChallenges,
  setFriends,
  setOnline,
  setPosts,
} from "@/store/feedSlice";
import { fetchPostsByUser, loadPostsFromDevice } from "@/api/posts";
import { fetchChallenges } from "@/api/challenges";
import { fetchFriends } from "@/api/friends";
import { supabase } from "@/supabaseClient";
import NetInfo from "@react-native-community/netinfo"; // Importiere NetInfo
import Post from "./Post";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, friends, challenges, online } = useSelector(
    (state: any) => state.feed,
  );

  const [structuredPosts, setStructuredPosts]: any[] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Setze den initialen Status für online
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Überwache den Netzwerkstatus
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected); // Setze den Online-Status auf Basis des NetInfo State
      dispatch(setOnline(state.isConnected)); // Optional: Wenn du Redux dafür nutzt
    });

    // Cleanup bei der Entladung des Components
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const loadData = async () => {
      if (!isOnline) {
        // Offline-Modus: Lade Posts aus dem Gerät
        const offlinePosts = await loadPostsFromDevice();
        setStructuredPosts(offlinePosts);
        console.log("Offline Posts geladen: ", offlinePosts);
        return;
      } else {
        // Online-Modus: Lade Posts und Challenges von der API
        const user = await supabase.auth.getUser();
        const friendsData = await fetchFriends();
        console.log("friends: ", friendsData);

        dispatch(setFriends(friendsData));

        const posts = await fetchPostsByUser(user.data.user.id);
        dispatch(setPosts(posts));
        console.log("posts: ", posts);

        const challenges = await fetchChallenges();
        dispatch(setChallenges(challenges));
        console.log("challenges: ", challenges);

        setStructuredPosts(posts); // Setze Posts in den State
      }
    };

    loadData()
      .catch((err) => {
        console.error("Fehler beim Laden der Daten:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, isOnline]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {structuredPosts?.map((post: any) => <Post key={post.id} post={post} />)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#000",
  },
});

export default Feed;
