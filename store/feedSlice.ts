import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from "../types";

const initialPosts: PostType[] = [];

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    posts: initialPosts,
  },
  reducers: {
    setPosts: (state, action: PayloadAction<PostType[]>) => {
      state.posts = action.payload;
    },
  },
});

export const { setPosts } = feedSlice.actions;
export default feedSlice.reducer;
