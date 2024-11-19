import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, CameraType, useCameraPermissions, PermissionStatus } from "expo-camera";

export default function HomeScreen() {
  const cameraRef = React.useRef<CameraView>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        const { status } = await requestPermission();
        if (status !== PermissionStatus.GRANTED) {
          Alert.alert("Permission Required", "Camera access is required to use this feature.");
        }
      }
    })();
  }, [permission]);

  const handleTakePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current?.takePictureAsync();
      Alert.alert("Photo taken!", `Saved to: ${photo?.uri}`);
    }
  };

  const handleSwitchCamera = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleVideoMode = () => {
    Alert.alert("Video Mode", "Video recording is not yet implemented.");
  };

  if (!permission?.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permissionText}>Camera access is required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isCameraActive ? (
        <TouchableOpacity style={styles.challengeButton} onPress={() => setIsCameraActive(true)}>
          <Text style={styles.challengeButtonText}>Challenge Me</Text>
        </TouchableOpacity>
      ) : (
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
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
  },
  permissionText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  permissionButton: {
    backgroundColor: "#ff6f61",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  challengeButton: {
    backgroundColor: "#4CAF50",
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
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
});
