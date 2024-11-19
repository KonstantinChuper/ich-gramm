interface Post {
  _id: string;
  user_id: {
    _id: string;
    username?: string;
    avatar_url?: string;
  };
  image_url: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export type { Post };
