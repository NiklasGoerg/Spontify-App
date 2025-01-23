import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { fetchPosts } from "@/services/api";
import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/store/feedSlice";
import { PostType } from "@/types";

const Feed = () => {
  const dispatch = useDispatch();
  const posts = useSelector(
    (state: { feed: { posts: PostType[] } }) => state.feed.posts
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        dispatch(setPosts(fetchedPosts));
      } catch (err) {
        setError("Failed to load posts.");
      } finally {
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
      {posts.map((post) => (
        <Post key={post.id} post={post} />
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