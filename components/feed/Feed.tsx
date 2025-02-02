import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  setChallenges,
  setFriends,
  setOnline,
  setPosts,
  selectStructuredPosts,
} from "@/store/feedSlice";
import {
  fetchPostsByUser,
  loadPostsFromDevice,
  savePostsOnDevice,
} from "@/api/posts";
import { fetchChallenges, saveChallengesOnDevice } from "@/api/challenges";
import { fetchFriends } from "@/api/friends";
import { supabase } from "@/supabaseClient";
import NetInfo from "@react-native-community/netinfo"; // Importiere NetInfo
import Post from "./Post";
import {
  fetchPreferences,
  savePreferences,
  savePreferencesOnDevice,
} from "@/api/preferences";

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
        setLoading(false); // Ladevorgang abgeschlossen
        return;
      } else {
        // Online-Modus: Lade Posts und Challenges von der API
        try {
          const user = await supabase.auth.getUser();
          const friendsData = await fetchFriends();

          dispatch(setFriends(friendsData));

          const posts = await fetchPostsByUser(user.data.user.id);
          dispatch(setPosts(posts));

          const challenges = await fetchChallenges();
          dispatch(setChallenges(challenges));
          saveChallengesOnDevice(challenges);

          let structuredPosts = selectStructuredPosts(
            posts,
            friendsData,
            challenges,
          );
          structuredPosts = await savePostsOnDevice(structuredPosts);
          console.log("Structured Posts: ", structuredPosts);
          setStructuredPosts(structuredPosts); // Setze Posts in den State

          const preferences = await fetchPreferences();
          savePreferencesOnDevice(preferences);
        } catch (err) {
          console.error("Fehler beim Laden der Daten:", err);
          setError("Fehler beim Laden der Daten");
        }
      }
    };

    loadData().finally(() => {
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
