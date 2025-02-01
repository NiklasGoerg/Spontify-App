import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType, User, Challenge} from "../types";

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
  },
  reducers: {
    setPosts: (state, action: PayloadAction<PostType[]>) => {
      state.posts = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setFriends: (state, action: PayloadAction<User[]>) => {
      state.friends = action.payload;
    },
    setChallenges: (state, action: PayloadAction<Challenge[]>) => {
      state.challenges = action.payload;
    },
    setStructuredPosts: (state) => {
      const structuredPosts = state.posts.map((post) => {
        const user = state.friends.find((friend) => friend.id === post.user_id);
        const challenge = state.challenges.find((challenge) => challenge.id === post.challenge_id);
        return { ...post, user, challenge };
      });
      state.structuredPosts = structuredPosts;
    }
  },
});

export const { setPosts, setUser, setFriends, setChallenges, setStructuredPosts } = feedSlice.actions;

// Selector für structuredPosts
export const selectStructuredPosts = (state: any) => {
  return state.feed.posts.map((post: any) => {
    const user = state.feed.friends.find((friend: any) => friend.id === post.user_id);
    const challenge = state.feed.challenges.find((challenge: any) => challenge.id === post.challenge_id);
    return { ...post, user, challenge };
  });
};

export default feedSlice.reducer;