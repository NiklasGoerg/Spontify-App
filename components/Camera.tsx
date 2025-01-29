import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

interface CameraComponentProps {
  onClose: () => void;
  onSend: (photoUri: string) => void;
}

export default function CameraComponent({
  onClose,
  onSend,
}: CameraComponentProps) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState<"back" | "front">("back");

  const handleTakePicture = async () => {
    // Berechtigungen anfordern
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Du musst die Kamera-Berechtigung erteilen!");
      return;
    }

    // Native Kamera-App öffnen
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Ermöglicht das Zuschneiden und Zoomen
      aspect: [3, 4],
      quality: 1,
      cameraType: cameraType, // Front- oder Rückkamera
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri); // URI des aufgenommenen Fotos speichern
    }
  };

  const handleSwitchCamera = () => {
    setCameraType((current) => (current === "back" ? "front" : "back"));
  };

  const handleDeletePhoto = () => {
    setPhotoUri(null);
  };

  const handleSendPhoto = async () => {
    if (photoUri) {
      const success = await saveChallengePhoto(
        photoUri,
        "challenge-id-here", // Ersetze dies durch die echte Challenge-ID
        "Beschreibung zur Challenge" // Beschreibung der Challenge
      );
  
      if (success) {
        alert("Foto erfolgreich gespeichert!");
        onClose();
      } else {
        console.log("Fehler beim Speichern des Fotos. :(")
        alert("Fehler beim Speichern des Fotos.");
      }
    }
  };
  

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePhoto}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendPhoto}>
            <Text style={styles.sendText}>Senden</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cameraUI}>
          <TouchableOpacity
            style={styles.switchButton}
            onPress={handleSwitchCamera}
          >
            <Ionicons name="camera-reverse" size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleTakePicture}
          >
            <View style={styles.innerCircle} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  cameraUI: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    backgroundColor: "transparent",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  innerCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 30,
  },
  switchButton: {
    position: "absolute",
    left: 20,
    bottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 20,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  deleteButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 20,
  },
  sendButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#007aff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  sendText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
