export type Sentiment = "positive" | "neutral" | "negative";

export interface Post {
  id: string;
  content: string;
  created_at: string; // ISO string
  upvotes: number;
  downvotes: number;
  sentiment: Sentiment;
}

export interface TrendingTopic {
  tag: string;
  score: number;
  post_count: number;
}

export interface FeedResponse {
  posts: Post[];
  trending: TrendingTopic[];
}
