interface User {
  _id: string;
  username: string;
  email: string;
  full_name: string;
  bio: string;
  profile_image: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  has_stories: boolean;
}

export type { User };
