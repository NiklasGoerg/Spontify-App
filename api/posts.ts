import { Friend } from "@/types";
import { supabase } from "../supabaseClient";
import { mockPosts } from "@/assets/dummydata";
import AsyncStorage from "@react-native-async-storage/async-storage";

// posts von user abrufen (Maike)
export const fetchPostsByUser = async (userId: string) => {
  //...
  const data: any[] = [];
  return data || [];
};
// (Maike)
export const savePost = async (post: any) => {
  //...
  return true;
};
// (Maike)
export const saveComment = async (comment: any) => {
  //...
  return true;
};
// (Maike)
export const saveReaction = async (postId: string, reaction: string) => {
  //...
  return true;
};

// posts von freunden abrufen (Niklas)
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
