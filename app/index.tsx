import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import store from "@/store/store";
import FeedScreen from "./FeedScreen";
import LoginForm from "./login";
import {
  initializeUser,
  loginUser,
  registerUser,
  logoutUser,
} from "@/api/profile";
import { scheduleDailyNotification } from "@/api/notification";

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [online, setOnline] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    initializeUser(setUser, setOnline);
    scheduleDailyNotification();
  }, []);

  return (
    <Provider store={store}>
      <View style={styles.container}>
        {user ? (
          <FeedScreen online={online} onSignOut={() => logoutUser(setUser)} />
        ) : (
          <LoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onRegister={() => registerUser(email, password, setUser)}
            onLogin={() => loginUser(email, password, setUser)}
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
