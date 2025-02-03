import { Friend } from "@/types";
import { supabase } from "../supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../store/store";
import {
  setPosts,
  setUser,
  setFriends,
  setChallenges,
} from "../store/feedSlice";
import { Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import NetInfo from "@react-native-community/netinfo";
import { checkConnectionOnWeb, loadUserFromDevice } from "./profile";

// posts von user abrufen (Maike) -> fetchPostsByUser
export const fetchPostsByUser = async (userId: string) => {
  if (!userId) {
    console.error("Fehlende userId.");
    return null;
  }

  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected || !(await checkConnectionOnWeb())) {
    console.log("Offline-Modus: Beiträge werden nicht von API geladen.");
    return loadPostsFromDevice(); // Direkt lokale Daten laden
  }

  try {
    const { data: friends, error: friendsError } = await supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", userId)
      .eq("status", "active");

    if (friendsError) {
      console.error("Fehler beim Abrufen der Freunde:", friendsError);
      return null;
    }

    const friendIds = friends.map((friend: any) => friend.friend_id);

    if (friendIds.length === 0) {
      console.log("Keine Freunde gefunden.");
      return [];
    }

    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("user_id, photo_url, challenge_id, created_at")
      .in("user_id", friendIds)
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error("Fehler beim Abrufen der Beiträge:", postsError);
      return null;
    }

    console.log("Beiträge erfolgreich abgerufen:", posts);
    store.dispatch(setPosts(posts));
    await savePostsOnDevice(posts); // Speichere für Offline-Zugriff

    return posts;
  } catch (err) {
    console.error("Unerwarteter Fehler beim Abrufen der Beiträge:", err);
    return null;
  }
};

// (Maike) -> savePost
export const savePost = async (
  userId: string,
  challengeId: string,
  photoUrl: string,
  description: string,
) => {
  if (!userId || !challengeId || !photoUrl || !description) {
    console.error(
      "Fehlende Werte: userId, challengeId, photoUrl oder description ist leer.",
    );
    return null;
  }

  try {
    const { data, error } = await supabase.from("posts").insert([
      {
        user_id: userId,
        challenge_id: challengeId,
        photo_url: photoUrl,
        description: description,
      },
    ]);

    if (error) {
      console.error("Fehler beim Speichern des Posts:", error);
      return null;
    }

    console.log("Post erfolgreich gespeichert:", data);
    return data ?? "keine Daten";
  } catch (err) {
    console.error("Unerwarteter Fehler beim Speichern des Posts:", err);
    return null;
  }
};

// (Maike) saveComment
export const saveComment = async (postId: any, userId: any, content: any) => {
  if (!postId || !userId || !content) {
    console.error("Fehlende Werte: postId, userId oder content ist leer.");
    return null;
  }

  try {
    const { data, error } = await supabase.from("comments").insert([
      {
        post_id: postId,
        user_id: userId,
        content: content,
      },
    ]);

    if (error) {
      console.error("Fehler beim Speichern des Kommentars:", error);
      return null;
    }

    console.log("Kommentar erfolgreich gespeichert:", data);
    return data;
  } catch (err) {
    console.error("Unerwarteter Fehler beim Speichern des Kommentars:", err);
    return null;
  }
};

// Kommentare abrufen
export const fetchComments = async (postId: string) => {
  if (!postId) {
    console.error("Fehlende postId.");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("comments")
      .select("user_id, content")
      .eq("post_id", postId);

    if (error) {
      console.error("Fehler beim Abrufen der Kommentare:", error);
      return null;
    }

    console.log("Kommentare erfolgreich abgerufen:", data);
    return data;
  } catch (err) {
    console.error("Unerwarteter Fehler beim Abrufen der Kommentare:", err);
    return null;
  }
};

// (Maike) -> saveReaction
export const saveReaction = async (
  postId: string,
  userId: string,
  reactionType: string | undefined,
) => {
  if (!postId || !userId || !reactionType) {
    console.error("Fehlende Werte: postId, userId oder reactionType ist leer.");
    return null;
  }

  try {
    const { data, error } = await supabase.from("reactions").insert([
      {
        post_id: postId,
        user_id: userId,
        reaction_type: reactionType,
      },
    ]);

    if (error) {
      console.error("Fehler beim Speichern der Reaktion:", error);
      return null;
    }

    console.log("Reaktion erfolgreich gespeichert:", data);
    return data;
  } catch (err) {
    console.error("Unerwarteter Fehler beim Speichern der Reaktion:", err);
    return null;
  }
};

// Reaktionen abrufen
export const fetchReactions = async (postId: string) => {
  if (!postId) {
    console.error("Fehlende postId.");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("reactions")
      .select("user_id, reaction_type")
      .eq("post_id", postId);

    if (error) {
      console.error("Fehler beim Abrufen der Reaktionen:", error);
      return null;
    }

    console.log("Reaktionen erfolgreich abgerufen:", data);
    return data;
  } catch (err) {
    console.error("Unerwarteter Fehler beim Abrufen der Reaktionen:", err);
    return null;
  }
};

export const uploadImage = async (uri: string) => {
  try {
    console.log("Start Upload mit URI:", uri);

    // Prüfe, ob der Benutzer angemeldet ist
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      Alert.alert(
        "Fehler",
        "Nur angemeldete Benutzer können Dateien hochladen.",
      );
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
      return null;
    }

    console.log("Upload erfolgreich:", data);

    // Hole die öffentliche URL
    /*const { publicUrl } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);
      */

    const baseUrl =
      "xbszoksbpwbmvjfjjcjl.supabase.co/storage/v1/object/public/images/";
    const publicUrl = `${baseUrl}${data.path}`;

    console.log("data.path:", data.path);
    console.log("Öffentliche URL:", publicUrl);

    return publicUrl;
  } catch (err) {
    console.error("Fehler beim Hochladen:", err);
    return null;
  }
};

