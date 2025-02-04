import React, { useState, useRef , useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { PostType } from "@/types";
import { saveReaction, fetchReactions } from "@/api/posts";

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [reactionsVisible, setReactionsVisible] = useState(false);
  const [reactions, setReactions] = useState<{ reaction_type: string }[]>([]);
  const animation = useRef(new Animated.Value(0)).current;
  console.log("Post: ", post);

  useEffect(() => {
    if (!post?.id) return;
    const loadReactions = async () => {
      console.log("Postid bei Reaction:", post.id);
      const data = await fetchReactions(post.id);
      console.log("Geladene Reaktionen:", data); 

      if (data) {
        setReactions(data);
      }
    };
    loadReactions();
  }, [post.id]);

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

  const handleReaction = async (reaction: string) => {
    if (!post?.id) return;
    console.log(`User reacted with: ${reaction}`);
    saveReaction(post.id, reaction);
    //toggleReactions();
    setTimeout(async () => {
      const updatedReactions = await fetchReactions(post.id);
      console.log("Aktualisierte Reaktionen nach Verzögerung:", updatedReactions);
      if (updatedReactions) {
        setReactions(updatedReactions);
      }
    }, 500); // 500ms Verzögerung
  };

  const reactionButtons = ["👍", "❤️", "😂", "😮", "😢"].map((emoji) => (
    <TouchableOpacity
      key={emoji}
      style={styles.reactionButton}
      onPress={() => handleReaction(emoji)}
    >
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
        <Image
          source={require("@/assets/images/profile-pic.jpg")}
          style={styles.profilePicture}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.user?.friend_name}</Text>
          <Text style={styles.location}>{"Dresden"}</Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              Platform.OS === "web"
                ? `https://${post.photo_url}` // Web: Base64-Daten
                : post.photo_url, // Android/iOS: Lokaler Dateipfad
          }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.reactionsContainer}>
          {reactions.map((reaction, index) => (
            <Text
              key={index}
              style={[
                styles.reactionEmoji,
                { left: index * 30, top: index * (-3) },
              ]}
            >
              {reaction.reaction_type}
            </Text>
          ))}
        </View>
        <TouchableOpacity
          style={styles.reactionToggleButton}
          onPress={toggleReactions}
        >
          <Text style={styles.reactionToggleText}>⚡</Text>
        </TouchableOpacity>
        {reactionsVisible && (
          <Animated.View style={[styles.reactions, reactionStyle]}>
            {reactionButtons}
          </Animated.View>
        )}
      </View>
      <Text style={styles.challenge}>Challenge: {post.challenge?.title}</Text>
      <Text style={styles.date}>
        {new Date(post.created_at).toLocaleDateString()}
      </Text>
      <View style={styles.comments}>
        <Text style={styles.commentTitle}>Comments:</Text>
        {/* Render comments here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    width: "100%",
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
    color: "#fff",
  },
  location: {
    color: "#888",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 5,
  },
  reactionToggleButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#444",
    borderRadius: 25, // Kreisförmig
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2, // Über dem Bild
  },
  reactionToggleText: {
    fontSize: 24,
    color: "#fff",
  },
  reactions: {
    position: "absolute",
    bottom: 10,
    right: 70, // Platzierung links vom Button
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  reactionButton: {
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
  },
  challenge: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 5,
  },
  comments: {
    marginTop: 10,
  },
  commentTitle: {
    fontSize: 16,
    color: "#fff",
  },
  reactionsContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  reactionEmoji: {
    fontSize: 30,
    position: "absolute",
  },
});

export default Post;
