import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { supabase } from "../supabaseClient";
import { getRandomChallenge } from "../api/challenges";
import { fetchPreferences } from "../api/preferences";
import NetInfo from "@react-native-community/netinfo";
import { uploadImageAndSavePost } from "../api/posts"; // Nutze nur uploadImageAndSavePost
import { loadChallengesFromDevice } from "../api/challenges";
import { Link } from "expo-router";

export default function ChallengeScreen() {
  const [isChallengeAccepted, setIsChallengeAccepted] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      const state = await NetInfo.fetch();
      setIsOffline(!state.isConnected);
    };

    const loadChallenge = async () => {
      if (isOffline) {
        const challenge = loadChallengesFromDevice();
        setDailyChallenge(challenge);
      } else {
        const userPreferences = await fetchPreferences();
        const preferences = Object.keys(userPreferences).filter(
          (key) => userPreferences[key],
        );
        const challenge = await getRandomChallenge(preferences);
        setDailyChallenge(challenge);
      }
    };

    checkNetworkStatus();
    loadChallenge();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
      loadChallenge();
    });

    return () => unsubscribe();
  }, [isOffline]);

  const handleAcceptChallenge = () => {
    setIsChallengeAccepted(true);
  };

  const compressImage = async (uri: string) => {
    try {
      const result = await ImageManipulator.manipulateAsync(uri, [], {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      return result.uri;
    } catch (err) {
      console.error("Fehler bei der Komprimierung:", err);
      return uri;
    }
  };

  const handleOpenCamera = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      Alert.alert(
        "Fehler",
        "Nur angemeldete Benutzer können diese Funktion nutzen.",
      );
      return;
    }

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Berechtigung benötigt",
        "Du musst die Kamera-Berechtigung erteilen!",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const compressedUri = await compressImage(result.assets[0].uri);

      // Nutze uploadImageAndSavePost für Online- und Offline-Speicherung
      const postData = await uploadImageAndSavePost(
        compressedUri,
        user.id,
        dailyChallenge.id,
        "Beschreibung des Posts", // Hier kannst du eine Beschreibung hinzufügen
      );

      if (postData) {
        setPhotoUri(
          "https://plus.unsplash.com/premium_photo-1686865496874-88f234809983?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ); // Zeige das Bild an
        Alert.alert("Erfolg", "Die Herausforderung wurde abgeschlossen!");
      } else {
        Alert.alert(
          "Fehler",
          "Die Herausforderung konnte nicht abgeschlossen werden.",
        );
      }
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
          <Link href="/" style={styles.finishButton}>
            <TouchableOpacity>
              <Text style={styles.buttonText}>Zurück zum Feed</Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        <>
          <Link href="/">
            <View style={styles.topBar}>
              <TouchableOpacity>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
          </Link>
          <Text style={styles.title}>Deine Challenge für heute</Text>
          {dailyChallenge ? (
            <View>
              <Text style={styles.challengeTitle}>{dailyChallenge.title}</Text>
              <Text style={styles.challengeDescription}>
                {dailyChallenge.description}
              </Text>
            </View>
          ) : (
            <Text style={styles.description}>
              Keine Challenge verfügbar. Überprüfe deine Präferenzen.
            </Text>
          )}
          <View style={styles.buttonsContainer}>
            {!isChallengeAccepted ? (
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAcceptChallenge}
              >
                <Text style={styles.buttonText}>Challenge annehmen</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleOpenCamera}
              >
                <Text style={styles.buttonText}>Kamera öffnen</Text>
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
    height: 300,
    resizeMode: "cover",
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
  challengeTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  challengeDescription: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
  finishButton: {
    backgroundColor: "#4CAF50",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  topBar: {
    position: "absolute",
    top: -220,
    right: -180,
    height: 60,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 25,
    backgroundColor: "#000",
    borderRadius: 80,
  },
  closeButton: {
    color: "#ffffff",
    fontSize: 24,
  },
});
