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
import * as ImageManipulator from "expo-image-manipulator";
import { supabase } from "../supabaseClient";
import * as FileSystem from "expo-file-system";
import { getRandomChallenge } from "../api/challenges";
import { useEffect } from "react";
import { fetchPreferences } from "../api/preferences";

import { Link } from "expo-router";

export default function ChallengeScreen() {
  const [isChallengeAccepted, setIsChallengeAccepted] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);

  useEffect(() => {
    const loadChallenge = async () => {
      const userPreferences = await fetchPreferences(); // Hole die Präferenzen des Nutzers
      const preferences = Object.keys(userPreferences).filter(
        (key) => userPreferences[key]
      ); // Nur aktivierte Präferenzen
      const challenge = await getRandomChallenge(preferences);
      setDailyChallenge(challenge);
    };
  
    loadChallenge();
  }, []);

  const handleAcceptChallenge = () => {
    setIsChallengeAccepted(true);
  };

  const compressImage = async (uri: string) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [],
        {
          compress: 0.7, // Reduziert die Qualität auf 70%
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      console.log("Komprimierte URI:", result.uri);
      return result.uri;
    } catch (err) {
      console.error("Fehler bei der Komprimierung:", err);
      return uri; // Falls die Komprimierung fehlschlägt, nutze die Original-URI
    }
  };


  const uploadToSupabase = async (uri: string) => {
    try {
      console.log("Start Upload mit URI:", uri);
  
      // Prüfe, ob der Benutzer angemeldet ist
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
  
      if (authError || !user) {
        Alert.alert("Fehler", "Nur angemeldete Benutzer können Dateien hochladen.");
        console.error("Fehler bei der Benutzerüberprüfung:", authError?.message);
        return null;
      }
  
      console.log("Angemeldeter Benutzer:", user.email);
  
      // Lade die Datei von der URI
      const response = await fetch(uri);
      if (!response.ok) {
        console.error("Fehler beim Abrufen der Datei:", response.statusText);
        Alert.alert("Fehler", "Die Datei konnte nicht gelesen werden.");
        return null;
      }
  
      const blob = await response.blob();
      console.log("Blob erstellt, Größe:", blob.size);
  
      // Konvertiere den Blob in einen ArrayBuffer mit FileReader
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(blob);
      });
      console.log("ArrayBuffer erstellt, Größe:", arrayBuffer.byteLength);
  
      // Erstelle einen Dateinamen (z. B. userID/timestamp.jpg)
      const fileName = `images/${user.id}/${Date.now()}.jpg`;
  
      // Lade die Datei zu Supabase hoch
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, new Uint8Array(arrayBuffer), {
          contentType: "image/jpeg", // Dateityp angeben
          cacheControl: "3600", // Optional: Caching
          upsert: true, // Überschreiben, falls vorhanden
        });
  
      if (error) {
        console.error("Fehler beim Hochladen:", error.message);
        Alert.alert("Upload fehlgeschlagen", error.message);
        return null;
      }
  
      console.log("Upload erfolgreich:", data);
  
      // Hole die öffentliche URL
      /*const { publicUrl } = supabase.storage
        .from("images")
        .getPublicUrl(data.path);
        */

      const baseUrl = "xbszoksbpwbmvjfjjcjl.supabase.co/storage/v1/object/public/images/";
      const publicUrl = `${baseUrl}${data.path}`;

      console.log("data.path:", data.path)
      console.log("Öffentliche URL:", publicUrl);

      return publicUrl;
    } catch (err) {
      console.error("Fehler beim Hochladen:", err);
      Alert.alert("Upload fehlgeschlagen", "Ein unerwarteter Fehler ist aufgetreten.");
      return null;
    }
  };
  
  
  

  const handleOpenCamera = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
  
    if (error || !user) {
      Alert.alert("Fehler", "Nur angemeldete Benutzer können diese Funktion nutzen.");
      console.error("Fehler bei der Benutzerüberprüfung:", error?.message);
      return;
    }
  
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Berechtigung benötigt",
        "Du musst die Kamera-Berechtigung erteilen!"
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
            onPress: async () => {
              if (result.assets[0].uri) {
                console.log("Foto URI:", result.assets[0].uri);
  
                // Hochladen des Bildes
                const uploadedUrl = await uploadToSupabase(result.assets[0].uri);
                console.log("uploadedUrl__:", uploadedUrl);

                if (uploadedUrl) {
                  setPhotoUri(uploadedUrl); // Setze die URL
                  Alert.alert("Upload erfolgreich", "Das Foto wurde hochgeladen!");
                } else {
                  Alert.alert("Upload fehlgeschlagen", "Das Foto konnte nicht hochgeladen werden.");
                }
              }
            },
          },
        ],
        { cancelable: false }
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
          <Link href="/" style={styles.finishButton}>
            <TouchableOpacity >
              <Text style={styles.buttonText}>Accept Challenge</Text>
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
          <Text style={styles.title}>Your challenge for today</Text>
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
