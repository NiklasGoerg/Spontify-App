import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { PostType } from "@/types";

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [reactionsVisible, setReactionsVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleReactions = () => {
    if (reactionsVisible) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setReactionsVisible(false));
    } else {
      setReactionsVisible(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleReaction = (reaction: string) => {
    // Notify the store or API about the reaction
    console.log(`User reacted with: ${reaction}`);
    toggleReactions();
  };

  const reactionButtons = ["👍", "❤️", "😂", "😮", "😢"].map((emoji) => (
    <TouchableOpacity key={emoji} style={styles.reactionButton} onPress={() => handleReaction(emoji)}>
      <Text>{emoji}</Text>
    </TouchableOpacity>
  ));

  const reactionStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
    opacity: animation,
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Image source={{ uri: post.user.profilePictureUrl }} style={styles.profilePicture} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.user.username}</Text>
          <Text style={styles.location}>{post.location}</Text>
        </View>
      </View>
      <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity style={styles.reactionToggleButton} onPress={toggleReactions}>
        <Text>⚡</Text>
      </TouchableOpacity>
      <Text style={styles.challenge}>Challenge: {post.challenge}</Text>
      <Text style={styles.date}>{new Date(post.submittedAt).toLocaleDateString()}</Text>
      <View style={styles.reactionsContainer}>
        {reactionsVisible && (
          <Animated.View style={[styles.reactions, reactionStyle]}>
            {reactionButtons}
          </Animated.View>
        )}
      </View>
      <View style={styles.comments}>
        <Text style={styles.commentTitle}>Comments:</Text>
        {/* Render comments here */}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#1e1e1e",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 10,
  },
  username: {
    fontWeight: "bold",
  },
  location: {
    color: "#888",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
  },
  challenge: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  content: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 5,
  },
  reactionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  reactionToggleButton: {
    backgroundColor: "#444",
    borderRadius: 20,
    padding: 10,
  },
  reactions: {
    flexDirection: "row",
    marginLeft: 10,
  },
  reactionButton: {
    marginRight: 10,
  },
  comments: {
    marginTop: 10,
  },
  commentTitle: {
    fontSize: 16,
    color: "#fff",
  },
});

export default Post;