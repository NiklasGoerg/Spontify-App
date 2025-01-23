import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ChallengeScreen() {
  const [isChallengeAccepted, setIsChallengeAccepted] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handleAcceptChallenge = () => {
    setIsChallengeAccepted(true);
  };

  const handleOpenCamera = async () => {
    // Berechtigungen anfordern
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Berechtigung benötigt",
        "Du musst die Kamera-Berechtigung erteilen!",
      );
      return;
    }

    // Native Kamera-App öffnen
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Ermöglicht das Zuschneiden und Zoomen
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Alert anzeigen, um das Foto zu bestätigen oder abzulehnen
      Alert.alert(
        "Foto bestätigen",
        "Möchtest du dieses Foto verwenden?",
        [
          {
            text: "Nein",
            style: "cancel",
          },
          {
            text: "Ja",
            onPress: () => setPhotoUri(result.assets[0].uri), // Foto speichern
          },
        ],
        { cancelable: false },
      );
    }
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <Text style={styles.successText}>
            Challenge erfolgreich abgeschlossen!
          </Text>
        </View>
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
    padding: 20,
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
    width: "100%",
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
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  previewImage: {
    width: "100%",
    height: 300, // Feste Höhe für das Bild
    resizeMode: "cover", // Bild wird zugeschnitten, um den Container zu füllen
    borderRadius: 10,
    marginBottom: 20,
  },
  successText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});
