import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CameraComponent from "@/components/Camera";

export default function ChallengeScreen() {
  const [isChallengeAccepted, setIsChallengeAccepted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleAcceptChallenge = () => {
    setIsChallengeAccepted(true);
  };

  const handleOpenCamera = () => {
    setIsCameraActive(true);
  };

  return (
    <View style={styles.container}>
      {isCameraActive ? (
        <CameraComponent onClose={() => setIsCameraActive(false)} />
      ) : (
        <>
          <Text style={styles.title}>Your challenge for today</Text>
          <Text style={styles.description}>
            Take a photo that captures something beautiful about your day.
          </Text>
          <View style={styles.buttonsContainer}>
            {!isChallengeAccepted ? (
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAcceptChallenge}
              >
                <Text style={styles.buttonText}>Accept Challenge</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleOpenCamera}
              >
                <Text style={styles.buttonText}>Open Camera</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
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
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
  },
  buttonsContainer: {
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: "#007aff",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center",
  },
});
