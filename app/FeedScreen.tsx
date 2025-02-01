import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import Feed from "@/components/feed/Feed";
import { PostType } from "../types";
import ChallengeButton from "@/components/feed/challengeButton";
import { Link } from "expo-router"; // Importiere Link
import { setOnline } from "@/store/feedSlice";

const FeedScreen = (online: boolean) => {
  useEffect(() => {
    setOnline(online);
    if (!online) {
      Alert.alert("Keine Internetverbindung");
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Link href="/FriendManagementScreen" asChild>
          <TouchableOpacity>
            <Image
              source={require("@/assets/images/friends.svg")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </Link>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />

        <Link href="/ProfileScreen" asChild>
          <TouchableOpacity>
            <Image
              source={require("@/assets/images/profile-pic.jpg")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </Link>
      </View>
      <ScrollView contentContainerStyle={styles.feedContainer}>
        <Feed />
      </ScrollView>
      <ChallengeButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    width: "100%",
  },
  topBar: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#1e1e1e",
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  feedContainer: {
    paddingBottom: 20,
  },
});

export default FeedScreen;
