import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import ChallengeScreen from "./challengeScreen";

export default function HomeScreen() {
  const [showChallengeScreen, setShowChallengeScreen] = useState(false);

  return (
    <View style={styles.container}>
      {showChallengeScreen ? (
        <ChallengeScreen />
      ) : (
        <TouchableOpacity
          style={styles.challengeButton}
          onPress={() => setShowChallengeScreen(true)}
        >
          <Text style={styles.challengeButtonText}>Challenge Me</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    justifyContent: "center",
    alignItems: "center",
  },
  challengeButton: {
    backgroundColor: "#4CAF50",
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  challengeButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
