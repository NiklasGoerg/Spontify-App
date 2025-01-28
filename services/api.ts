import { mockPosts, mockUsers } from "@/assets/dummydata";
import { PostType, User } from "@/types";

export const fetchPosts = async (): Promise<PostType[]> => {
  // Simulating an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPosts);
    }, 1000);
  });
};

export const getPostsByUserId = (userId: string): PostType[] => {
  return mockPosts.filter((post) => post.user.id === userId);
};

export const getFriendsByUserId = (userId: string): User[] => {
  const user = mockUsers.find((user) => user.userId === userId);
  if (!user) return [];
  return mockUsers.filter((u) => user.friends.includes(u.userId));
};

export const getRecentPostsByFriends = (userId: string): PostType[] => {
  const friends = getFriendsByUserId(userId);
  const friendIds = friends.map((friend) => friend.userId);
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  return mockPosts.filter(
    (post) =>
      friendIds.includes(post.user.id) &&
      new Date(post.submittedAt) > twoDaysAgo,
  );
};
