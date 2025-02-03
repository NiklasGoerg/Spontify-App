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
import NetInfo from "@react-native-community/netinfo";
import {
  getRandomChallenge,
  loadChallengesFromDevice,
  saveChallengesOnDevice,
  fetchChallenges,
} from "../api/challenges";
import { fetchPreferences } from "../api/preferences";
import { uploadImageAndSavePost } from "../api/posts";
import { Link } from "expo-router";
import { checkConnectionOnWeb } from "@/api/profile";

export default function ChallengeScreen() {
  const [isChallengeAccepted, setIsChallengeAccepted] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      const state = await NetInfo.fetch();
      const onlineStatus = state.isConnected ?? (await checkConnectionOnWeb());
      setIsOffline(!onlineStatus);
      return onlineStatus;
    };

    const loadChallenge = async () => {
      const online = await checkNetworkStatus();

      if (!online) {
        console.log("Offline-Modus: Lade gespeicherte Challenges...");
        const storedChallenges = await loadChallengesFromDevice();
        if (storedChallenges.length > 0) {
          setDailyChallenge(storedChallenges[0]);
        } else {
          console.warn("Keine Challenges im lokalen Speicher gefunden.");
        }
        return;
      }

      console.log("Online-Modus: Lade neue Challenge...");
      const userPreferences = await fetchPreferences();
      const preferences = Object.keys(userPreferences).filter(
        (key) => userPreferences[key],
      );
      const challenge = await getRandomChallenge(preferences);
      setDailyChallenge(challenge);

      if (challenge) {
        const allChallenges = await fetchChallenges();
        await saveChallengesOnDevice(allChallenges); // Speichere Herausforderungen offline
      }
    };

    loadChallenge();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
      loadChallenge();
    });

    return () => unsubscribe();
  }, []);

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
      console.error("Fehler bei der Bildkomprimierung:", err);
      return uri;
    }
  };

  const handleOpenCamera = async () => {
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

      if (isOffline) {
        console.log("Offline: Bild wird lokal gespeichert.");
        setPhotoUri(compressedUri);
        Alert.alert("Offline", "Das Bild wurde lokal gespeichert.");
      } else {
        console.log("Online: Bild wird hochgeladen.");
        const postData = await uploadImageAndSavePost(
          compressedUri,
          "user_id",
          dailyChallenge.id,
          "Beschreibung des Posts",
        );

        if (postData) {
          setPhotoUri(compressedUri);
          Alert.alert("Erfolg", "Die Herausforderung wurde abgeschlossen!");
        } else {
          Alert.alert(
            "Fehler",
            "Die Herausforderung konnte nicht abgeschlossen werden.",
          );
        }
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
  buttonsContainer: { width: "100%", alignItems: "center", marginTop: 20 },
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
  buttonText: { color: "#ffffff", fontSize: 18, textAlign: "center" },
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
