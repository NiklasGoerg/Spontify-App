import { Friend } from "@/types";
import { supabase } from "../supabaseClient";
import { mockPosts } from "@/assets/dummydata";
import AsyncStorage from "@react-native-async-storage/async-storage";

// posts von user abrufen (Maike) -> fetchPostsByUser
export const fetchPostsByUser = async (userId: string) => {
    if (!userId) {
      console.error("Fehlende userId.");
      return null;
    }
  
    try {
      // Alle Freunde des Nutzers abrufen
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
  
      // Beiträge der Freunde abrufen
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("user_id, photo_url, challenge_id")
        .in("user_id", friendIds)
        .order("created_at", { ascending: false });
  
      if (postsError) {
        console.error("Fehler beim Abrufen der Beiträge:", postsError);
        return null;
      }
  
      console.log("Beiträge erfolgreich abgerufen:", posts);
      return posts;
    } catch (err) {
      console.error("Unerwarteter Fehler beim Abrufen der Beiträge:", err);
      return null;
    }
  };
  

// (Maike) -> savePost
export const savePost = async (userId: string, challengeId: string, photoUrl: string, description: string) => {
    if (!userId || !challengeId || !photoUrl || !description) {
      console.error("Fehlende Werte: userId, challengeId, photoUrl oder description ist leer.");
      return null;
    }
  
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([
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
      return data;
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
    const { data, error } = await supabase
      .from("comments")
      .insert([
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
export const saveReaction = async (postId: string, userId: string, reactionType: string | undefined) => {
    if (!postId || !userId || !reactionType) {
      console.error("Fehlende Werte: postId, userId oder reactionType ist leer.");
      return null;
    }
  
    try {
      const { data, error } = await supabase
        .from("reactions")
        .insert([
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
  
  
// posts von freunden abrufen (Niklas)
export const fetchFriendsPosts = async (friends: Friend[]) => {
  let posts: any[] = [];
  for (const friend of friends) {
    const postsOfFriend = await fetchPostsByUser(friend.friend_id);
    posts = posts.concat(postsOfFriend);
  }
  await savePostsOnDevice(posts);
  console.log(await loadPostsFromDevice());
  return posts;
};

const savePostsOnDevice = async (posts: any[]) => {
  try {
    const jsonData = JSON.stringify(posts);
    await AsyncStorage.setItem("posts", jsonData);
    console.log("Posts erfolgreich gespeichert!");
  } catch (error) {
    console.error("Fehler beim Speichern der Posts:", error);
  }
};

const loadPostsFromDevice = async () => {
  try {
    const jsonData = await AsyncStorage.getItem("posts");
    return jsonData != null ? JSON.parse(jsonData) : [];
  } catch (error) {
    console.error("Fehler beim Laden der Posts:", error);
    return [];
  }
};
