import { PostType, User } from "@/types";

const mockUsers: User[] = [
  {
    userId: "1",
    username: "user1",
    email: "user1@example.com",
    profilePictureUrl: "https://example.com/user1.jpg",
    friends: ["2", "3"]
  },
  {
    userId: "2",
    username: "user2",
    email: "user2@example.com",
    profilePictureUrl: "https://example.com/user2.jpg",
    friends: ["1", "4"]
  },
  {
    userId: "3",
    username: "user3",
    email: "user3@example.com",
    profilePictureUrl: "https://example.com/user3.jpg",
    friends: ["1", "5"]
  },
  {
    userId: "4",
    username: "user4",
    email: "user4@example.com",
    profilePictureUrl: "https://example.com/user4.jpg",
    friends: ["2"]
  },
  {
    userId: "5",
    username: "user5",
    email: "user5@example.com",
    profilePictureUrl: "https://example.com/user5.jpg",
    friends: ["3"]
  }
];

const mockPosts: PostType[] = [
  {
    id: "1",
    challenge: "Mache einen Handstand!",
    user: {
      id: "1",
      username: "user1",
      profilePictureUrl: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    submittedAt: new Date().toISOString(),
    imageOrVideo: "image",
    imageUrl: "https://images.unsplash.com/photo-1552196527-90dc99d938bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI5fF9oYi1kbDRRLTRVfHxlbnwwfHx8fHw%3D",
    location: "Berlin",
    comments: [],
    reactions: []
  },
  {
    id: "2",
    challenge: "Mache einen Trick auf Skiern oder dem Snowboard!",
    user: {
      id: "2",
      username: "user2",
      profilePictureUrl: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    submittedAt: new Date().toISOString(),
    imageOrVideo: "image",
    imageUrl: "https://images.unsplash.com/photo-1736267737328-26c39ef475c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDQ1fEJuLURqcmNCcndvfHxlbnwwfHx8fHw%3D",
    location: "Berlin",
    comments: [],
    reactions: []
  },
  {
    id: "3",
    challenge: "Schwing dich mal wieder aufs Skateboard!",
    user: {
      id: "3",
      username: "user3",
      profilePictureUrl: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    submittedAt: new Date().toISOString(),
    imageOrVideo: "image",
    imageUrl: "https://images.unsplash.com/photo-1552196527-90dc99d938bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI5fF9oYi1kbDRRLTRVfHxlbnwwfHx8fHw%3D",
    location: "Berlin",
    comments: [],
    reactions: []
  },
  {
    id: "4",
    challenge: "Laufe einen Marathon!",
    user: {
      id: "4",
      username: "user4",
      profilePictureUrl: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    submittedAt: new Date().toISOString(),
    imageOrVideo: "image",
    imageUrl: "https://images.unsplash.com/photo-1552196527-90dc99d938bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI5fF9oYi1kbDRRLTRVfHxlbnwwfHx8fHw%3D",
    location: "Berlin",
    comments: [],
    reactions: []
  },
  {
    id: "5",
    challenge: "Schwimme im kalten Wasser!",
    user: {
      id: "5",
      username: "user5",
      profilePictureUrl: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    submittedAt: new Date().toISOString(),
    imageOrVideo: "image",
    imageUrl: "https://images.unsplash.com/photo-1552196527-90dc99d938bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI5fF9oYi1kbDRRLTRVfHxlbnwwfHx8fHw%3D",
    location: "Berlin",
    comments: [],
    reactions: []
  }
];
export const fetchPosts = async (): Promise<PostType[]> => {
  // Simulating an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPosts);
    }, 1000);
  });
};

export const getPostsByUserId = (userId: string): PostType[] => {
  return mockPosts.filter(post => post.user.id === userId);
};

export const getFriendsByUserId = (userId: string): User[] => {
  const user = mockUsers.find(user => user.userId === userId);
  if (!user) return [];
  return mockUsers.filter(u => user.friends.includes(u.userId));
};

export const getRecentPostsByFriends = (userId: string): PostType[] => {
  const friends = getFriendsByUserId(userId);
  const friendIds = friends.map(friend => friend.userId);
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  return mockPosts.filter(post => friendIds.includes(post.user.id) && new Date(post.submittedAt) > twoDaysAgo);
};