export const savePostsOnDevice = async (posts: any[]): Promise<any[]> => {
  try {
    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        if (!post.photo_url) return post;

        if (Platform.OS === "android" || Platform.OS === "ios") {
          // Auf Android und iOS speichern wir das Bild lokal
          const fileUri = `${FileSystem.documentDirectory}${post.user_id}.jpg`;

          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (!fileInfo.exists) {
            // Bild herunterladen und lokal speichern
            await FileSystem.downloadAsync(
              `https://${post.photo_url}`,
              fileUri,
            );
          }

          return { ...post, photo_url: fileUri }; // Speichert lokalen Datei-Pfad
        } else {
          // Web: nicht speichern

          return post;
        }
      }),
    );

    // Posts in AsyncStorage speichern
    await AsyncStorage.setItem("posts", JSON.stringify(updatedPosts));
    return updatedPosts;
  } catch (error) {
    console.error("Fehler beim Speichern der Posts:", error);
    return [];
  }
};

export const loadPostsFromDevice = async () => {
  try {
    const jsonData = await AsyncStorage.getItem("posts");
    if (!jsonData) return [];

    let posts = JSON.parse(jsonData);

    return posts.map((post: any) => ({
      ...post,
      photo_url: post.photo_url || "", // Falls es keinen Wert gibt, leere Zeichenkette setzen
    }));
  } catch (error) {
    console.error("Fehler beim Laden der Posts:", error);
    return [];
  }
};

export const saveOfflinePost = async (
  challengeId: string,
  photoUri: string,
) => {
  const user = await loadUserFromDevice();
  const userId = user.id;
  console.log("loaded offline user", user, user.id);

  if (!userId || !challengeId || !photoUri) {
    console.error("Fehlende Werte: userId, challengeId oder photoUri.");
    return null;
  }

  try {
    let imageData = photoUri;

    if (Platform.OS === "web") {
      // Web: Lokale URL in Base64 umwandeln
      imageData = await convertImageToBase64(photoUri);
    } else {
      // Mobile: Bild als Base64 speichern
      imageData = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    const post = {
      userId,
      challengeId,
      photoUri: imageData, // Speichert Base64 auf Mobile und Web
    };

    await AsyncStorage.setItem("offlinePost", JSON.stringify(post));
    console.log("Offline-Post erfolgreich gespeichert.");
  } catch (err) {
    console.error("Fehler beim Speichern des Offline-Posts:", err);
  }
};

export const uploadOfflinePosts = async () => {
  try {
    const offlinePost = await AsyncStorage.getItem("offlinePost");

    if (!offlinePost) {
      console.log("Keine Offline-Posts zum Hochladen.");
      return;
    }

    const post = JSON.parse(offlinePost);

    if (!post.photoUri) {
      console.error("Offline-Post enthält kein Bild.");
      return;
    }

    let localFileUri = post.photoUri;

    if (Platform.OS === "web") {
      // Web: Base64 in Blob umwandeln und als Datei speichern
      const blob = base64ToBlob(post.photoUri);
      localFileUri = await blobToFile(blob, "offline-upload.jpg");
    } else {
      // Mobile: Base64 wieder in eine Datei speichern
      localFileUri = FileSystem.cacheDirectory + "offline-upload.jpg";
      await FileSystem.writeAsStringAsync(localFileUri, post.photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    console.log("Temporäre Datei erstellt:", localFileUri);

    // Post hochladen
    await uploadImageAndSavePost(
      localFileUri,
      post.userId,
      post.challengeId,
      post.description || "",
    );

    // Nach erfolgreichem Upload den Offline-Post löschen
    await AsyncStorage.removeItem("offlinePost");
    return localFileUri;
  } catch (err) {
    console.error("Fehler beim Hochladen der Offline-Posts:", err);
  }
};

// Web: Lokale URL in Base64 umwandeln
const convertImageToBase64 = async (imageUri: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(imageUri)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject("Fehler beim Konvertieren des Bildes.");
          }
        };
      })
      .catch((error) => reject(error));
  });
};

// Web: Base64 in Blob umwandeln
const base64ToBlob = (base64: string): Blob => {
  const byteCharacters = atob(base64.split(",")[1]); // Base64-Daten dekodieren
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: "image/jpeg" });
};

// Web: Blob in Datei umwandeln
const blobToFile = async (blob: Blob, fileName: string): Promise<File> => {
  return new File([blob], fileName, { type: blob.type });
};

export const uploadImageAndSavePost = async (
  uri: string | File,
  userId: string,
  challengeId: string,
  description: string,
) => {
  try {
    const photoUrl = await uploadImage(uri);

    if (!photoUrl) {
      console.error("Fehler beim Hochladen des Bildes.");
      return null;
    }

    console.log("Bild erfolgreich hochgeladen, URL:", photoUrl);

    const postData = await savePost(userId, challengeId, photoUrl, description);

    if (!postData) {
      console.error("Fehler beim Speichern des Posts.");
      return null;
    }

    console.log("Post erfolgreich gespeichert:", postData);
    return photoUrl;
  } catch (err) {
    console.error("Unerwarteter Fehler:", err);
    return null;
  }
};
