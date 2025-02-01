import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { supabase } from "../supabaseClient";
import {
  fetchFriends,
  searchUsers,
  addFriend,
  removeFriend,
} from "../api/friends";
import { Link } from "expo-router";

const FriendManagementScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Freunde und Benutzer-ID laden
  useEffect(() => {
    const loadFriendsAndUser = async () => {
      const user = await supabase.auth.getUser();
      if (user?.data?.user?.id) {
        setCurrentUserId(user.data.user.id); // Aktuelle Benutzer-ID speichern
      }

      const friendsData = await fetchFriends();
      setFriends(friendsData);
    };

    loadFriendsAndUser();
  }, []);

  // Nutzer suchen
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = await searchUsers(query);
    setSearchResults(results);
  };

  // Freund hinzufügen
  const handleAddFriend = async (friendId: string, friendName: string) => {
    const success = await addFriend(friendId, friendName);
    if (success) {
      const friendsData = await fetchFriends();
      setFriends(friendsData);
    }
  };

  // Freund entfernen
  const handleRemoveFriend = async (friendshipId: string) => {
    const success = await removeFriend(friendshipId);
    if (success) {
      const friendsData = await fetchFriends();
      setFriends(friendsData);
    }
  };

  // Überprüfen, ob ein Benutzer bereits ein Freund ist
  const isFriend = (friendId: string) => {
    return friends.some((friend) => friend.friend_id === friendId);
  };

  return (
    <View style={styles.container}>
      <Link href="/">
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={styles.logo}
                />
              </Link>
      {/* Suchfeld */}

      <TextInput
        style={styles.searchInput}
        placeholder="Freunde suchen..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Aktuelle Freunde anzeigen */}
      <Text style={styles.sectionTitle}>MY FRIENDS ({friends.length})</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Image
              source={{
                uri: item.avatar_url || "@/assets/images/profile-pic.jpg",
              }}
              style={styles.profileImage}
            />
            <Text style={styles.friendText}>{item.friend_name || "Unbekannt"}</Text>
            <TouchableOpacity
              onPress={() => handleRemoveFriend(item.id)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>✖</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Suchergebnisse für neue Freunde */}
      {searchResults.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>FIND FRIENDS</Text>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const alreadyFriend = isFriend(item.id);
              const isCurrentUser = item.id === currentUserId;

              return (
                <View style={styles.friendItem}>
                  <Image
                    source={{
                      uri: item.avatar_url || "@/assets/images/profile-pic.jpg",
                    }}
                    style={styles.profileImage}
                  />
                  <Text style={styles.friendText}>
                    {item.full_name || item.email}
                  </Text>
                  {!isCurrentUser && (
                    <TouchableOpacity
                      onPress={() =>
                        alreadyFriend
                          ? handleRemoveFriend(
                              friends.find((f) => f.friend_id === item.id)?.id || ""
                            )
                          : handleAddFriend(item.id, item.full_name || item.email)
                      }
                      style={alreadyFriend ? styles.removeButton : styles.addButton}
                    >
                      <Text style={alreadyFriend ? styles.removeButtonText : styles.addButtonText}>
                        {alreadyFriend ? "REMOVE" : "ADD"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendText: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  addButton: {
    backgroundColor: "#6C09ED",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#B71818",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
});

export default FriendManagementScreen;
