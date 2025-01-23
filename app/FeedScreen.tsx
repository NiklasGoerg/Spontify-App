import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import Feed from "@/components/feed/Feed";
import { PostType } from "../types";
import ChallengeButton from "@/components/feed/challengeButton";

const FeedScreen = () => {
  const posts: PostType[] = useSelector((state: any) => state.feed.posts);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image
          source={require("@/assets/images/friends.svg")}
          style={styles.icon}
        />
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
        <Image
          source={require("@/assets/images/profile-pic.jpg")}
          style={styles.icon}
        />
      </View>
      <ScrollView contentContainerStyle={styles.feedContainer}>
        <Feed posts={posts} />
      </ScrollView>
      <ChallengeButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  topBar: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#1e1e1e",
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  feedContainer: {
    paddingBottom: 20,
  },
});

export default FeedScreen;
