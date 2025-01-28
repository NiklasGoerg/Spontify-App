import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CommentProps {
  username: string;
  text: string;
}

const Comment: React.FC<CommentProps> = ({ username, text }) => {
  return (
    <View style={styles.commentContainer}>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.commentText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    marginVertical: 5,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  username: {
    fontWeight: "bold",
  },
  commentText: {
    marginTop: 5,
  },
});

export default Comment;
