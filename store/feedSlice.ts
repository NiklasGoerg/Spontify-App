import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType, User, Challenge } from "../types";

const initialPosts: PostType[] = [];
const initialUser: User | null = null;
const initialFriends: User[] = [];
const initialChallenges: Challenge[] = [];

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    posts: initialPosts,
    user: initialUser,
    friends: initialFriends,
    challenges: initialChallenges,
    structuredPosts: [],
    online: false,
  },
  reducers: {
    setPosts: (state, action: PayloadAction<PostType[]>) => {
      state.posts = action.payload;
      feedSlice.caseReducers.setStructuredPosts(state);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      feedSlice.caseReducers.setStructuredPosts(state);
    },
    setFriends: (state, action: PayloadAction<User[]>) => {
      state.friends = action.payload;
      feedSlice.caseReducers.setStructuredPosts(state);
    },
    setChallenges: (state, action: PayloadAction<Challenge[]>) => {
      state.challenges = action.payload;
      feedSlice.caseReducers.setStructuredPosts(state);
    },
    setStructuredPosts: (state) => {
      const structuredPosts = state.posts.map((post) => {
        const user = state.friends.find(
          (friend) => friend.friend_id === post.user_id,
        );
        const challenge = state.challenges.find(
          (challenge) => challenge.id === post.challenge_id,
        );
        return { ...post, user, challenge };
      });
      state.structuredPosts = structuredPosts;
    },
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    },
  },
});

export const {
  setPosts,
  setUser,
  setFriends,
  setChallenges,
  setStructuredPosts,
  setOnline,
} = feedSlice.actions;

// Selector für structuredPosts
export const selectStructuredPosts = (
  posts: any[],
  friends: any[],
  challenges: any[],
) => {
  const feed = posts.map((post) => {
    const user = friends.find((friend) => friend.friend_id === post.user_id);
    const challenge = challenges.find(
      (challenge) => challenge.id === post.challenge_id,
    );
    return { ...post, user, challenge, reactions: [], comments: [] };
  });
  console.log("selectStructuredPosts: ", feed, friends, challenges);
  return feed;
};

export default feedSlice.reducer;
