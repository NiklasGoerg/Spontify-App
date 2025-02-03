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
import { checkConnectionOnWeb } from "@/api/profile";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, friends, challenges, online } = useSelector(
    (state: any) => state.feed,
  );

  const [structuredPosts, setStructuredPosts]: any[] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Setze den initialen Status für online
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
      dispatch(setOnline(state.isConnected)); // Redux Online-Status setzen
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const loadData = async () => {
      console.log(
        "Online-Status Feed:",
        isOnline,
        await checkConnectionOnWeb(),
      );
      if (!(await checkConnectionOnWeb())) {
        console.log("Offline-Modus: Lade Posts von Gerät.");
        const offlinePosts = await loadPostsFromDevice();
        setStructuredPosts(offlinePosts);
        setLoading(false);
        return;
      }

      try {
        const user = await supabase.auth.getUser();
        if (!user.data?.user) throw new Error("Benutzer nicht gefunden");

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
        structuredPosts.sort((a: any, b: any) => b.created_at - a.created_at);
        structuredPosts = structuredPosts.filter((post: any) => {
          const postDate = new Date(post.created_at);
          const today = new Date();
          return postDate.getTime() > today.getTime() - 1000 * 60 * 60 * 48;
        });
        structuredPosts = await savePostsOnDevice(structuredPosts);
        setStructuredPosts(structuredPosts);

        const preferences = await fetchPreferences();
        savePreferencesOnDevice(preferences);
      } catch (err) {
        console.error("Fehler beim Laden der Daten:", err);
        setError("Fehler beim Laden der Daten");
      } finally {
        setLoading(false);
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
      {structuredPosts?.map((post: any) => (
        <Post key={`${post.challenge_id}_${post.user_id}`} post={post} />
      ))}
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
