import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router"; // Für die Verlinkung

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Link href="/">
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </Link>
      </View>

      <View style={styles.profileContainer}>
        {/* Profilbild */}
        <Image
          source={require("@/assets/images/profile-pic.jpg")}
          style={styles.profileImage}
        />

        {/* Benutzerinformationen */}
        <Text style={styles.userName}>Name Platzhalter</Text>
        <Text style={styles.userEmail}>email Platzhalter</Text>

        {/* Abschnitt Challenge Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>CHALLENGE SETTINGS</Text>
          {/* Button 2: Challenge preference */}
          <Link href="/ChallengeTypesScreen" asChild>
            <TouchableOpacity style={styles.challengeButton}>
              <Text style={styles.challengeButtonText}>
                Challenge preference
              </Text>
              <Text style={styles.arrow}>&gt;</Text> {/* Pfeil */}
            </TouchableOpacity>
          </Link>
        </View>

        {/* Button: Logout */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  topBar: {
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 10,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#1864B7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 30,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsSection: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  challengeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e1e1e",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  challengeButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  arrow: {
    fontSize: 16,
    color: "#fff",
  },
});
