export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  user: {
    username: string;
    avatar_url: string;
  };
}
