export type User = {
  userId: string;
  username: string;
  email: string;
  profilePictureUrl: string;
  friends: string[];
};

export type challengeComment = {
  id: string;
  content: string;
  userId: string;
  submittedAt: string;
};

export type challengeReaction = {
  id: string;
  reaction: string;
  userId: string;
  submittedAt: string;
};

export type PostType = {
  id: string;
  challenge: string;
  imageOrVideo: string;
  imageUrl?: string;
  videoUrl?: string;
  user: {
    id: string;
    username: string;
    profilePictureUrl: string;
  };
  submittedAt: string;
  location: string;
  comments: challengeComment[];
  reactions: challengeReaction[];
};
