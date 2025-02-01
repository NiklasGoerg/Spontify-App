import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { fetchPosts } from "@/services/api";
import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStructuredPosts,
  setChallenges,
  setFriends,
  setOnline,
  setPosts,
  setStructuredPosts,
} from "@/store/feedSlice";
import { PostType } from "@/types";
import {
  fetchChallenges,
  loadChallengesFromDevice,
  saveChallengesOnDevice,
} from "@/api/challenges";
import { fetchFriends } from "@/api/friends";
import {
  fetchFriendsPosts,
  fetchPostsByUser,
  loadPostsFromDevice,
  savePost,
  savePostsOnDevice,
} from "@/api/posts";
import { supabase } from "@/supabaseClient";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, friends, challenges, online } = useSelector(
    (state: any) => state.feed,
  );

  const [structuredPosts, setStructuredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setOnline(navigator.onLine);
      console.log("navigator online: ", navigator.onLine);
      console.log("online: ", online);
      if (!navigator.onLine) {
        Alert.alert("Keine Internetverbindung");
        const offlinePosts = await loadPostsFromDevice();
        setStructuredPosts(offlinePosts);
        console.log("structuredPosts: ", offlinePosts, structuredPosts);
        return;
      } else {
        const user = await supabase.auth.getUser();
        const friendsData = await fetchFriends();
        console.log("friends: ", friendsData);

        dispatch(setFriends(friendsData));

        const posts = await fetchPostsByUser(user.data.user.id);
        dispatch(setPosts(posts));
        console.log("posts: ", posts);

        const challenges = await fetchChallenges();
        dispatch(setChallenges(challenges));
        console.log("challenges: ", challenges, friends);

        setStructuredPosts(
          selectStructuredPosts(posts, friendsData, challenges),
        );

        savePostsOnDevice(structuredPosts);
        saveChallengesOnDevice(challenges);
        return structuredPosts;
      }
    };

    const loadPosts = async () => {
      try {
        await loadData();
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        console.log("finally", structuredPosts);
        setLoading(false);
      }
    };

    loadPosts();
  }, [dispatch]);

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
