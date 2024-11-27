import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Alert } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import ChallengeScreen from "./challengeScreen";

// Firebase-Konfiguration importieren
const firebaseConfig = {
  apiKey: "AIzaSyD63f9TUicXWEVnm7vYM-g6uTOUtwazPcs",
  authDomain: "spontify-backend.firebaseapp.com",
  projectId: "spontify-backend",
  storageBucket: "spontify-backend.firebasestorage.app",
  messagingSenderId: "436955983049",
  appId: "1:436955983049:web:fd51cd9e99c54c01f43118",
  measurementId: "G-PJV1RVX4KB"
};

// Firebase-App initialisieren
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function HomeScreen() {
  const [showChallengeScreen, setShowChallengeScreen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Erfolg: Neuer Benutzer wurde erstellt
        const user = userCredential.user;
        Alert.alert("Erfolg", `Benutzer erstellt: ${user.email}`);
        setShowChallengeScreen(true);
      })
      .catch((error) => {
        // Fehler bei der Registrierung
        Alert.alert("Fehler", error.message);
      });
  };

  return (
    <View style={styles.container}>
      {showChallengeScreen ? (
        <ChallengeScreen />
      ) : (
        <>
          <View style={styles.signupContainer}>
            <TextInput
              style={styles.input}
              placeholder="E-Mail"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Passwort"
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
              <Text style={styles.signupButtonText}>Registrieren</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.challengeButton}
            onPress={() => setShowChallengeScreen(true)}
          >
            <Text style={styles.challengeButtonText}>Challenge Me</Text>
          </TouchableOpacity>
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
  signupContainer: {
    marginBottom: 20,
    width: "80%",
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
