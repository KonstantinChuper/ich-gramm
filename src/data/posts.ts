interface Comment {
  user: string;
  message: string;
  timestamp: Date;
}

interface Post {
  photoUrl: string;
  hasStory: boolean;
  isFolowed: boolean;
  isLiked: boolean;
  username: string;
  postedAt: Date;
  postImage: string;
  likes: number;
  description?: string;
  comments: Comment[];
}

const examplePost: Post = {
  photoUrl: "/data/profile.png",
  hasStory: true,
  isFolowed: false,
  isLiked: false,
  username: "sashaa",
  postedAt: new Date(),
  postImage: "/data/post-foto.png",
  likes: 120,
  description: "𝘐𝘵’𝘴 𝒈𝒐𝒍𝒅𝒆𝒏, 𝘗𝘰𝘯𝘺𝘣𝘰𝘺!",
  comments: [
    {
      user: "sashaa",
      message: "Great post! I really enjoyed the content and the picture quality is amazing.",
      timestamp: new Date(),
    },
    {
      user: "alex_smith",
      message: "Nice picture! The colors are so vibrant and the composition is perfect.",
      timestamp: new Date(),
    },
    {
      user: "john_doe",
      message: "Amazing shot! You have a great eye for photography.",
      timestamp: new Date(),
    },
    {
      user: "jane_doe",
      message: "Love this! The scenery is breathtaking and the moment is captured beautifully.",
      timestamp: new Date(),
    },
    {
      user: "mike_ross",
      message: "Beautiful scenery! This place looks like a paradise on earth.",
      timestamp: new Date(),
    },
    {
      user: "rachel_zane",
      message: "Stunning view! I wish I could visit this place someday.",
      timestamp: new Date(),
    },
    {
      user: "harvey_specter",
      message: "Incredible! The detail in this photo is just outstanding.",
      timestamp: new Date(),
    },
    {
      user: "louis_litt",
      message: "Wow, just wow! This is one of the best photos I've seen in a while.",
      timestamp: new Date(),
    },
    {
      user: "donna_paulsen",
      message: "Absolutely gorgeous! The lighting and the angle are perfect.",
      timestamp: new Date(),
    },
    {
      user: "jessica_pearson",
      message: "So beautiful! This picture really captures the essence of the place.",
      timestamp: new Date(),
    },
    {
      user: "katrina_bennett",
      message: "This is fantastic! The clarity and the colors are just amazing.",
      timestamp: new Date(),
    },
    {
      user: "stuart_bloom",
      message: "Great capture! You have a real talent for photography.",
      timestamp: new Date(),
    },
  ],
};

export type { Post };
export { examplePost };
