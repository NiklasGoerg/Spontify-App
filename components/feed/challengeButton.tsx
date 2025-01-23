import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Link href="/challengeScreen" asChild>
        <TouchableOpacity style={styles.challengeButton}>
          <LinearGradient
            colors={["#1864B7", "#6C09ED"]}
            style={styles.gradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <Text style={styles.challengeButtonText}>Challenge me</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    justifyContent: "space-between",
  },
  challengeButton: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowColor: "#1864B7",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  gradient: {
    flex: 1,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  challengeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});

export default HomeScreen;
