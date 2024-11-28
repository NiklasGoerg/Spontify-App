import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import LoginForm from "./login";
import ChallengeScreen from "./challengeScreen";

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyD63f9TUicXWEVnm7vYM-g6uTOUtwazPcs",
  authDomain: "spontify-backend.firebaseapp.com",
  projectId: "spontify-backend",
  storageBucket: "spontify-backend.firebasestorage.app",
  messagingSenderId: "436955983049",
  appId: "1:436955983049:web:fd51cd9e99c54c01f43118",
  measurementId: "G-PJV1RVX4KB"
};

// Initialise Firebase-app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null); 

  // Authentication status monitoring
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });
    return unsubscribe; 
  }, []);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Alert.alert("Erfolg", `Benutzer erstellt: ${userCredential.user.email}`);
      })
      .catch((error) => {
        Alert.alert("Fehler bei der Registrierung", error.message);
      });
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Alert.alert("Erfolg", `Willkommen zurück, ${userCredential.user.email}`);
      })
      .catch((error) => {
        Alert.alert("Fehler bei der Anmeldung", error.message);
      });
  };

  return (
    <View style={styles.container}>
      {user ? (
        <ChallengeScreen />
      ) : (
        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onRegister={handleSignUp}
          onLogin={handleLogin}
        />
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
});
