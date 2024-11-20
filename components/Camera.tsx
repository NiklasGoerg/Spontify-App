import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { CameraView, CameraType } from "expo-camera";

interface CameraComponentProps {
  onClose: () => void;
}

export default function CameraComponent({ onClose }: CameraComponentProps) {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      Alert.alert("Photo taken!", `Saved to: ${photo.uri}`);
    }
  };

  const handleSwitchCamera = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleVideoMode = () => {
    Alert.alert("Video Mode", "Video recording is not yet implemented.");
  };

  return (
    <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
      <View style={styles.cameraUI}>
        <TouchableOpacity style={styles.switchButton} onPress={handleSwitchCamera}>
          <Text style={styles.uiText}>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
          <View style={styles.innerCircle} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.videoButton} onPress={handleVideoMode}>
          <Text style={styles.uiText}>Video</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>X</Text>
      </TouchableOpacity>
    </CameraView>
  );
}

const styles = StyleSheet.create({
    camera: {
      flex: 1,
    },
    cameraUI: {
      position: "absolute",
      bottom: 100,
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      alignItems: "center",
    },
    captureButton: {
      width: 80,
      height: 80,
      backgroundColor: "#000",
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 5,
      borderColor: "#fff",
    },
    innerCircle: {
      width: 60,
      height: 60,
      backgroundColor: "#fff",
      borderRadius: 30,
    },
    switchButton: {
      backgroundColor: "#007aff",
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#fff",
    },
    videoButton: {
      backgroundColor: "#ff5722",
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#fff",
    },
    uiText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "center",
    },
    closeButton: {
      position: "absolute",
      top: 20,
      right: 20,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      padding: 10,
      borderRadius: 20,
    },
    closeText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    uiText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "center",
    },
  });
  