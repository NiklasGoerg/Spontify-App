import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Provider } from "react-redux";
import store from "@/store/store";
import FeedScreen from "./FeedScreen";
import LoginForm from "./login";
import {
  fetchSession,
  handleLogin,
  handleSignUp,
  handleSignOut,
} from "@/api/profile";

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [email, setEmail] = useState(""); // E-Mail des Benutzers
  const [password, setPassword] = useState(""); // Passwort des Benutzers

  // Authentifizierungsstatus überwachen
  useEffect(() => {
    const checkSession = async () => {
      const sessionUser = await fetchSession(setOnline);
      setUser(sessionUser);
    };

    checkSession();
  }, []);

  return (
    <Provider store={store}>
      <View style={styles.container}>
        {user ? (
          <FeedScreen
            online={online}
            onSignOut={() => handleSignOut(setUser)}
          />
        ) : (
          <LoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onRegister={async () =>
              await handleSignUp(email, password, setUser)
            }
            onLogin={async () => await handleLogin(email, password, setUser)}
          />
        )}
      </View>
    </Provider>
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
