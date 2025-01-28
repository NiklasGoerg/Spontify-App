import { supabase } from "../supabaseClient";

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
}

// posts von freunden abrufen (Niklas)
export const fetchFriendsPosts = async () => {
    
};
